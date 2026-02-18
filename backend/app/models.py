from datetime import date, datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ChartSnapshot(db.Model):
    """Cached Billboard Hot 100 chart for a given date."""

    __tablename__ = "chart_snapshots"

    chart_date = db.Column(db.Date, primary_key=True)
    songs = db.Column(db.JSON, nullable=False)  # list of {"title": str, "artist": str}
    scraped_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_songs_list(self, limit=100):
        """Return songs list capped to limit."""
        items = self.songs or []
        return items[:limit]
