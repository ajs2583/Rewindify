// pages/Contact.jsx
import React from "react";

export default function Contact() {
	return (
		<div className="page contact-page">
			<div className="contact-container">
				<h1 className="contact-title">Contact</h1>

				<div className="contact-content">
					<div className="contact-section">
						<h2>Get in Touch</h2>
						<p>
							Have questions about Rewindify? Found a bug? Want to suggest a
							feature? I'd love to hear from you!
						</p>
					</div>

					<div className="contact-section">
						<h2>Developer</h2>
						<div className="contact-info">
							<p>
								<strong>Andrew Sliva</strong>
							</p>
							<p>Full Stack Developer & Music Enthusiast</p>
						</div>
					</div>

					<div className="contact-section">
						<h2>Connect With Me</h2>
						<div className="contact-links">
							<a
								href="https://github.com/ajs2583"
								target="_blank"
								rel="noopener noreferrer"
								className="contact-link"
							>
								🐙 GitHub
							</a>
							<a
								href="https://www.linkedin.com/in/andrew-sliva-7a49a9272/"
								target="_blank"
								rel="noopener noreferrer"
								className="contact-link"
							>
								💼 LinkedIn
							</a>
							<a
								href="mailto:sliva.andrew1502@gmail.com"
								className="contact-link"
							>
								📧 Email
							</a>
						</div>
					</div>

					<div className="contact-section">
						<h2>About Rewindify</h2>
						<p>
							Rewindify is a passion project that combines my love for music
							history and web development. It allows users to explore Billboard
							chart data from any date and create personalized Spotify playlists
							based on the hits of that era.
						</p>
						<p>
							Built with React, Flask, and powered by Spotify's Web API,
							Rewindify demonstrates modern web development practices while
							providing a fun and nostalgic music discovery experience.
						</p>
					</div>

					<div className="contact-section">
						<h2>Technical Support</h2>
						<p>
							If you're experiencing technical issues with Rewindify, please:
						</p>
						<ul>
							<li>Check that you're logged into Spotify</li>
							<li>Ensure your internet connection is stable</li>
							<li>Try refreshing the page</li>
							<li>
								Report the issue on{" "}
								<a href="https://github.com/ajs2583" className="contact-link">
									GitHub
								</a>{" "}
								with details about the problem
							</li>
						</ul>
					</div>

					<div className="contact-footer">
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
