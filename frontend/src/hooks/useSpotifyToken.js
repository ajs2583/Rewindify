import { useEffect, useState, useCallback } from "react";

export default function useSpotifyToken() {
	const [token, setToken] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const extractTokenFromHash = useCallback(() => {
		const hash = window.location.hash;

		if (hash) {
			const tokenMatch = hash.match(/access_token=([^&]*)/);

			if (tokenMatch) {
				const token = tokenMatch[1];
				setToken(token);
				localStorage.setItem("spotify_token", token);
				// Clear the hash to prevent re-processing
				window.history.replaceState(null, null, window.location.pathname);
				setIsLoading(false);
				return;
			}
		}

		// Check localStorage for existing token
		const savedToken = localStorage.getItem("spotify_token");
		if (savedToken) {
			setToken(savedToken);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		extractTokenFromHash();
	}, [extractTokenFromHash]);

	return { token, isLoading };
}
