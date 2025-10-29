# Billboard scraper logic
import requests
from bs4 import BeautifulSoup
import logging
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def construct_url(date):
    return f"https://www.billboard.com/charts/hot-100/{date}"


def scrape_chart(date, limit=100):
    url = construct_url(date)
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        response = requests.get(url, headers=headers, verify=False)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching Billboard chart: {e}")
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
