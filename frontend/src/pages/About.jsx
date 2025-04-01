export default function About() {
	return (
		<div className="page">
			<div className="about-page">
				<h1>About Rewindify</h1>
				<p className="paragraph-elements-about">
					Inspired by{" "}
					<a
						className="receiptify-link"
						href="https://receiptify.herokuapp.com/index.html"
					>
						@Receiptify
					</a>
					, Rewindify and brings your favorite Billboard hits and Spotify
					playlists together in a nostalgic, shareable format. Create your
					personalized throwback playlist based on any date and relive the music
					that defined the moment.{" "}
				</p>
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
		</div>
	);
}
