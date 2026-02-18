import os
import logging
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import urllib3
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Monkey patch requests to disable SSL verification globally
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

load_dotenv()

# Set SSL environment variables globally to handle certificate issues
os.environ["REQUESTS_CA_BUNDLE"] = ""
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["SSL_VERIFY"] = "false"

# Global Spotify client - will be created when needed
sp = None


def get_global_spotify_client():
    global sp
    if sp is None:
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
    return sp


def search_spotify_tracks(song_data, year, spotify_client=None):
    if spotify_client is None:
        spotify_client = get_global_spotify_client()

    uris = []
    for item in song_data:
        title = item["title"]
        artist = item["artist"]
        query = f"track:{title} artist:{artist} year:{year}"
        try:
            results = spotify_client.search(q=query, type="track", limit=1)
            if results and "tracks" in results:
                items = results["tracks"].get("items", [])
                if items:
                    uris.append(items[0]["uri"])
                else:
                    logging.info(f"Not found: {title} by {artist}")
            else:
                logging.info(f"No results for: {title} by {artist}")
        except Exception as e:
            logging.error(f"Search error for {title} by {artist}: {e}")
    return uris


def create_playlist(
    date,
    limit=100,
    access_token=None,
    selected_indices=None,
    custom_name=None,
    songs=None,
):
    if not access_token:
        return {"success": False, "message": "Missing access token"}

    try:
        # Create Spotify client with user's access token
        logging.info(f"Creating Spotify client with token: {access_token[:20]}...")

        # Create a custom session that handles SSL properly
        session = requests.Session()
        session.verify = False  # Disable SSL verification

        # Use the correct Spotipy authentication method with custom session
        user_sp = spotipy.Spotify(auth=access_token, requests_session=session)
        logging.info("Spotify client created successfully")

        # Test the authentication by getting current user
        current_user = user_sp.current_user()
        logging.info(f"Current user response: {current_user}")

        if not current_user or "id" not in current_user:
            logging.error("Could not get user information from Spotify")
            return {"success": False, "message": "Could not get user information"}
        user_id = current_user["id"]
        logging.info(f"User ID: {user_id}")
    except Exception as e:
        logging.error(f"Spotify auth error: {e}")
        logging.error(f"Error type: {type(e)}")
        logging.error(f"Full error details: {str(e)}")

        # Check if it's an SSL error
        if "TLS CA certificate bundle" in str(e) or "SSL" in str(e):
            logging.error("SSL certificate error detected")
            return {
                "success": False,
                "message": "SSL certificate error - please check your system configuration",
            }

        return {"success": False, "message": "Authentication failed"}

    if songs is None:
        return {"success": False, "message": "Songs list is required"}
    if not songs:
        return {"success": False, "message": "No songs found"}
    if selected_indices is not None:
        songs = [songs[i] for i in selected_indices if 0 <= i < len(songs)]
    year = date.split("-")[0]

    # Use the user's Spotify client for searching tracks
    uris = search_spotify_tracks(songs, year, user_sp)
    if not uris:
        return {"success": False, "message": "No valid songs matched on Spotify"}

    try:
        playlist = user_sp.user_playlist_create(
            user=user_id,
            name=custom_name or f"Rewindify: Billboard {date}",
            public=False,
        )
        if not playlist or "id" not in playlist:
            return {"success": False, "message": "Failed to create playlist"}

        user_sp.playlist_add_items(playlist_id=playlist["id"], items=uris)

        if "external_urls" in playlist and "spotify" in playlist["external_urls"]:
            return {
                "success": True,
                "playlist_url": playlist["external_urls"]["spotify"],
            }
        else:
            return {"success": True, "playlist_url": playlist.get("href", "")}
    except Exception as e:
        logging.error(f"Playlist creation failed: {e}")
        return {"success": False, "message": "Failed to create playlist"}
