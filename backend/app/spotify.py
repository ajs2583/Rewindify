import os
import logging
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from .billboard import scrape_chart

load_dotenv()

sp = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        scope="playlist-modify-private",
        redirect_uri=os.getenv("REDIRECT_URI"),
        client_id=os.getenv("CLIENT_ID"),
        client_secret=os.getenv("CLIENT_SECRET"),
        show_dialog=True,
        cache_path="token.txt",
    )
)


def search_spotify_tracks(song_data, year):
    uris = []
    for item in song_data:
        title = item["title"]
        artist = item["artist"]
        query = f"track:{title} artist:{artist} year:{year}"
        try:
            results = sp.search(q=query, type="track", limit=1)
            items = results.get("tracks", {}).get("items")
            if items:
                uris.append(items[0]["uri"])
            else:
                logging.info(f"Not found: {title} by {artist}")
        except Exception as e:
            logging.error(f"Search error for {title} by {artist}: {e}")
    return uris


def create_playlist(
    date, limit=100, access_token=None, selected_indices=None, custom_name=None
):
    if not access_token:
        return {"success": False, "message": "Missing access token"}

    try:
        sp = spotipy.Spotify(auth=access_token)
        user_id = sp.current_user()["id"]
    except Exception as e:
        logging.error(f"Spotify auth error: {e}")
        return {"success": False, "message": "Authentication failed"}

    songs = scrape_chart(date, limit)
    if not songs:
        return {"success": False, "message": "No songs found"}
    if selected_indices is not None:
        songs = [songs[i] for i in selected_indices if 0 <= i < len(songs)]
    year = date.split("-")[0]
    uris = search_spotify_tracks(songs, year)
    if not uris:
        return {"success": False, "message": "No valid songs matched on Spotify"}

    try:
        playlist = sp.user_playlist_create(
            user=user_id,
            name=custom_name or f"Rewindify: Billboard {date}",
            public=False,
        )
        sp.playlist_add_items(playlist_id=playlist["id"], items=uris)
        return {"success": True, "playlist_url": playlist["external_urls"]["spotify"]}
    except Exception as e:
        logging.error(f"Playlist creation failed: {e}")
        return {"success": False, "message": "Failed to create playlist"}
