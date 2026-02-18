// pages/Home.jsx
import { useState, useRef } from "react";
import useSpotifyToken from "../hooks/useSpotifyToken";
import { fetchSongs, createPlaylist } from "../api/playlist";
import SongTable from "../components/SongTable";
import PlaylistForm from "../components/PlaylistForm";
import Confetti from "../components/Confetti";
import RecentCharts from "../components/RecentCharts";

export default function Home() {
	const [date, setDate] = useState("");
	const [trackCount, setTrackCount] = useState("");
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [creatingPlaylist, setCreatingPlaylist] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [playlistUrl, setPlaylistUrl] = useState(null);
	const [playlistTitle, setPlaylistTitle] = useState("");
	const [selectedSongs, setSelectedSongs] = useState([]);
	const fetchAbortRef = useRef(null);
	const { token: accessToken, isLoading: tokenLoading } = useSpotifyToken();

	const handleDateSelect = (selectedDate) => {
		setDate(selectedDate);
		setTrackCount((prev) => (prev === "" ? "100" : prev));
		document.querySelector(".playlist-form-container")?.scrollIntoView({
			behavior: "smooth",
		});
		// Auto-fetch songs for this date
		if (fetchAbortRef.current) fetchAbortRef.current.abort();
		setLoading(true);
		setSongs([]);
		setPlaylistUrl(null);
		setShowConfetti(false);
		setPlaylistTitle("");
		const controller = new AbortController();
		fetchAbortRef.current = controller;
		fetchSongs(selectedDate, "100", controller.signal)
			.then((data) => {
				if (controller.signal.aborted) return;
				if (data && data.success && Array.isArray(data.songs)) {
					setSongs(data.songs);
					setSelectedSongs(data.songs.map((_, idx) => idx));
					setPlaylistTitle(`Rewindify: Billboard ${selectedDate}`);
				} else {
					alert(data?.message || "No songs found for this date.");
				}
			})
			.catch((err) => {
				if (err.name === "AbortError") return;
				console.error("Fetch error:", err);
				alert("Failed to fetch songs. Is the backend running on port 5000?");
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
				if (fetchAbortRef.current === controller) fetchAbortRef.current = null;
			});
	};

	const handleGenerate = async () => {
		setLoading(true);
		setSongs([]);
		// Reset playlist state when generating new songs
		setPlaylistUrl(null);
		setShowConfetti(false);
		setPlaylistTitle("");

		try {
			const data = await fetchSongs(date, trackCount);
			if (data.success) {
				setSongs(data.songs);
				setSelectedSongs(data.songs.map((_, idx) => idx));
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
		if (creatingPlaylist) return; // Prevent multiple clicks
		if (!date) return alert("Please select a date first.");
		if (!trackCount || Number(trackCount) < 1)
			return alert("Please enter a valid track count.");
		if (songs.length === 0) return alert("Please generate songs first.");
		if (selectedSongs.length === 0)
			return alert("Please select at least one song to add to the playlist.");

		setCreatingPlaylist(true);

		try {
			const data = await createPlaylist({
				date,
				trackCount,
				accessToken,
				selectedSongs,
				playlistTitle,
			});

			console.log("Create Playlist Response:", data);

			if (data.success) {
				setPlaylistUrl(data.playlist_url);
				setShowConfetti(true); // Trigger confetti animation
			} else {
				alert(data.message || "Failed to create playlist.");
			}
		} catch (err) {
			console.error("Playlist creation error:", err);
			alert("Error creating playlist.");
		} finally {
			setCreatingPlaylist(false);
		}
	};

	return (
		<div className="page home-page">
			<Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

			<div className="home-hero">
				<div className="hero-content">
					<h1 className="home-title">
						<span className="title-highlight">Welcome to</span>
						<span className="title-brand">Rewindify</span>
					</h1>
					<p className="home-subtitle styled-subtitle">
						Pick a date, get the Billboard chart, create a Spotify playlist.
						<br />
						<span className="subtitle-detail">
							Look up any Hot 100 chart and build your playlist in seconds.
						</span>
					</p>

					<div className="hero-features">
						<div className="feature-item">
							<span className="feature-icon">📅</span>
							<span>Any Date</span>
						</div>
						<div className="feature-item">
							<span className="feature-icon">🎧</span>
							<span>Spotify Integration</span>
						</div>
						<div className="feature-item">
							<span className="feature-icon">🎉</span>
							<span>Instant Playlists</span>
						</div>
					</div>
				</div>
			</div>

			<div className="home-content">
				<div className="lookup-main">
					<div className="form-section">
						<div className="playlist-form-container">
							<PlaylistForm
								date={date}
								trackCount={trackCount}
								playlistTitle={playlistTitle}
								accessToken={accessToken}
								tokenLoading={tokenLoading}
								songs={songs}
								loading={loading}
								creatingPlaylist={creatingPlaylist}
								playlistUrl={playlistUrl}
								onDateChange={setDate}
								onTrackCountChange={setTrackCount}
								onTitleChange={setPlaylistTitle}
								onGenerate={handleGenerate}
								onCreatePlaylist={handleCreatePlaylist}
							/>
						</div>
					</div>

					{songs.length > 0 && (
						<div className="songs-section">
							<SongTable
								songs={songs}
								accessToken={accessToken}
								selectedSongs={selectedSongs}
								toggleSelect={(idx) =>
									setSelectedSongs((prev) =>
										prev.includes(idx)
											? prev.filter((i) => i !== idx)
											: [...prev, idx]
									)
								}
							/>
						</div>
					)}
				</div>

				<div className="charts-section charts-section-secondary">
					<RecentCharts onDateSelect={handleDateSelect} />
				</div>
			</div>

			<footer className="about-footer">
				<div>
					Made with ❤️ by{" "}
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
				<div className="personal-website-link">
					<a
						href="https://www.andrewsliva.dev/"
						target="_blank"
						rel="noopener noreferrer"
						className="personal-website-button"
					>
						🌐 Visit My Personal Website
					</a>
				</div>
			</footer>
		</div>
	);
}
