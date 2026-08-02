from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Literal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.data.member_stories import MEMBER_STORIES
from app.models.activity import Activity
from app.models.gratitude_entry import GratitudeEntry, GratitudeEntryStatus
from app.models.volunteer_activity import VolunteerActivity
from app.services.model_client import chat_text

NewsletterCadence = Literal["weekly", "monthly"]

GENERATE_SYSTEM = """You write email newsletters for Love 21 Foundation in Hong Kong.
Love 21 supports people with Down syndrome, autism, and other neurodiverse conditions through sport, nutrition, and community.

Rules:
- Write warm, inclusive, professional prose suitable for families, volunteers, and supporters.
- Use ONLY facts from the provided source material. Do not invent events, names, or statistics.
- Structure: greeting, programme highlights, member stories or community voices, upcoming events, call to action, warm sign-off.
- Plain text only. No markdown, no asterisks, no hashtags.
- First line must be: Subject: <compelling subject line>
- Then a blank line, then the newsletter body.
- Weekly newsletters: about 250-400 words. Monthly newsletters: about 400-650 words.
- Do not include meta commentary about being an AI."""


def _cadence_window(cadence: NewsletterCadence) -> timedelta:
    return timedelta(days=7 if cadence == "weekly" else 30)


def gather_newsletter_sources(db: Session, cadence: NewsletterCadence) -> dict[str, list[dict[str, str]]]:
    now = datetime.now(timezone.utc)
    since = now - _cadence_window(cadence)

    events = db.scalars(
        select(Activity)
        .where(Activity.created_at >= since)
        .order_by(Activity.starts_at.asc())
        .limit(8)
    ).all()
    if not events:
        events = db.scalars(
            select(Activity)
            .where(Activity.starts_at >= now)
            .order_by(Activity.starts_at.asc())
            .limit(6)
        ).all()

    volunteer_programmes = db.scalars(
        select(VolunteerActivity)
        .where(VolunteerActivity.status == "active", VolunteerActivity.created_at >= since)
        .order_by(VolunteerActivity.display_order.asc())
        .limit(6)
    ).all()

    gratitude_entries = db.scalars(
        select(GratitudeEntry)
        .where(
            GratitudeEntry.status == GratitudeEntryStatus.APPROVED,
            GratitudeEntry.moderated_at.is_not(None),
            GratitudeEntry.moderated_at >= since,
        )
        .order_by(GratitudeEntry.moderated_at.desc())
        .limit(5)
    ).all()

    return {
        "events": [
            {
                "title": event.title,
                "starts_at": event.starts_at.isoformat(),
                "location": event.location,
                "description": event.description[:400],
            }
            for event in events
        ],
        "volunteer_programmes": [
            {
                "title": programme.title,
                "schedule": programme.schedule_label,
                "location": programme.location_label,
                "description": programme.description[:300],
            }
            for programme in volunteer_programmes
        ],
        "community_voices": [
            {
                "name": entry.display_name or "Community member",
                "message": entry.message[:400],
            }
            for entry in gratitude_entries
        ],
        "member_stories": MEMBER_STORIES[:3 if cadence == "weekly" else 4],
    }


def _format_sources_block(sources: dict[str, list[dict[str, str]]], cadence: NewsletterCadence) -> str:
    lines = [f"Newsletter cadence: {cadence}", ""]

    lines.append("Events:")
    if sources["events"]:
        for item in sources["events"]:
            lines.append(f"- {item['title']} ({item['starts_at']}) at {item['location']}: {item['description']}")
    else:
        lines.append("- (none in this period)")

    lines.append("")
    lines.append("Volunteer programmes:")
    if sources["volunteer_programmes"]:
        for item in sources["volunteer_programmes"]:
            lines.append(f"- {item['title']} ({item['schedule']}, {item['location']}): {item['description']}")
    else:
        lines.append("- (none recently added)")

    lines.append("")
    lines.append("Approved community gratitude messages:")
    if sources["community_voices"]:
        for item in sources["community_voices"]:
            lines.append(f"- {item['name']}: \"{item['message']}\"")
    else:
        lines.append("- (none approved in this period)")

    lines.append("")
    lines.append("Member stories and milestones:")
    for item in sources["member_stories"]:
        lines.append(f"- {item['title']}: {item['summary']} Quote: \"{item['quote']}\"")

    return "\n".join(lines)


def _parse_subject_and_body(raw: str) -> tuple[str, str]:
    text = raw.strip()
    if text.lower().startswith("subject:"):
        first_break = text.find("\n")
        if first_break == -1:
            return text[8:].strip(), ""
        subject = text[8:first_break].strip()
        body = text[first_break:].strip()
        return subject or "Love 21 Foundation Newsletter", body

    return "Love 21 Foundation Newsletter", text


def _fallback_newsletter(sources: dict[str, list[dict[str, str]]], cadence: NewsletterCadence) -> tuple[str, str]:
    label = "Weekly" if cadence == "weekly" else "Monthly"
    subject = f"Love 21 Foundation {label} Update"

    paragraphs = [
        "Dear Love 21 community,",
        f"Here is your {label.lower()} update from Love 21 Foundation.",
    ]

    if sources["events"]:
        event = sources["events"][0]
        paragraphs.append(
            f"Coming up: {event['title']} at {event['location']}. {event['description'][:220]}"
        )

    if sources["member_stories"]:
        story = sources["member_stories"][0]
        paragraphs.append(f"Member highlight: {story['title']} — {story['summary']}")

    if sources["community_voices"]:
        voice = sources["community_voices"][0]
        paragraphs.append(f"From our community: {voice['name']} shared, \"{voice['message'][:180]}\"")

    paragraphs.append("Visit love21foundation.com to volunteer, donate, or explore our programmes.")
    paragraphs.append("With gratitude,\nThe Love 21 Foundation team")

    return subject, "\n\n".join(paragraphs)


def generate_newsletter(
    db: Session,
    *,
    cadence: NewsletterCadence,
    guidance: str | None = None,
) -> tuple[str, str, dict[str, list[dict[str, str]]], str | None]:
    sources = gather_newsletter_sources(db, cadence)
    sources_block = _format_sources_block(sources, cadence)

    user = f"""Draft a {cadence} email newsletter using this source material:

{sources_block}
{f"Additional guidance from the editor: {guidance}" if guidance else ""}

Return the subject line and full newsletter body as plain text."""

    raw = chat_text(
        system=GENERATE_SYSTEM,
        messages=[{"role": "user", "content": user}],
        num_predict=900 if cadence == "monthly" else 650,
    )

    if raw:
        subject, content = _parse_subject_and_body(raw)
        if content.strip():
            return subject, content.strip(), sources, None

    subject, content = _fallback_newsletter(sources, cadence)
    error = None if raw else "AI generation is unavailable. Using a template draft from recent site content."
    return subject, content, sources, error
