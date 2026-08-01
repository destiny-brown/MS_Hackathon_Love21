from __future__ import annotations

import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def send_email(*, to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    settings = get_settings()
    if settings.resend_api_key:
        try:
            response = httpx.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.newsletter_from_email,
                    "to": [to_email],
                    "subject": subject,
                    "html": html_body,
                    "text": text_body,
                },
                timeout=30,
            )
            response.raise_for_status()
            return True
        except Exception:
            logger.exception("Failed to send email via Resend to %s", to_email)
            return False

    logger.info("Mock email to %s | subject=%s | preview=%s", to_email, subject, text_body[:120])
    return True
