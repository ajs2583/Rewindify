import { useEffect, useState } from "react";

export default function Home() {
	const [date, setDate] = useState("");
	const [trackCount, setTrackCount] = useState("");
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [playlistUrl, setPlaylistUrl] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [playlistTitle, setPlaylistTitle] = useState("");
	const [selectedSongs, setSelectedSongs] = useState([]);

	const isReady = date && trackCount;

	useEffect(() => {
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
				setSelectedSongs(data.songs.map((_, idx) => idx)); // default all selected
				setPlaylistTitle(`Rewindify: Billboard ${date}`);
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

	const handleCreatePlaylist = async () => {
		if (!accessToken) return alert("Please log into Spotify first.");

		try {
			const res = await fetch("/api/create-playlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					date,
					track_limit: trackCount,
					access_token: accessToken,
					selected_indices: selectedSongs,
					custom_name:
						playlistTitle.trim() === ""
							? `Rewindify: Billboard ${date}`
							: playlistTitle,
				}),
			});

			const data = await res.json();

			console.log("Create Playlist Response:", data); // 🧠 Log server response

			if (data.success) {
				setPlaylistUrl(data.playlist_url);
			} else {
				alert(data.message || "Failed to create playlist.");
			}
		} catch (err) {
			console.error("Playlist creation error:", err); // 🧠 Log error
			alert("Error creating playlist.");
		}
	};

	return (
		<div className="page home-page">
			<header className="home-header">
				<h1 className="home-title">Welcome to Rewindify</h1>
				<p className="home-subtitle styled-subtitle">
					Turn back time and relive the hits!
					<br />
					<span className="subtitle-detail">
						Generate a Spotify playlist based on any Billboard chart date
					</span>
				</p>

				<div className="input-section">
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="input-field"
						max={new Date().toISOString().split("T")[0]}
					/>

					<input
						type="number"
						placeholder="Number of tracks"
						value={trackCount}
						onChange={(e) => setTrackCount(e.target.value)}
						className="input-field"
						min="1"
						max="100"
					/>

					{songs.length > 0 && (
						<input
							type="text"
							className="input-field"
							placeholder="Playlist Title"
							value={playlistTitle}
							onChange={(e) => setPlaylistTitle(e.target.value)}
						/>
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
								<th>Include?</th>
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
											<input
												type="checkbox"
												checked={selectedSongs.includes(idx)}
												onChange={() =>
													setSelectedSongs((prev) =>
														prev.includes(idx)
															? prev.filter((i) => i !== idx)
															: [...prev, idx]
													)
												}
											/>
										</td>
										<td>🎵</td>
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
