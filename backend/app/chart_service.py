"""Chart data service: DB-first with scrape on miss."""

import logging
from datetime import datetime

from .billboard import scrape_chart
from .models import db, ChartSnapshot


def refresh_chart(date_str, limit=100):
    """
    Force scrape for date and upsert into DB. Used by daily job.
    Returns number of songs saved, or 0 on failure.
    """
    d = _parse_date(date_str)
    if not d:
        return 0
    songs = scrape_chart(date_str, limit)
    if not songs:
        return 0
    try:
        row = ChartSnapshot.query.get(d)
        if row:
            row.songs = songs
            row.scraped_at = datetime.utcnow()
        else:
            row = ChartSnapshot(chart_date=d, songs=songs)
            db.session.add(row)
        db.session.commit()
        return len(songs)
    except Exception as e:
        logging.warning("DB write failed for %s: %s", date_str, e)
        try:
            db.session.rollback()
        except Exception:
            pass
        return 0


def _parse_date(date_str):
    """Parse YYYY-MM-DD to date object."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None


def get_chart(date_str, limit=100):
    """
    Get chart for date. Tries DB first; on miss, scrapes Billboard and saves to DB.
    Returns list of {"title": str, "artist": str} or empty list on error.
    """
    d = _parse_date(date_str)
    if not d:
        return []

    try:
        row = ChartSnapshot.query.get(d)
        if row:
            return row.to_songs_list(limit)
    except Exception as e:
        logging.warning("DB read failed, falling back to scrape: %s", e)

    songs = scrape_chart(date_str, limit)
    if not songs:
        return []

    try:
        row = ChartSnapshot.query.get(d)
        payload = songs
        if row:
            row.songs = payload
            row.scraped_at = datetime.utcnow()
        else:
            row = ChartSnapshot(chart_date=d, songs=payload)
            db.session.add(row)
        db.session.commit()
    except Exception as e:
        logging.warning("DB write failed (chart still returned): %s", e)
        try:
            db.session.rollback()
        except Exception:
            pass

    return songs


def get_dates_to_refresh(limit=50):
    """Return chart_date values to refresh (oldest scraped_at first), capped."""
    try:
        rows = (
            ChartSnapshot.query.order_by(ChartSnapshot.scraped_at.asc())
            .limit(limit)
            .all()
        )
        return [r.chart_date for r in rows]
    except Exception as e:
        logging.warning("Failed to list dates to refresh: %s", e)
        return []
