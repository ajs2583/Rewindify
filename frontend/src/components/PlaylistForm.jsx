// TODO put conditional for todays date to just "https://www.billboard.com/charts/hot-100/"
// components/PlaylistForm.jsx
import React from "react";

export default function PlaylistForm({
	date,
	trackCount,
	playlistTitle,
	accessToken,
	tokenLoading,
	songs,
	loading,
	creatingPlaylist,
	playlistUrl,
	onDateChange,
	onTrackCountChange,
	onTitleChange,
	onGenerate,
	onCreatePlaylist,
}) {
	const isReady =
		date &&
		trackCount &&
		Number(trackCount) <= 100 &&
		Number(trackCount) >= 1 &&
		new Date(date) <= new Date();
	const redirectUri = "http://localhost:3000";
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

			{trackCount !== "" && trackCount > 100 && (
				<div className="validation-warning">
					Track count must be 100 or less.
				</div>
			)}

			{trackCount !== "" && trackCount < 1 && (
				<div className="validation-warning">
					Track count must be at least 1.
				</div>
			)}

			{date && new Date(date) > new Date() && (
				<div className="validation-warning">
					Please select a date that is not in the future.
				</div>
			)}

			{songs.length > 0 && songs.length < 100 && accessToken && (
				<input
					type="text"
					className="input-field"
					placeholder="Playlist Title"
					value={playlistTitle}
					onChange={(e) => onTitleChange(e.target.value)}
				/>
			)}

			{!accessToken && !tokenLoading && (
				<a
					href={`https://accounts.spotify.com/authorize?client_id=810d5e4e82c84c7991cbf6195657e85b&response_type=token&redirect_uri=${encodeURIComponent(
						redirectUri
					)}&scope=playlist-modify-private`}
					className="spotify-login-button"
					onClick={(e) => {
						// Add a small delay to show loading state
						e.currentTarget.textContent = "Redirecting to Spotify...";
						e.currentTarget.style.opacity = "0.7";
					}}
				>
					Log in with Spotify
				</a>
			)}

			{tokenLoading && (
				<div className="spotify-loading">
					<div className="loading-spinner"></div>
					<span>Checking Spotify authentication...</span>
				</div>
			)}

			{isReady && (
				<button className="generate-button" onClick={onGenerate}>
					{loading ? "Loading..." : "Generate"}
				</button>
			)}

			{songs.length > 0 && accessToken && !playlistUrl && (
				<button
					className="spotify-button"
					onClick={onCreatePlaylist}
					disabled={creatingPlaylist}
					style={{
						opacity: creatingPlaylist ? 0.6 : 1,
						cursor: creatingPlaylist ? "not-allowed" : "pointer",
					}}
				>
					{creatingPlaylist ? (
						<>
							<div
								style={{
									display: "inline-block",
									width: "16px",
									height: "16px",
									border: "2px solid #ffffff",
									borderRadius: "50%",
									borderTopColor: "transparent",
									animation: "spin 1s linear infinite",
									marginRight: "8px",
								}}
							></div>
							Creating Playlist...
						</>
					) : (
						"Create Spotify Playlist"
					)}
				</button>
			)}

			{songs.length > 0 && accessToken && !playlistUrl && (
				<div className="playlist-instructions">
					💡 Select songs from the table below, then click "Create Spotify
					Playlist"
				</div>
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
