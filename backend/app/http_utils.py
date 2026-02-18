"""Shared HTTP/SSL helpers. SSL verification is on by default; dev-only opt-in to disable."""

import os
import logging

import requests
from dotenv import load_dotenv

load_dotenv()

_DEV_ENV_NAMES = ("development",)


def _is_dev_environment():
    env = (os.getenv("FLASK_ENV") or os.getenv("APP_ENV") or "").strip().lower()
    return env in _DEV_ENV_NAMES


def _is_ssl_verify_disabled_allowed():
    """True only when DISABLE_SSL_VERIFY is set and we're in development. Never use in production."""
    if not _is_dev_environment():
        return False
    return (os.getenv("DISABLE_SSL_VERIFY") or "").strip().lower() in ("1", "true", "yes")


def verify_ssl_for_requests():
    """Return False to disable SSL verification only when dev opt-in is set; else True (verified)."""
    return not _is_ssl_verify_disabled_allowed()


def get_requests_session_for_outbound():
    """
    Return a requests.Session with verify=False only when DISABLE_SSL_VERIFY + FLASK_ENV=development.
    Otherwise return None so callers use default (verified) behavior.
    """
    if not _is_ssl_verify_disabled_allowed():
        return None
    logging.warning(
        "SSL verification is disabled via DISABLE_SSL_VERIFY (dev only). "
        "Never set this in production."
    )
    session = requests.Session()
    session.verify = False
    return session
