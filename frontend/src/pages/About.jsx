// pages/About.jsx
import React from "react";

export default function About() {
	return (
		<div className="page about-page">
			<div className="about-container">
				<h1 className="about-title">About Rewindify</h1>

				<div className="about-content">
					<div className="about-intro">
						<p className="about-description">
							Rewindify brings your favorite Billboard hits and Spotify
							playlists together in a nostalgic, shareable format. Create your
							personalized throwback playlist based on any date and relive the
							music that defined the moment.
						</p>
						<p className="about-inspiration">
							Inspired by{" "}
							<a
								className="about-link"
								href="https://receiptify.herokuapp.com/index.html"
								target="_blank"
								rel="noopener noreferrer"
							>
								Receiptify
							</a>
							, Rewindify takes music discovery to the next level.
						</p>
					</div>

					<div className="about-section">
						<h2>How It Works</h2>
						<div className="steps-container">
							<div className="step">
								<div className="step-number">1</div>
								<div className="step-content">
									<h3>Choose Your Date</h3>
									<p>
										Pick any date to explore the Billboard Hot 100 chart from
										that era
									</p>
								</div>
							</div>
							<div className="step">
								<div className="step-number">2</div>
								<div className="step-content">
									<h3>Select Songs</h3>
									<p>
										Browse the chart and choose which songs you want in your
										playlist
									</p>
								</div>
							</div>
							<div className="step">
								<div className="step-number">3</div>
								<div className="step-content">
									<h3>Create Playlist</h3>
									<p>
										Generate your personalized Spotify playlist and enjoy the
										nostalgia
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="about-section">
						<h2>Frequently Asked Questions</h2>
						<div className="faq-container">
							<div className="faq-item">
								<h3>Do I need a Spotify account?</h3>
								<p>
									You only need to log into Spotify if you want to create and
									save your playlist directly to your account. Browsing charts
									can be done without logging in.
								</p>
							</div>
							<div className="faq-item">
								<h3>Why are some songs missing?</h3>
								<p>
									Some older or niche tracks might not be available on Spotify,
									or they might be listed under alternate titles. We do our best
									to match each one as accurately as possible.
								</p>
							</div>
							<div className="faq-item">
								<h3>Is my data safe?</h3>
								<p>
									Rewindify only uses the Spotify permissions necessary to
									create playlists on your behalf. We don't collect or store any
									personal data. Check our{" "}
									<a href="/privacy-policy" className="about-link">
										Privacy Policy
									</a>{" "}
									for more details.
								</p>
							</div>
							<div className="faq-item">
								<h3>What data sources do you use?</h3>
								<p>
									We pull chart data from{" "}
									<a
										className="about-link"
										href="https://www.billboard.com/charts/hot-100/"
										target="_blank"
										rel="noopener noreferrer"
									>
										Billboard
									</a>{" "}
									and match each track to Spotify's extensive music library.
								</p>
							</div>
						</div>
					</div>

					<div className="about-footer">
						<p>
							Made with ❤️ by{" "}
							<a
								href="https://github.com/ajs2583"
								className="about-footer-link"
							>
								Andrew Sliva
							</a>
						</p>
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
						<div className="personal-website-link">
							<a
								href="https://www.andrewsliva.dev/"
								target="_blank"
								rel="noopener noreferrer"
								className="personal-website-button"
							>
								🌐 Visit My Personal Website
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
