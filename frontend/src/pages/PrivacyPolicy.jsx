// pages/PrivacyPolicy.jsx
import React from "react";

export default function PrivacyPolicy() {
	return (
		<div className="page privacy-page">
			<div className="privacy-container">
				<h1 className="privacy-title">Privacy Policy</h1>

				<div className="privacy-content">
					<p className="privacy-intro">
						Rewindify was developed as an open source app powered by the Spotify
						Web API and Billboard chart data. By choosing to use this app, you
						agree to the use of your Spotify account username and data for
						creating personalized playlists based on Billboard chart data.
					</p>

					<div className="privacy-section">
						<h2>Data Collection & Usage</h2>
						<p>
							None of the data used by Rewindify is stored or collected
							anywhere, and it is NOT shared with any third parties. All
							information is used solely for:
						</p>
						<ul>
							<li>
								Creating personalized Spotify playlists based on Billboard chart
								data
							</li>
							<li>Accessing your Spotify account to add songs to playlists</li>
							<li>Displaying song information from Billboard charts</li>
						</ul>
					</div>

					<div className="privacy-section">
						<h2>Spotify Integration</h2>
						<p>Rewindify uses Spotify's Web API to:</p>
						<ul>
							<li>Authenticate your Spotify account</li>
							<li>Search for songs on Spotify's platform</li>
							<li>Create playlists in your Spotify account</li>
							<li>Add selected songs to your playlists</li>
						</ul>
						<p>
							We only request the minimum permissions necessary:{" "}
							<code>playlist-modify-private</code> to create private playlists
							in your account.
						</p>
					</div>

					<div className="privacy-section">
						<h2>Billboard Data</h2>
						<p>
							Rewindify scrapes publicly available Billboard Hot 100 chart data
							to provide you with historical song information. This data is
							publicly available and does not contain any personal information.
						</p>
					</div>

					<div className="privacy-section">
						<h2>Revoking Access</h2>
						<p>
							Although you can rest assured that your data is not being stored
							or used maliciously, if you would like to revoke Rewindify's
							permissions, you can visit your
							<a
								href="https://www.spotify.com/account/apps/"
								target="_blank"
								rel="noopener noreferrer"
								className="privacy-link"
							>
								{" "}
								Spotify apps page
							</a>{" "}
							and click "REMOVE ACCESS" on Rewindify.
						</p>
					</div>

					<div className="privacy-section">
						<h2>Open Source</h2>
						<p>
							Rewindify is an open source project. You can view the source code,
							contribute, or report issues on our
							<a
								href="https://github.com/ajs2583"
								target="_blank"
								rel="noopener noreferrer"
								className="privacy-link"
							>
								{" "}
								GitHub repository
							</a>
							.
						</p>
					</div>

					<div className="privacy-footer">
						<p>
							Made with ❤️ by{" "}
							<a href="https://github.com/ajs2583" className="privacy-link">
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
