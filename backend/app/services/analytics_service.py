from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.admin_event import AdminEvent, EventStatus
from app.models.admin_volunteer_program import AdminVolunteerProgram, ProgramStatus
from app.models.analytics import AnalyticsDailyRollup, AnalyticsEvent
from app.models.newsletter_subscriber import NewsletterSubscriber, SubscriberStatus
from app.models.user import Role, User

EVENT_TO_METRIC: dict[str, str] = {
    "donate_cta_click": "donate_cta_clicks",
    "volunteer_match_requested": "volunteer_matches",
    "captain_chat_sent": "captain_chats",
    "captain_tool_executed": "captain_tool_executions",
    "locale_changed": "locale_changes",
    "newsletter_subscribed": "newsletter_subscriptions",
    "page_view": "page_views",
}


def record_event(
    db: Session,
    *,
    event_name: str,
    session_id: str | None = None,
    user_id: int | None = None,
    locale: str | None = None,
    page_path: str | None = None,
    source: str = "web",
    properties: dict | None = None,
) -> AnalyticsEvent:
    event = AnalyticsEvent(
        event_name=event_name,
        session_id=session_id,
        user_id=user_id,
        locale=locale,
        page_path=page_path,
        source=source,
        properties=properties or {},
        occurred_at=datetime.now(timezone.utc),
    )
    db.add(event)
    db.flush()

    metric_key = EVENT_TO_METRIC.get(event_name, event_name)
    _increment_daily_rollup(db, metric_key=metric_key, on_date=event.occurred_at.date())
    return event


def _increment_daily_rollup(db: Session, *, metric_key: str, on_date: date, amount: int = 1) -> None:
    rollup = db.scalar(
        select(AnalyticsDailyRollup).where(
            AnalyticsDailyRollup.rollup_date == on_date,
            AnalyticsDailyRollup.metric_key == metric_key,
        )
    )
    if rollup is None:
        rollup = AnalyticsDailyRollup(rollup_date=on_date, metric_key=metric_key, value=amount)
        db.add(rollup)
    else:
        rollup.value += amount


def rollup_total(db: Session, metric_key: str, *, days: int = 30) -> int:
    since = date.today().toordinal() - days
    since_date = date.fromordinal(since)
    total = db.scalar(
        select(func.coalesce(func.sum(AnalyticsDailyRollup.value), 0)).where(
            AnalyticsDailyRollup.metric_key == metric_key,
            AnalyticsDailyRollup.rollup_date >= since_date,
        )
    )
    return int(total or 0)


def admin_metrics(db: Session) -> dict[str, int]:
    active_members = db.scalar(select(func.count()).select_from(User).where(User.role == Role.MEMBER)) or 0
    newsletter_subscribers = (
        db.scalar(
            select(func.count()).select_from(NewsletterSubscriber).where(
                NewsletterSubscriber.status == SubscriberStatus.ACTIVE
            )
        )
        or 0
    )
    upcoming_events = (
        db.scalar(
            select(func.count()).select_from(AdminEvent).where(AdminEvent.status != EventStatus.COMPLETED)
        )
        or 0
    )
    open_volunteer_roles = (
        db.scalar(
            select(func.count())
            .select_from(AdminVolunteerProgram)
            .where(AdminVolunteerProgram.status == ProgramStatus.OPEN)
        )
        or 0
    )

    return {
        "active_members": int(active_members),
        "newsletter_subscribers": int(newsletter_subscribers),
        "upcoming_events": int(upcoming_events),
        "open_volunteer_roles": int(open_volunteer_roles),
        "captain_chats_30d": rollup_total(db, "captain_chats"),
        "volunteer_matches_30d": rollup_total(db, "volunteer_matches"),
        "donate_cta_clicks_30d": rollup_total(db, "donate_cta_clicks"),
        "locale_changes_30d": rollup_total(db, "locale_changes"),
    }
