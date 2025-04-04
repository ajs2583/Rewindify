import React from "react";

export default function SongTable({
	songs,
	accessToken,
	selectedSongs,
	toggleSelect,
}) {
	return (
		<div className="song-table-wrapper">
			<table className="song-table">
				<thead>
					<tr>
						<th>#</th>
						{accessToken && <th className="include-col">Include?</th>}
						<th className="track-col">Track</th>
					</tr>
				</thead>
				<tbody>
					{songs.map((song, idx) => (
						<tr key={idx}>
							<td>{idx + 1}</td>
							{accessToken && (
								<td className="include-col">
									<input
										type="checkbox"
										checked={selectedSongs.includes(idx)}
										onChange={() => toggleSelect(idx)}
									/>
								</td>
							)}
							<td className="track-col">
								<a
									href={song.spotify_url}
									target="_blank"
									rel="noopener noreferrer"
									className="listen-link"
								>
									{song.title}
								</a>
								<br />
								<a
									href={song.artist_url}
									target="_blank"
									rel="noopener noreferrer"
									className="song-artist-link"
								>
									{song.artist}
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
