from flask import Blueprint, request, jsonify
from .spotify import create_playlist
from .billboard import scrape_chart
from .spotify import search_spotify_tracks


api = Blueprint("api", __name__)


@api.route("/scrape", methods=["GET"])
def scrape_billboard_data():
    date = request.args.get("date")
    limit = int(request.args.get("limit", 100))
    # Parse ?enrich=true to include Spotify links
    enrich = request.args.get("enrich", "false").lower() == "true"
    if not date:
        return jsonify({"success": False, "message": "Date is required"}), 400

    songs = scrape_chart(date, limit)
    if not songs:
        return jsonify({"success": False, "message": "No songs found"}), 404

    if enrich:
        year = date.split("-")[0]
        enriched = search_spotify_tracks(songs, year)

        # Combine original + enriched
        combined = []
        for base, spotify in zip(songs, enriched):
            combined.append(
                {
                    "title": base["title"],
                    "artist": base["artist"],
                    "spotify_url": spotify.get("track_url"),
                    "artist_url": spotify.get("artist_url"),
                }
            )

        return jsonify({"success": True, "songs": combined})

    return jsonify({"success": True, "songs": songs})


@api.route("/api/create-playlist", methods=["POST"])
def create_spotify_playlist():
    data = request.get_json()
    date = data.get("date")
    limit = int(data.get("track_limit", 100))
    access_token = data.get("access_token")
    print(f"Creating playlist with: {date}, {limit}, token: {bool(access_token)}")

    if not date or not access_token:
        return jsonify(
            {"success": False, "message": "Date and access token required"}
        ), 400

    custom_name = data.get("custom_name")
    selected_indices = data.get("selected_indices", list(range(limit)))

    result = create_playlist(date, limit, access_token, selected_indices, custom_name)

    return jsonify(result)
