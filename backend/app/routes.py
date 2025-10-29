from flask import Blueprint, request, jsonify
from .spotify import create_playlist
from .billboard import scrape_chart
from .spotify import search_spotify_tracks
import json

api = Blueprint("api", __name__)

# File to store recent charts data
RECENT_CHARTS_FILE = "recent_charts.json"


def load_recent_charts():
    """Load recent charts data from file"""
    try:
        with open(RECENT_CHARTS_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_recent_charts(data):
    """Save recent charts data to file"""
    try:
        with open(RECENT_CHARTS_FILE, "w") as f:
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


@api.route("/scrape", methods=["GET"])
def scrape_billboard_data():
    date = request.args.get("date")
    limit = int(request.args.get("limit", 100))
    # Parse ?enrich=true to include Spotify links
    enrich = request.args.get("enrich", "false").lower() == "true"
    if not date:
        return jsonify({"success": False, "message": "Date is required"}), 400

    # Update recent charts with this date
    update_recent_charts(date)

    songs = scrape_chart(date, limit)
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
        import os
        import requests

        # Create a custom session that handles SSL properly
        session = requests.Session()
        session.verify = False  # Disable SSL verification

        sp = spotipy.Spotify(auth=access_token)
        user = sp.current_user()
        return jsonify({"success": True, "user": user})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@api.route("/create-playlist", methods=["POST"])
def create_spotify_playlist():
    data = request.get_json()
    date = data.get("date")
    limit = int(data.get("track_limit", 100))
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

    result = create_playlist(date, limit, access_token, selected_indices, custom_name)

    return jsonify(result)
