// components/PlaylistForm.jsx
import React from "react";

export default function PlaylistForm({
	date,
	trackCount,
	playlistTitle,
	accessToken,
	songs,
	loading,
	playlistUrl,
	onDateChange,
	onTrackCountChange,
	onTitleChange,
	onGenerate,
	onCreatePlaylist,
}) {
	const isReady =
		date && trackCount && trackCount <= 100 && new Date(date) <= new Date();
	const redirectUri = "http://127.0.0.1:3000";
	return (
		<div className="input-section">
			<input
				type="date"
				value={date}
				onChange={(e) => onDateChange(e.target.value)}
				className="input-field"
				max={new Date().toISOString().split("T")[0]}
			/>

			<input
				type="number"
				placeholder="Number of tracks"
				value={trackCount}
				onChange={(e) => onTrackCountChange(e.target.value)}
				className="input-field"
				min="1"
				max="100"
			/>

			{trackCount > 100 && (
				<div className="validation-warning">
					Track count must be 100 or less.
				</div>
			)}

			{songs.length > 0 && accessToken && (
				<input
					type="text"
					className="input-field"
					placeholder="Playlist Title"
					value={playlistTitle}
					onChange={(e) => onTitleChange(e.target.value)}
				/>
			)}

			{!accessToken && (
				<a
					href={`https://accounts.spotify.com/authorize?client_id=${
						process.env.REACT_APP_SPOTIFY_CLIENT_ID
					}&response_type=token&redirect_uri=${encodeURIComponent(
						redirectUri
					)}&scope=playlist-modify-private`}
					className="spotify-login-button"
				>
					Log in with Spotify
				</a>
			)}

			{isReady && (
				<button className="generate-button" onClick={onGenerate}>
					{loading ? "Loading..." : "Generate"}
				</button>
			)}

			{songs.length > 0 && accessToken && !playlistUrl && (
				<button className="spotify-button" onClick={onCreatePlaylist}>
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
	);
}
