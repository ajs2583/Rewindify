// pages/Home.jsx
import { useState } from "react";
import useSpotifyToken from "../hooks/useSpotifyToken";
import { fetchSongs, createPlaylist } from "../api/playlist";
import SongTable from "../components/SongTable";
import PlaylistForm from "../components/PlaylistForm";

export default function Home() {
	const [date, setDate] = useState("");
	const [trackCount, setTrackCount] = useState("");
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [playlistUrl, setPlaylistUrl] = useState(null);
	const [playlistTitle, setPlaylistTitle] = useState("");
	const [selectedSongs, setSelectedSongs] = useState([]);
	const accessToken = useSpotifyToken();

	const handleGenerate = async () => {
		setLoading(true);
		setSongs([]);

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
			} else {
				alert(data.message || "Failed to create playlist.");
			}
		} catch (err) {
			console.error("Playlist creation error:", err);
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

				<PlaylistForm
					date={date}
					trackCount={trackCount}
					playlistTitle={playlistTitle}
					accessToken={accessToken}
					songs={songs}
					loading={loading}
					playlistUrl={playlistUrl}
					onDateChange={setDate}
					onTrackCountChange={setTrackCount}
					onTitleChange={setPlaylistTitle}
					onGenerate={handleGenerate}
					onCreatePlaylist={handleCreatePlaylist}
				/>
			</header>

			{songs.length > 0 && (
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
