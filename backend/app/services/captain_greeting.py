from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.data.twenty_one_moves import resolve_trail_location
from app.models.activity import ActivitySignup, VolunteerHour
from app.models.donation import Donation
from app.models.user import User
from app.models.user_play_state import CaptainGreetingCache, UserPlayState
from app.services.model_client import chat_json


@dataclass
class SupporterPlayContext:
    has_donations: bool
    total_volunteer_hours: float
    signed_up_activity_count: int
    recurring_supporter: bool


@dataclass
class TrailSnapshot:
    day_number: int
    event_index: int
    location_id: str
    location_label: str
    events_total: int
    events_remaining: int
    current_streak: int
    best_streak: int
    total_plays: int


def default_play_state(user_id: int) -> UserPlayState:
    now = datetime.now(timezone.utc)
    return UserPlayState(
        user_id=user_id,
        day_number=1,
        event_index=0,
        correct_count=0,
        total_answered=0,
        current_streak=0,
        best_streak=0,
        total_plays=0,
        last_played_at=None,
        created_at=now,
        updated_at=now,
    )


def get_or_create_play_state(db: Session, user_id: int) -> UserPlayState:
    state = db.scalar(select(UserPlayState).where(UserPlayState.user_id == user_id))
    if state is None:
        state = default_play_state(user_id)
        db.add(state)
        db.commit()
        db.refresh(state)
    return state


def build_trail_snapshot(state: UserPlayState) -> TrailSnapshot:
    location = resolve_trail_location(state.day_number)
    remaining = max(0, location.events_count - state.event_index)
    return TrailSnapshot(
        day_number=state.day_number,
        event_index=state.event_index,
        location_id=location.id,
        location_label=location.label,
        events_total=location.events_count,
        events_remaining=remaining,
        current_streak=state.current_streak,
        best_streak=state.best_streak,
        total_plays=state.total_plays,
    )


def load_supporter_context(db: Session, user_id: int) -> SupporterPlayContext:
    donation_count = db.scalar(
        select(func.count())
        .select_from(Donation)
        .where(Donation.supporter_id == user_id, Donation.status == "succeeded")
    ) or 0
    recurring_count = db.scalar(
        select(func.count())
        .select_from(Donation)
        .where(
            Donation.supporter_id == user_id,
            Donation.status == "succeeded",
            Donation.frequency == "monthly",
        )
    ) or 0
    signup_count = db.scalar(
        select(func.count())
        .select_from(ActivitySignup)
        .where(ActivitySignup.supporter_id == user_id, ActivitySignup.status != "cancelled")
    ) or 0
    total_hours = db.scalar(
        select(func.coalesce(func.sum(VolunteerHour.hours), 0)).where(VolunteerHour.supporter_id == user_id)
    )
    return SupporterPlayContext(
        has_donations=donation_count > 0,
        total_volunteer_hours=round(float(total_hours or 0), 2),
        signed_up_activity_count=int(signup_count),
        recurring_supporter=recurring_count > 0,
    )


def _first_name(user: User) -> str:
    local = user.email.split("@", 1)[0]
    token = local.replace(".", " ").replace("_", " ").split(" ", 1)[0]
    return token.capitalize() if token else "friend"


def fallback_greeting(user: User, trail: TrailSnapshot, context: SupporterPlayContext) -> str:
    name = _first_name(user)
    if trail.total_plays == 0 and trail.day_number == 1 and trail.event_index == 0:
        return f"Welcome aboard, {name}! Captain 21 saved your spot at {trail.location_label} — ready for your first move?"
    if trail.current_streak >= 4:
        base = f"Strong run, {name}! Streak {trail.current_streak} at {trail.location_label} — one more day on the trail?"
    elif trail.current_streak > 0:
        base = f"Nice momentum, {name}. Day {trail.day_number} at {trail.location_label} — keep the relay going."
    else:
        base = f"Pick up where you left off at {trail.location_label}, {name}. Captain 21 is cheering you on."

    if context.total_volunteer_hours > 0 and context.has_donations:
        return f"{base} You're learning and giving — that's Love 21."
    if context.total_volunteer_hours > 0:
        return f"{base} Your volunteer heart matches your trail energy."
    if context.has_donations:
        return f"{base} Thanks for backing the community while you learn."
    return base


def generate_greeting(
    db: Session,
    user: User,
    trail: TrailSnapshot,
    context: SupporterPlayContext,
    greeting_date: date,
) -> tuple[str, bool]:
    cached = db.scalar(
        select(CaptainGreetingCache).where(
            CaptainGreetingCache.user_id == user.id,
            CaptainGreetingCache.greeting_date == greeting_date,
        )
    )
    if cached:
        return cached.message, cached.ai_enhanced

    fallback = fallback_greeting(user, trail, context)
    supporter_bits: list[str] = []
    if context.has_donations:
        supporter_bits.append("has donated to Love 21")
    if context.recurring_supporter:
        supporter_bits.append("gives monthly")
    if context.total_volunteer_hours > 0:
        supporter_bits.append(f"logged {context.total_volunteer_hours:g} volunteer hours")
    if context.signed_up_activity_count > 0:
        supporter_bits.append(f"signed up for {context.signed_up_activity_count} activities")
    supporter_summary = ", ".join(supporter_bits) if supporter_bits else "new supporter exploring Learn"

    parsed = chat_json(
        system=(
            "You are Captain 21 at Love 21 Foundation. Write one warm, ability-first sentence (max 220 chars) "
            "plus an optional short nudge to continue the 21 Moves trail. Never mention daily myths. "
            'Return JSON: {"message":"..."}'
        ),
        user=(
            f"Player name: {_first_name(user)}\n"
            f"Trail day: {trail.day_number}\n"
            f"Location: {trail.location_label}\n"
            f"Events remaining today: {trail.events_remaining} of {trail.events_total}\n"
            f"Current streak: {trail.current_streak}\n"
            f"Best streak: {trail.best_streak}\n"
            f"Total completed trail days: {trail.total_plays}\n"
            f"Supporter context: {supporter_summary}\n"
            "Invite them to continue 21 Moves today."
        ),
    )

    message = fallback
    ai_enhanced = False
    if parsed and isinstance(parsed.get("message"), str) and parsed["message"].strip():
        message = parsed["message"].strip()
        ai_enhanced = True

    db.add(
        CaptainGreetingCache(
            user_id=user.id,
            greeting_date=greeting_date,
            message=message,
            ai_enhanced=ai_enhanced,
        )
    )
    db.commit()
    return message, ai_enhanced
