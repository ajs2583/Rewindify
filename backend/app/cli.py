"""Flask CLI commands for scheduled jobs."""

import time
from datetime import date, timedelta

import click

from .chart_service import get_dates_to_refresh, refresh_chart


def _saturdays_back(weeks):
    """Yield chart dates (Saturdays) going back `weeks` from the latest Saturday."""
    today = date.today()
    d = today
    while d.weekday() != 5:
        d -= timedelta(days=1)
    for _ in range(weeks):
        if d.year < 1958:
            break  # Billboard Hot 100 started 1958
        yield d
        d -= timedelta(days=7)


def init_cli(app):
    @app.cli.command("scrape-daily")
    def scrape_daily():
        """
        Refresh cached charts: DB dates (oldest first, cap 50) plus current chart week.
        Run daily via Heroku Scheduler with: flask scrape-daily
        """
        with app.app_context():
            dates = get_dates_to_refresh(limit=50)
            # Add latest Billboard chart week (Saturday)
            today = date.today()
            last_sat = today
            while last_sat.weekday() != 5:  # 5 = Saturday
                last_sat -= timedelta(days=1)
            if last_sat not in dates:
                dates.insert(0, last_sat)
            date_strs = [d.strftime("%Y-%m-%d") for d in dates]
            for i, date_str in enumerate(date_strs):
                refresh_chart(date_str, 100)
                if i < len(date_strs) - 1:
                    time.sleep(1.5)
            print(f"Refreshed {len(date_strs)} chart(s)")

    @app.cli.command("scrape-now")
    @click.option(
        "--weeks", default=12, help="Number of weekly charts to scrape (default 12)"
    )
    def scrape_now(weeks):
        """
        Scrape chart data now and insert into the DB. Uses weekly (Saturday) chart dates.
        Example: flask scrape-now
        Example: flask scrape-now --weeks 52
        """
        with app.app_context():
            dates = list(_saturdays_back(weeks))
            date_strs = [d.strftime("%Y-%m-%d") for d in dates]
            for i, date_str in enumerate(date_strs):
                n = refresh_chart(date_str, 100)
                print(f"  {date_str}: {n} songs")
                if i < len(date_strs) - 1:
                    time.sleep(1.5)
            print(f"Done. Inserted/updated {len(date_strs)} chart(s) into the DB.")
