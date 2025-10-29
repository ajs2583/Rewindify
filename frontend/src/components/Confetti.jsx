// components/Confetti.jsx
import React, { useEffect, useState } from "react";

const Confetti = ({ show, onComplete }) => {
	const [pieces, setPieces] = useState([]);

	useEffect(() => {
		if (show) {
			// Generate confetti pieces
			const newPieces = [];
			const colors = [
				"#ff6b6b",
				"#4ecdc4",
				"#45b7d1",
				"#96ceb4",
				"#feca57",
				"#ff9ff3",
				"#54a0ff",
			];

			for (let i = 0; i < 50; i++) {
				newPieces.push({
					id: i,
					color: colors[Math.floor(Math.random() * colors.length)],
					left: Math.random() * 100,
					delay: Math.random() * 2,
					size: Math.random() * 8 + 6, // 6-14px
				});
			}

			setPieces(newPieces);

			// Clean up after animation completes
			const timer = setTimeout(() => {
				setPieces([]);
				if (onComplete) onComplete();
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [show, onComplete]);

	if (!show || pieces.length === 0) return null;

	return (
		<div className="confetti-container">
			{pieces.map((piece) => (
				<div
					key={piece.id}
					className="confetti-piece"
					style={{
						left: `${piece.left}%`,
						backgroundColor: piece.color,
						width: `${piece.size}px`,
						height: `${piece.size}px`,
						animationDelay: `${piece.delay}s`,
					}}
				/>
			))}
		</div>
	);
};

export default Confetti;
