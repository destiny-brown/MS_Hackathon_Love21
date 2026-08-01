from __future__ import annotations

import re
from typing import Any, Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.data.captain_tools import ALLOWED_LOCALES, ALLOWED_NAV_PATHS, TOOL_NAMES, TOOLS_PROMPT
from app.services.captain_link_router import pick_site_links
from app.services.captain_rag import format_context
from app.services.ollama_client import chat_json, chat_text

router = APIRouter(prefix="/ai/captain", tags=["ai"])

LOCALE_INSTRUCTIONS: dict[str, str] = {
    "en": "Reply in English.",
    "yue": "Reply in Cantonese (粵語) using traditional Chinese characters.",
    "zh": "Reply in Mandarin (普通話) using simplified Chinese characters.",
}

FALLBACK_REPLIES: dict[str, str] = {
    "en": "Great question! These pages on our site should have what you need.",
    "yue": "好問題！以下網站頁面應該可以幫到你。",
    "zh": "好问题！以下网站页面应该可以帮到你。",
}

NAV_INTENT_MARKERS = (
    "take me",
    "go to",
    "bring me",
    "open ",
    "show me",
    "navigate",
    "帶我去",
    "帶我",
    "去",
    "打开",
    "帶我哋",
)


class CaptainChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=2000)


class CaptainChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[CaptainChatMessage] = Field(default_factory=list, max_length=12)
    locale: Literal["en", "yue", "zh"] = "en"


class CaptainSiteLink(BaseModel):
    title: str
    href: str
    description: str


class CaptainToolCall(BaseModel):
    name: str
    arguments: dict[str, str] = Field(default_factory=dict)


class CaptainChatResponse(BaseModel):
    enabled: bool
    reply: str
    links: list[CaptainSiteLink]
    tool_calls: list[CaptainToolCall] = Field(default_factory=list)
    sources: list[str]
    message: str | None = None


def _build_system_prompt(locale: str, chunks: list) -> str:
    context = format_context(chunks)
    page_list = "\n".join(f"- {chunk.title}: {chunk.href}" for chunk in chunks)
    lang = LOCALE_INSTRUCTIONS.get(locale, LOCALE_INSTRUCTIONS["en"])
    return f"""You are Captain21, the cheerful site navigation assistant for Love 21 Foundation in Hong Kong.

Rules:
- Answer in at most 2 short sentences (under 45 words total).
- Be warm, ability-first, and encouraging.
- Briefly point the user to relevant page(s) by name — do NOT paste URLs in reply.
- Do NOT invent programmes or facts not in the context below.
- {lang}

{TOOLS_PROMPT}

Return JSON only:
{{"reply":"your short message","tool_calls":[{{"name":"navigate_to_page","arguments":{{"path":"/our-volunteer"}}}}]}}
tool_calls may be [] when no action is needed.

Site context:
{context}

Suggested pages (also shown as link cards):
{page_list}"""


def _format_user_prompt(payload: CaptainChatRequest) -> str:
    history_lines = [
        f"{message.role}: {message.content}"
        for message in payload.history[-4:]
    ]
    history_block = "\n".join(history_lines) if history_lines else "(no prior messages)"
    return (
        f"Conversation so far:\n{history_block}\n\n"
        f"Current site locale: {payload.locale}\n"
        f"User message: {payload.message}"
    )


def _validate_tool_call(raw: dict[str, Any]) -> CaptainToolCall | None:
    name = raw.get("name")
    if name not in TOOL_NAMES:
        return None
    arguments = raw.get("arguments") or {}
    if not isinstance(arguments, dict):
        return None
    normalized = {str(key): str(value) for key, value in arguments.items()}

    if name == "navigate_to_page":
        path = normalized.get("path", "")
        if path not in ALLOWED_NAV_PATHS:
            return None
        return CaptainToolCall(name=name, arguments={"path": path})

    if name == "set_site_language":
        locale = normalized.get("locale", "")
        if locale not in ALLOWED_LOCALES:
            return None
        return CaptainToolCall(name=name, arguments={"locale": locale})

    return None


def _infer_tool_calls(message: str, chunks: list) -> list[CaptainToolCall]:
    lower = message.lower()

    if re.search(r"\b(cantonese|粵語|廣東話|yue)\b", message, re.IGNORECASE):
        return [CaptainToolCall(name="set_site_language", arguments={"locale": "yue"})]
    if re.search(r"\b(mandarin|普通話|简体中文|zh)\b", message, re.IGNORECASE):
        return [CaptainToolCall(name="set_site_language", arguments={"locale": "zh"})]
    if re.search(r"\b(english|英文)\b", lower):
        return [CaptainToolCall(name="set_site_language", arguments={"locale": "en"})]

    if any(marker in lower or marker in message for marker in NAV_INTENT_MARKERS) and chunks:
        path = chunks[0].href
        if path in ALLOWED_NAV_PATHS:
            return [CaptainToolCall(name="navigate_to_page", arguments={"path": path})]

    return []


def _parse_agent_response(
    parsed: dict[str, Any] | None,
    payload: CaptainChatRequest,
    chunks: list,
) -> tuple[str, list[CaptainToolCall]]:
    reply = ""
    tool_calls: list[CaptainToolCall] = []

    if parsed:
        reply = str(parsed.get("reply") or "").strip()
        raw_calls = parsed.get("tool_calls") or []
        if isinstance(raw_calls, list):
            for raw in raw_calls[:2]:
                if isinstance(raw, dict):
                    validated = _validate_tool_call(raw)
                    if validated:
                        tool_calls.append(validated)

    if not tool_calls:
        tool_calls = _infer_tool_calls(payload.message, chunks)

    if not reply:
        reply = FALLBACK_REPLIES.get(payload.locale, FALLBACK_REPLIES["en"])

    return reply, tool_calls[:1]


@router.post("/chat", response_model=CaptainChatResponse)
def captain_chat(payload: CaptainChatRequest) -> CaptainChatResponse:
    chunks = pick_site_links(payload.message, limit=3)
    links = [
        CaptainSiteLink(title=chunk.title, href=chunk.href, description=chunk.text)
        for chunk in chunks
    ]

    system = _build_system_prompt(payload.locale, chunks)
    user_prompt = _format_user_prompt(payload)

    parsed = chat_json(
        system=system,
        user=user_prompt,
        timeout_seconds=45,
    )
    enabled = parsed is not None
    reply, tool_calls = _parse_agent_response(parsed, payload, chunks)

    if not enabled:
        # Plain-text fallback when JSON agent mode is unavailable
        ollama_messages = [
            {"role": message.role, "content": message.content}
            for message in payload.history[-6:]
        ]
        ollama_messages.append({"role": "user", "content": payload.message})
        text_reply = chat_text(system=system, messages=ollama_messages, num_predict=120)
        if text_reply:
            reply = text_reply
            enabled = True
        if not tool_calls:
            tool_calls = _infer_tool_calls(payload.message, chunks)

    return CaptainChatResponse(
        enabled=enabled,
        reply=reply,
        links=links,
        tool_calls=tool_calls,
        sources=[chunk.title for chunk in chunks],
        message=None if enabled else "Ollama is unavailable — showing site links with a short guide.",
    )
