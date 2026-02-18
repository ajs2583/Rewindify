# Rewindify

Rewindify is a web application that allows you to create Spotify playlists based on Billboard Hot 100 chart data from any date. The app scrapes Billboard charts and matches songs to Spotify tracks, then creates a personalized playlist in your Spotify account.

## Project Structure

- **Frontend**: React application (runs on port 3000)
- **Backend**: Flask API server (runs on port 5000)

## Prerequisites

Before running the application, make sure you have:

1. **Node.js** (v14 or higher) and **npm** installed
2. **Python** (3.7 or higher) installed
3. **Spotify Developer Account** credentials (already configured in `.env` files)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
   ```bash
   pip install flask flask-cors spotipy python-dotenv requests beautifulsoup4 urllib3
   ```

   Or if you prefer to use a requirements file, create `requirements.txt` with:
   ```
   flask
   flask-cors
   spotipy
   python-dotenv
   requests
   beautifulsoup4
   urllib3
   ```
   Then run:
   ```bash
   pip install -r requirements.txt
   ```

5. Verify the `.env` file exists in the `backend` directory with:
   ```
   CLIENT_ID="your_spotify_client_id"
   CLIENT_SECRET="your_spotify_client_secret"
   REDIRECT_URI=http://localhost:3000
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Verify the `.env` file exists in the `frontend` directory with:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID="your_spotify_client_id"
   REACT_APP_API_URL=http://localhost:3000
   ```

## Running the Application

You need to run both the backend and frontend servers simultaneously.

### Option 1: Run in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```
The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000` and automatically open in your browser.

### Option 2: Run in Background (Windows PowerShell)

**Backend (background):**
```powershell
cd backend
Start-Process python -ArgumentList "run.py" -WindowStyle Hidden
```

**Frontend:**
```powershell
cd frontend
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Login with Spotify" to authenticate your Spotify account
3. Select a date from the Billboard Hot 100 charts
4. Choose the number of tracks (up to 100)
5. Click "Generate Playlist" to fetch songs from that date
6. Review and select songs you want in your playlist
7. Optionally customize the playlist name
8. Click "Create Playlist" to add it to your Spotify account

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/health` - Health check (returns 200 and verifies DB); use for deployment/load balancers
- `GET /api/scrape?date=YYYY-MM-DD&limit=100&enrich=true` - Scrape Billboard chart data
- `GET /api/recent-charts` - Get most popular chart dates
- `POST /api/test-auth` - Test Spotify authentication
- `POST /api/create-playlist` - Create a Spotify playlist

## Troubleshooting

### Backend Issues

- **Port 5000 already in use**: Change the port in `backend/run.py` or stop the process using port 5000
- **SSL Certificate errors**: Outbound requests use full SSL verification by default. In production, never disable it. For local development behind a corporate proxy, you can set `DISABLE_SSL_VERIFY=1` only when `FLASK_ENV=development` (see `backend/.env.example`). Otherwise, fix certificate issues with proper system/CA configuration (e.g. install your proxy’s CA bundle).
- **Module not found errors**: Ensure all dependencies are installed in your virtual environment

### Frontend Issues

- **Port 3000 already in use**: The React dev server will prompt you to use a different port
- **API connection errors**: Ensure the backend is running on port 5000
- **Spotify authentication fails**: Verify your `.env` file has the correct Spotify credentials

### General Issues

- **CORS errors**: The backend has CORS enabled, but if you encounter issues, check that the frontend proxy is configured correctly in `frontend/src/setupProxy.js`
- **Songs not found**: Some older Billboard charts may have incomplete data or songs may not be available on Spotify

## Deployment (Heroku)

### Config vars (Heroku)

- **DATABASE_URL** – Set automatically when you add Heroku Postgres. Production must set this; sqlite is for local dev only.
- **PORT** – Set automatically by Heroku.
- **CLIENT_ID**, **CLIENT_SECRET**, **REDIRECT_URI** – Your Spotify app credentials. Set **REDIRECT_URI** to your production URL (e.g. `https://yourapp.herokuapp.com`) and add that URL to your Spotify app’s redirect URIs in the Spotify Developer Dashboard.

Do **not** set `DISABLE_SSL_VERIFY` in production; outbound HTTPS uses full certificate verification.

### Runtime behavior

The **Procfile** runs `gunicorn -b 0.0.0.0:$PORT run:app`. When the `backend/static_ui/` directory is present (React build), the app serves the SPA from `/` and the API from `/api`. All `/api` routes take precedence; the SPA is served for other paths so the same app can be used for both API and UI.

### Single-app deploy (backend serves frontend)

1. Build the frontend: `cd frontend && npm run build`
2. Copy the build into the backend: copy contents of `frontend/build/` into `backend/static_ui/` (so `backend/static_ui/index.html` and `backend/static_ui/static/` exist).
3. Deploy the repo; the Procfile runs the backend. The app will serve the React SPA from `/` when `static_ui` is present.

### Two-app deploy (frontend elsewhere)

Deploy the backend to Heroku as above (without `static_ui`). Deploy the frontend to Vercel/Netlify (or similar) and set:

- **REACT_APP_API_URL** = your Heroku backend URL (e.g. `https://yourapp.herokuapp.com`)
- **REACT_APP_REDIRECT_URI** = your frontend URL (e.g. `https://yourapp.vercel.app`)

Add the frontend URL as a redirect URI in your Spotify app.

### Playlist creation and SSL

The `POST /api/create-playlist` request/response contract is unchanged. Playlist creation in production uses full SSL verification when talking to Spotify. Do not set `DISABLE_SSL_VERIFY` in production. If you see SSL/certificate errors, fix system or CA configuration rather than disabling verification.

**After deployment, verify playlist creation:** log in with Spotify, pick a chart date, generate the playlist, create it, and open the returned playlist link in Spotify to confirm it was created and contains tracks.

## Daily chart refresh (Heroku Scheduler)

Chart data is cached in the database. Production must set **DATABASE_URL** (e.g. Heroku Postgres); sqlite is for local dev only. To keep caches fresh (e.g. if Billboard changes the site), run a daily scrape. The job is idempotent and safe to run daily.

1. Add the **Heroku Scheduler** add-on to your app.
2. In Scheduler, add a job that runs **daily** with:
   ```bash
   cd backend && flask scrape-daily
   ```
   (Ensure the app’s run directory is the project root so `backend` exists, or run `flask scrape-daily` from the `backend` directory if that is the app root.)
3. The command refreshes up to 50 cached chart dates (oldest first) plus the current chart week. It exits with a non-zero code if any date failed so you can alert on job failure.

## Development

- Frontend code is in `frontend/src/`
- Backend code is in `backend/app/`
- The frontend uses a proxy to forward `/api` requests to the backend (configured in `frontend/src/setupProxy.js`)

## License

MIT License - see LICENSE file for details
