from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.db import SessionLocal, create_db_and_tables
from app.services.analytics_service import admin_metrics, record_event


def test_record_event_increments_rollup() -> None:
    create_db_and_tables()
    with SessionLocal() as db:
        record_event(db, event_name="donate_cta_click", page_path="/donate", locale="en")
        db.commit()
        metrics = admin_metrics(db)
        assert metrics["donate_cta_clicks_30d"] >= 1


def test_admin_metrics_returns_counts() -> None:
    create_db_and_tables()
    with SessionLocal() as db:
        metrics = admin_metrics(db)
        assert "active_members" in metrics
        assert "newsletter_subscribers" in metrics
        assert "captain_chats_30d" in metrics
