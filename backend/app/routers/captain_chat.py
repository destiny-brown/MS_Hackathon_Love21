from __future__ import annotations

from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.captain_link_router import pick_site_links
from app.services.captain_rag import format_context
from app.services.ollama_client import chat_text

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


class CaptainChatResponse(BaseModel):
    enabled: bool
    reply: str
    links: list[CaptainSiteLink]
    sources: list[str]
    message: str | None = None


def _build_system_prompt(locale: str, chunks: list) -> str:
    context = format_context(chunks)
    page_list = "\n".join(f"- {chunk.title}: {chunk.href}" for chunk in chunks)
    lang = LOCALE_INSTRUCTIONS.get(locale, LOCALE_INSTRUCTIONS["en"])
    return f"""You are Captain 21, the cheerful inclusion coach mascot for Love 21 Foundation in Hong Kong.

Rules:
- Answer in at most 2 short sentences (under 45 words total).
- Be warm, ability-first, and encouraging.
- Briefly point the user to the relevant page(s) on love21.org by name — do NOT paste URLs.
- Do NOT invent programmes or facts not in the context below.
- {lang}

Site context:
{context}

Pages the user will see as links (mention by title only):
{page_list}"""


@router.post("/chat", response_model=CaptainChatResponse)
def captain_chat(payload: CaptainChatRequest) -> CaptainChatResponse:
    chunks = pick_site_links(payload.message, limit=3)
    links = [
        CaptainSiteLink(title=chunk.title, href=chunk.href, description=chunk.text)
        for chunk in chunks
    ]

    system = _build_system_prompt(payload.locale, chunks)
    ollama_messages = [
        {"role": message.role, "content": message.content}
        for message in payload.history[-6:]
    ]
    ollama_messages.append({"role": "user", "content": payload.message})

    reply = chat_text(system=system, messages=ollama_messages, num_predict=120)
    enabled = reply is not None
    if not reply:
        reply = FALLBACK_REPLIES.get(payload.locale, FALLBACK_REPLIES["en"])

    return CaptainChatResponse(
        enabled=enabled,
        reply=reply,
        links=links,
        sources=[chunk.title for chunk in chunks],
        message=None if enabled else "Ollama is unavailable — showing site links with a short guide.",
    )
