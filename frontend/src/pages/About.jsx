export default function About() {
	return (
		<div className="page">
			<div className="about-page">
				<h1 className="about-title">About Rewindify</h1>
				<p className="about-description">
					Inspired by{" "}
					<a
						className="about-link"
						href="https://receiptify.herokuapp.com/index.html"
						target="_blank"
						rel="noopener noreferrer"
					>
						@Receiptify
					</a>
					, Rewindify brings your favorite Billboard hits and Spotify playlists
					together in a nostalgic, shareable format. Create your personalized
					throwback playlist based on any date and relive the music that defined
					the moment.
				</p>

				<h2 className="faq-title">Frequently Asked Questions</h2>
				<div className="faq-entry">
					<h3>How does it work?</h3>
					<p>
						Rewindify pulls chart data from{" "}
						<a
							className="about-link"
							href="https://www.billboard.com/charts/hot-100/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Billboard
						</a>{" "}
						and matches each track to Spotify. After selecting your date and
						number of songs, you can preview or save the playlist to your
						Spotify account.
					</p>
				</div>
				<div className="faq-entry">
					<h3>Do I need a Spotify account?</h3>
					<p>
						You only need to log into Spotify if you want to generate and save
						your playlist directly to your account. Browsing charts can be done
						without logging in.
					</p>
				</div>
				<div className="faq-entry">
					<h3>Why are some songs missing?</h3>
					<p>
						Some older or niche tracks might not be available on Spotify, or
						they might be listed under alternate titles. We do our best to match
						each one as accurately as possible.
					</p>
				</div>
				<div className="faq-entry">
					<h3>Is my data safe?</h3>
					<p>
						Rewindify only uses the Spotify permissions necessary to create
						playlists on your behalf. We don’t collect or store any personal
						data.
					</p>
				</div>

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
