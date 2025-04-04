export async function fetchSongs(date, trackCount) {
	const res = await fetch(`/api/scrape?date=${date}&limit=${trackCount}`);
	if (!res.ok) throw new Error("API returned non-200 status");
	return res.json();
}

export async function createPlaylist({
	date,
	trackCount,
	accessToken,
	selectedSongs,
	playlistTitle,
}) {
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
	return res.json();
}
