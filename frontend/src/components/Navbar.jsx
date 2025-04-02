import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("spotify_token");
		setLoggedIn(!!token);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("spotify_token");
		window.location.reload(); // force recheck of login state
	};

	return (
		<nav className="navbar">
			<div className="logo">
				<img
					src="/rewindify-logo.svg"
					alt="Rewindify Logo"
					style={{ height: "40px" }}
				/>
			</div>
			<div className="nav-links">
				<Link to="/" className="nav-button">
					Home
				</Link>
				<Link to="/about" className="nav-button">
					About
				</Link>
				<Link to="/privacy-policy" className="nav-button">
					Privacy Policy
				</Link>
				<Link to="/contact" className="nav-button">
					Contact
				</Link>
				{loggedIn && (
					<button onClick={handleLogout} className="logout-button">
						Log out
					</button>
				)}
			</div>
		</nav>
	);
}
