from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.services.ollama_client import chat_json

router = APIRouter(prefix="/ai/trail", tags=["ai"])


class TrailDebriefRequest(BaseModel):
    captain_name: str = "Captain"
    stop_title: str
    ability_line: str
    sections_completed: int = Field(ge=0)
    trail_streak: int = Field(ge=0)
    myth_completed_today: bool = False
    myth_won_today: bool = False
    myth_statement: str | None = None


class TrailDebriefResponse(BaseModel):
    enabled: bool
    ai_enhanced: bool
    encouragement: str
    friend_prompt: str
    suggested_replies: list[str]
    upgrade_message: str
    message: str | None = None


def _fallback_debrief(payload: TrailDebriefRequest) -> TrailDebriefResponse:
    if payload.myth_won_today:
        upgrade = "Full upgrade — you fact-checked today's myth and ran the relay. Captain 21 is glowing."
    elif payload.myth_completed_today:
        upgrade = "Partial upgrade — you learned from today's myth even if the first guess was off. Keep going."
    else:
        upgrade = "Base upgrade — try today's Daily Myth Buster before your next run for a bigger boost."

    return TrailDebriefResponse(
        enabled=True,
        ai_enhanced=False,
        encouragement=(
            f"Nice work, {payload.captain_name}! You made it through {payload.sections_completed} "
            f"section{'s' if payload.sections_completed != 1 else ''} at {payload.stop_title}."
        ),
        friend_prompt="What would you say to a friend who still believes a myth about neurodiversity?",
        suggested_replies=[
            "Ability shows up in many forms — let's look at what people can do.",
            "I'd share a real Love 21 story instead of a stereotype.",
            "I don't think that's true — here's what I've learned.",
        ],
        upgrade_message=upgrade,
        message="Rule-based debrief. Ollama can polish this when running locally.",
    )


@router.post("/debrief", response_model=TrailDebriefResponse)
def trail_debrief(payload: TrailDebriefRequest) -> TrailDebriefResponse:
    settings = get_settings()
    fallback = _fallback_debrief(payload)

    if not settings.ollama_enabled:
        return fallback

    myth_context = (
        f"Today's myth statement: {payload.myth_statement}"
        if payload.myth_statement
        else "No myth played today."
    )
    myth_status = (
        "won today's myth"
        if payload.myth_won_today
        else "attempted today's myth"
        if payload.myth_completed_today
        else "has not played today's myth"
    )

    parsed = chat_json(
        system=(
            "You are Captain 21's inclusion coach at Love 21 Foundation. "
            "Use ability-first, warm language. Never frame neurodiversity as something to fix. "
            'Return JSON: {"encouragement":"...","friend_prompt":"...","suggested_replies":["","",""],"upgrade_message":"..."}'
        ),
        user=(
            f"Captain name: {payload.captain_name}\n"
            f"Trail stop: {payload.stop_title}\n"
            f"Ability line: {payload.ability_line}\n"
            f"Sections completed: {payload.sections_completed}\n"
            f"Trail streak days: {payload.trail_streak}\n"
            f"Learner {myth_status}.\n"
            f"{myth_context}\n"
            "Write a short encouragement, one friend myth-busting prompt, three brief reply chips, "
            "and an upgrade message (full if myth won, partial if attempted, base if not played)."
        ),
        timeout_seconds=settings.ollama_enhance_timeout_seconds,
    )

    if not parsed:
        return fallback

    replies = parsed.get("suggested_replies") or fallback.suggested_replies
    if not isinstance(replies, list):
        replies = fallback.suggested_replies

    return TrailDebriefResponse(
        enabled=True,
        ai_enhanced=True,
        encouragement=str(parsed.get("encouragement") or fallback.encouragement),
        friend_prompt=str(parsed.get("friend_prompt") or fallback.friend_prompt),
        suggested_replies=[str(item) for item in replies[:3]] or fallback.suggested_replies,
        upgrade_message=str(parsed.get("upgrade_message") or fallback.upgrade_message),
    )
