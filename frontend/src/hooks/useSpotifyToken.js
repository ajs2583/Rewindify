import { useEffect, useState } from "react";

export default function useSpotifyToken() {
	const [token, setToken] = useState(null);

	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const tokenMatch = hash.match(/access_token=([^&]*)/);
			if (tokenMatch) {
				const token = tokenMatch[1];
				setToken(token);
				localStorage.setItem("spotify_token", token);
				window.history.replaceState(null, null, " ");
			}
		} else {
			const savedToken = localStorage.getItem("spotify_token");
			if (savedToken) setToken(savedToken);
		}
	}, []);

	return token;
}
