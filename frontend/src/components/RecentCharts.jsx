// components/RecentCharts.jsx
import React, { useEffect, useState, memo } from "react";
import { fetchRecentCharts } from "../api/playlist";

const RecentCharts = memo(({ onDateSelect }) => {
	const [charts, setCharts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadCharts = async () => {
			try {
				const data = await fetchRecentCharts();
				if (data.success) {
					setCharts(data.charts);
				}
			} catch (error) {
				console.error("Error loading recent charts:", error);
			} finally {
				setLoading(false);
			}
		};

		loadCharts();
	}, []);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getYear = (dateString) => {
		return dateString.split("-")[0];
	};

	if (loading) {
		return (
			<div className="recent-charts">
				<h3>🔥 Popular Charts</h3>
				<div className="charts-loading">Loading popular dates...</div>
			</div>
		);
	}

	if (charts.length === 0) {
		return (
			<div className="recent-charts">
				<h3>🔥 Popular Charts</h3>
				<div className="charts-empty">
					<p>No popular charts yet. Be the first to explore!</p>
				</div>
			</div>
		);
	}

	return (
		<div className="recent-charts">
			<h3>🔥 Popular Charts</h3>
			<div className="charts-grid">
				{charts.map((chart, index) => (
					<div
						key={chart.date}
						className="chart-item"
						onClick={() => onDateSelect(chart.date)}
					>
						<div className="chart-rank">#{index + 1}</div>
						<div className="chart-info">
							<div className="chart-date">{formatDate(chart.date)}</div>
							<div className="chart-year">{getYear(chart.date)}</div>
							<div className="chart-count">{chart.count} explorations</div>
						</div>
						<div className="chart-action">→</div>
					</div>
				))}
			</div>
		</div>
	);
});

export default RecentCharts;
