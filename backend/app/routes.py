import json
import os

from flask import Blueprint, request, jsonify
from sqlalchemy import text

from .chart_service import get_chart
from .models import db
from .spotify import create_playlist, search_spotify_tracks

api = Blueprint("api", __name__)

# Path to recent charts file (backend dir, so it works regardless of cwd)
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECENT_CHARTS_FILE = os.path.join(_backend_dir, "recent_charts.json")


def load_recent_charts():
    """Load recent charts data from file"""
    try:
        with open(RECENT_CHARTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_recent_charts(data):
    """Save recent charts data to file"""
    try:
        with open(RECENT_CHARTS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f)
    except (IOError, OSError):
        pass


def update_recent_charts(date):
    """Update recent charts with a new date"""
    charts = load_recent_charts()
    if date in charts:
        charts[date] += 1
    else:
        charts[date] = 1

    # Keep only top 10 most popular dates
    sorted_charts = sorted(charts.items(), key=lambda x: x[1], reverse=True)[:10]
    charts = dict(sorted_charts)

    save_recent_charts(charts)
    return charts


def _parse_limit(value, default=100):
    """Parse limit from query/body; return default if missing or invalid."""
    if value is None or value == "":
        return default
    try:
        n = int(value)
        return max(1, min(100, n)) if n else default
    except (ValueError, TypeError):
        return default


@api.route("/health", methods=["GET"])
def health():
    """Health check for deployment/load balancers. Returns 200 and verifies DB connectivity."""
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "ok", "database": "ok"}), 200
    except Exception as e:
        return jsonify({"status": "error", "database": str(e)}), 503


@api.route("/scrape", methods=["GET"])
def scrape_billboard_data():
    date = request.args.get("date")
    limit = _parse_limit(request.args.get("limit"))
    # Parse ?enrich=true to include Spotify links
    enrich = request.args.get("enrich", "false").lower() == "true"
    if not date:
        return jsonify({"success": False, "message": "Date is required"}), 400

    # Update recent charts with this date
    update_recent_charts(date)

    songs = get_chart(date, limit)
    if not songs:
        return jsonify({"success": False, "message": "No songs found"}), 404

    if enrich:
        year = date.split("-")[0]
        enriched_uris = search_spotify_tracks(songs, year)

        # Combine original + enriched
        combined = []
        for base, uri in zip(songs, enriched_uris):
            combined.append(
                {
                    "title": base["title"],
                    "artist": base["artist"],
                    "spotify_uri": uri,
                }
            )

        return jsonify({"success": True, "songs": combined})

    return jsonify({"success": True, "songs": songs})


@api.route("/recent-charts", methods=["GET"])
def get_recent_charts():
    """Get the most popular chart dates"""
    charts = load_recent_charts()
    # Convert to list of objects with date and count
    recent_charts = [{"date": date, "count": count} for date, count in charts.items()]
    return jsonify({"success": True, "charts": recent_charts})


@api.route("/test-auth", methods=["POST"])
def test_spotify_auth():
    data = request.get_json()
    access_token = data.get("access_token")

    if not access_token:
        return jsonify({"success": False, "message": "No access token provided"}), 400

    try:
        import spotipy

        from .http_utils import get_requests_session_for_outbound

        session = get_requests_session_for_outbound()
        kwargs = {}
        if session is not None:
            kwargs["requests_session"] = session
        sp = spotipy.Spotify(auth=access_token, **kwargs)
        user = sp.current_user()
        return jsonify({"success": True, "user": user})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@api.route("/create-playlist", methods=["POST"])
def create_spotify_playlist():
    data = request.get_json()
    date = data.get("date")
    limit = _parse_limit(data.get("track_limit"))
    access_token = data.get("access_token")
    print(f"Creating playlist with: {date}, {limit}, token: {bool(access_token)}")
    if access_token:
        print(f"Token preview: {access_token[:20]}...")

    if not date or not access_token:
        return jsonify(
            {"success": False, "message": "Date and access token required"}
        ), 400

    custom_name = data.get("custom_name")
    selected_indices = data.get("selected_indices", list(range(limit)))

    songs = get_chart(date, limit)
    if not songs:
        return jsonify({"success": False, "message": "No songs found"}), 404

    result = create_playlist(
        date=date,
        limit=limit,
        access_token=access_token,
        selected_indices=selected_indices,
        custom_name=custom_name,
        songs=songs,
    )

    return jsonify(result)
