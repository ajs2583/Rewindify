import { useEffect, useState } from "react";

export default function Home() {
	const [date, setDate] = useState("");
	const [trackCount, setTrackCount] = useState("");
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [playlistUrl, setPlaylistUrl] = useState(null);
	const [accessToken, setAccessToken] = useState(null);

	const isReady = date && trackCount;

	useEffect(() => {
		// Handle redirect back from Spotify auth
		const hash = window.location.hash;
		if (hash) {
			const tokenMatch = hash.match(/access_token=([^&]*)/);
			if (tokenMatch) {
				const token = tokenMatch[1];
				setAccessToken(token);
				localStorage.setItem("spotify_token", token);
				window.history.replaceState(null, null, " ");
			}
		} else {
			const savedToken = localStorage.getItem("spotify_token");
			if (savedToken) {
				setAccessToken(savedToken);
			}
		}
	}, []);

	// ✅ This is where handleCreatePlaylist goes
	const handleCreatePlaylist = async () => {
		if (!accessToken) return alert("Please log into Spotify first.");

		try {
			const res = await fetch("/api/create-playlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					date: date,
					track_limit: trackCount,
					access_token: accessToken, // ✨ pass token!
				}),
			});
			const data = await res.json();

			if (data.success) {
				setPlaylistUrl(data.playlist_url);
			} else {
				alert(data.message || "Failed to create playlist.");
			}
		} catch (err) {
			console.error(err);
			alert("Error creating playlist.");
		}
	};

	// ...your return JSX goes here...

	const handleGenerate = async () => {
		setLoading(true);
		setSongs([]);

		try {
			const url = `${process.env.REACT_APP_API_URL}/api/scrape?date=${date}&limit=${trackCount}`;
			const res = await fetch(url);

			if (!res.ok) throw new Error("API returned non-200 status");

			const data = await res.json();

			if (data.success) {
				setSongs(data.songs);
			} else {
				alert(data.message || "Something went wrong.");
			}
		} catch (err) {
			console.error("Fetch error:", err);
			alert("Failed to fetch songs.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page home-page">
			<header className="home-header">
				<h1 className="home-title">Welcome to Rewindify</h1>
				<p className="home-subtitle">
					Generate a Spotify playlist based on the Billboard chart from any date
					you choose.
				</p>

				<div className="input-section">
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="input-field"
						max={new Date().toISOString().split("T")[0]}
					/>
					{date && new Date(date) > new Date() && (
						<p className="validation-warning">Date cannot be in the future.</p>
					)}

					<input
						type="number"
						placeholder="Number of tracks"
						value={trackCount}
						onChange={(e) => setTrackCount(e.target.value)}
						className="input-field"
						min="1"
						max="100"
					/>
					{trackCount > 100 && (
						<p className="validation-warning">Track count cannot exceed 100.</p>
					)}

					{!accessToken && (
						<a
							href={`https://accounts.spotify.com/authorize?client_id=${
								process.env.REACT_APP_SPOTIFY_CLIENT_ID
							}&response_type=token&redirect_uri=${encodeURIComponent(
								window.location.origin
							)}&scope=playlist-modify-private`}
							className="spotify-login-button"
						>
							Log in with Spotify
						</a>
					)}

					{isReady && trackCount <= 100 && new Date(date) <= new Date() && (
						<button className="generate-button" onClick={handleGenerate}>
							{loading ? "Loading..." : "Generate"}
						</button>
					)}

					{songs.length > 0 && accessToken && !playlistUrl && (
						<button className="spotify-button" onClick={handleCreatePlaylist}>
							Create Spotify Playlist
						</button>
					)}

					{playlistUrl && (
						<div className="playlist-success">
							🎉 Your playlist is ready!{" "}
							<a href={playlistUrl} target="_blank" rel="noopener noreferrer">
								Open in Spotify
							</a>
						</div>
					)}
				</div>
			</header>
			{songs.length > 0 && (
				<div className="song-table-wrapper">
					<table className="song-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Preview</th>
								<th>Title</th>
								<th>Artist</th>
								<th>Link</th>
							</tr>
						</thead>
						<tbody>
							{songs.map((song, idx) => {
								const trackId = song.uri?.split(":")[2];
								const spotifyUrl = trackId
									? `https://open.spotify.com/track/${trackId}`
									: "#";

								return (
									<tr key={idx}>
										<td>{idx + 1}</td>
										<td>
											{/* You can add an album cover or preview icon here */}
											🎵
										</td>
										<td>{song.title}</td>
										<td>{song.artist}</td>
										<td>
											<a
												href={spotifyUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="listen-link"
											>
												Listen
											</a>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}

			<footer className="about-footer">
				<div>
					Made by{" "}
					<a className="about-footer-link" href="https://github.com/ajs2583">
						Andrew Sliva
					</a>
				</div>
				<div className="footer-links">
					<a className="about-footer-link" href="/">
						Home
					</a>{" "}
					|{" "}
					<a className="about-footer-link" href="/about">
						About
					</a>{" "}
					|{" "}
					<a className="about-footer-link" href="/privacy-policy">
						Privacy Policy
					</a>{" "}
					|{" "}
					<a className="about-footer-link" href="/contact">
						Contact
					</a>
				</div>
			</footer>
		</div>
	);
}
