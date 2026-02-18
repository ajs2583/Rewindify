# Billboard scraper logic
import logging
import time

import requests
from bs4 import BeautifulSoup

from .http_utils import verify_ssl_for_requests


def construct_url(date):
    return f"https://www.billboard.com/charts/hot-100/{date}"


def scrape_chart(date, limit=100, max_retries=3, retry_delay=1.5):
    url = construct_url(date)
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    verify = verify_ssl_for_requests()
    if not verify:
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    last_error = None
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, verify=verify, timeout=30)
            response.raise_for_status()
            break
        except requests.exceptions.RequestException as e:
            last_error = e
            logging.warning("Billboard fetch attempt %s/%s failed: %s", attempt + 1, max_retries, e)
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
    else:
        logging.error("Error fetching Billboard chart after %s attempts: %s", max_retries, last_error)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    chart_items = soup.select("li.o-chart-results-list__item")

    songs = []
    for item in chart_items:
        title_el = item.select_one("h3.c-title")
        artist_el = item.select_one("span.c-label")
        if title_el and artist_el:
            title = title_el.get_text(strip=True)
            artist = artist_el.get_text(strip=True)
            songs.append({"title": title, "artist": artist})
        if len(songs) >= limit:
            break

    return songs
