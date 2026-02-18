const API_BASE = process.env.REACT_APP_API_URL || "";

export async function fetchSongs(date, trackCount, signal = null) {
	const limit = trackCount != null && trackCount !== "" ? Number(trackCount) : 100;
	const safeLimit = Number.isFinite(limit) && limit >= 1 && limit <= 100 ? limit : 100;
	const url = `${API_BASE}/api/scrape?date=${encodeURIComponent(date)}&limit=${safeLimit}`;
	const opts = signal ? { signal } : {};
	const res = await fetch(url, opts);
	if (!res.ok) throw new Error("API returned non-200 status");
	return res.json();
}

export async function fetchRecentCharts() {
	const res = await fetch(`${API_BASE}/api/recent-charts`);
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
	const res = await fetch(`${API_BASE}/api/create-playlist`, {
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
