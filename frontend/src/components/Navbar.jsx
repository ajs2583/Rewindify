import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="navbar">
			<div className="logo">
				<h3>Rewindify</h3>
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
			</div>
		</nav>
	);
}
