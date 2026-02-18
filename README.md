# Rewindify 🎵

**Turn back time and relive the hits!**

Rewindify is a web application that lets you create custom Spotify playlists based on Billboard Hot 100 charts from any date. Relive the music that defined a moment in time and discover what was topping the charts on birthdays, anniversaries, or any memorable date.

## What It Does

Rewindify bridges the gap between Billboard chart history and your Spotify library. Simply select a date, choose how many tracks you want, and Rewindify will:

1. Fetch the Billboard Hot 100 chart data for that date
2. Match each song to its Spotify equivalent
3. Let you preview the tracks and customize your selection
4. Create a personalized playlist directly in your Spotify account

## Features

- 📅 **Time Travel Through Music**: Browse Billboard Hot 100 charts from any historical date
- 🎧 **Spotify Integration**: Seamlessly create playlists in your Spotify account
- ✅ **Track Selection**: Preview and select which songs to include in your playlist
- 🎨 **Custom Playlists**: Name your playlist and make it uniquely yours
- 🔒 **Privacy-Focused**: No personal data is collected or stored; only necessary Spotify permissions are used

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Create React App

### Backend
- Python Flask
- BeautifulSoup4 for web scraping
- Spotipy (Spotify Web API wrapper)
- Flask-CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js and npm
- Python 3.x
- A Spotify Developer account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with your Spotify credentials:
   ```
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=your_redirect_uri
   ```

4. Run the Flask server:
   ```bash
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`.

## Usage

1. **Select a Date**: Choose any date from Billboard's Hot 100 chart history
2. **Choose Track Count**: Decide how many songs you want (up to 100)
3. **Generate Chart**: Click "Generate" to fetch the Billboard data
4. **Preview Songs**: Review the list of tracks that will be included
5. **Login to Spotify**: Authenticate with your Spotify account (only needed for playlist creation)
6. **Create Playlist**: Click "Create Playlist" to add it to your Spotify library
7. **Enjoy**: Open the playlist in Spotify and enjoy your musical time capsule!

## How It Works

Rewindify uses web scraping to retrieve historical Billboard Hot 100 chart data, then leverages the Spotify Web API to:
- Search for matching tracks on Spotify
- Create a new private playlist in your account
- Add the matched tracks to your playlist

Some older or niche tracks might not be available on Spotify or may be listed under alternate titles. The app does its best to match each song as accurately as possible.

## Privacy

Rewindify only requests the minimum Spotify permissions necessary to create playlists on your behalf. No personal data is collected or stored. See the [Privacy Policy](frontend/src/pages/PrivacyPolicy.jsx) for more details.

## Credits

Created by [Andrew Sliva](https://github.com/ajs2583)

Inspired by [Receiptify](https://receiptify.herokuapp.com/index.html)

## License

This project is dual-licensed under the MIT and Apache 2.0 licenses. See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ for music lovers who want to rediscover the soundtrack of the past.
