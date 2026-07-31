from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.admin_event import AdminEvent, EventCategory, EventStatus
from app.models.admin_volunteer_program import AdminVolunteerProgram, ProgramCategory, ProgramStatus
from app.models.analytics import AnalyticsDailyRollup, AnalyticsEvent
from app.models.newsletter_subscriber import NewsletterSubscriber, SubscriberStatus
from app.services.analytics_service import EVENT_TO_METRIC

SAMPLE_EVENTS = [
    ("donate_cta_click", "/donate"),
    ("donate_cta_click", "/"),
    ("volunteer_match_requested", "/our-volunteer"),
    ("captain_chat_sent", "/learn-play"),
    ("captain_tool_executed", "/our-volunteer"),
    ("locale_changed", "/"),
    ("newsletter_subscribed", "/newsletter"),
    ("page_view", "/impact-dashboard"),
]

SAMPLE_NEWSLETTER = [
    ("John", "Doe", "john.doe@example.com", "+852 9123 4567"),
    ("Jane", "Smith", "jane.smith@example.com", "+852 9876 5432"),
    ("Michael", "Wong", "michael.wong@example.com", "+852 8765 4321"),
]

SAMPLE_ADMIN_EVENTS = [
    {
        "title": "Beyond Limits Banquet",
        "description": "Signature fundraising event supporting community programmes.",
        "event_date": date(2026, 10, 15),
        "location": "Grand Hyatt Hong Kong",
        "registrations": 45,
        "max_capacity": 200,
        "category": EventCategory.FUNDRAISING,
        "status": EventStatus.UPCOMING,
    },
    {
        "title": "Community Sports Day",
        "description": "Annual sports day for members and families.",
        "event_date": date(2026, 11, 1),
        "location": "Victoria Park",
        "registrations": 78,
        "max_capacity": 100,
        "category": EventCategory.SPORTS,
        "status": EventStatus.UPCOMING,
    },
]

SAMPLE_VOLUNTEER_PROGRAMS = [
    {
        "title": "Football & Basketball Coach",
        "description": "Help run our weekly ball-game sessions — no coaching certificate needed.",
        "category": ProgramCategory.SPORT,
        "schedule": "Saturday mornings",
        "location": "San Po Kong centre",
        "filled": 3,
        "total": 5,
        "status": ProgramStatus.OPEN,
    },
    {
        "title": "Swimming & Dragon Boat Buddy",
        "description": "Support our water-based sessions — a splash of confidence, one paddle at a time.",
        "category": ProgramCategory.SPORT,
        "schedule": "Sunday mornings",
        "location": "Victoria Park pool",
        "filled": 17,
        "total": 20,
        "status": ProgramStatus.CLOSING,
    },
]


def seed_analytics_content(db: Session) -> None:
    if db.scalar(select(NewsletterSubscriber.id).limit(1)) is None:
        db.add_all(
            [
                NewsletterSubscriber(
                    first_name=first,
                    last_name=last,
                    email=email,
                    phone_number=phone,
                    status=SubscriberStatus.ACTIVE,
                )
                for first, last, email, phone in SAMPLE_NEWSLETTER
            ]
        )

    if db.scalar(select(AdminEvent.id).limit(1)) is None:
        db.add_all([AdminEvent(**entry) for entry in SAMPLE_ADMIN_EVENTS])

    if db.scalar(select(AdminVolunteerProgram.id).limit(1)) is None:
        db.add_all([AdminVolunteerProgram(**entry) for entry in SAMPLE_VOLUNTEER_PROGRAMS])

    if db.scalar(select(AnalyticsEvent.id).limit(1)) is None:
        now = datetime.now(timezone.utc)
        events: list[AnalyticsEvent] = []
        for day_offset in range(14):
            day = now - timedelta(days=day_offset)
            for event_name, page_path in SAMPLE_EVENTS:
                events.append(
                    AnalyticsEvent(
                        event_name=event_name,
                        page_path=page_path,
                        locale="en" if day_offset % 3 else "yue",
                        session_id=f"seed-session-{day_offset}",
                        source="seed",
                        properties={},
                        occurred_at=day,
                    )
                )
        db.add_all(events)

    if db.scalar(select(AnalyticsDailyRollup.id).limit(1)) is None:
        today = date.today()
        rollups: list[AnalyticsDailyRollup] = []
        for day_offset in range(30):
            rollup_date = today - timedelta(days=day_offset)
            for event_name in EVENT_TO_METRIC:
                rollups.append(
                    AnalyticsDailyRollup(
                        rollup_date=rollup_date,
                        metric_key=EVENT_TO_METRIC[event_name],
                        value=max(1, 12 - day_offset // 3),
                    )
                )
        db.add_all(rollups)

    db.commit()
