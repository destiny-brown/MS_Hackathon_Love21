"""Captain21 agent tools (client-executed; validated server-side)."""

from __future__ import annotations

from app.data.captain_knowledge import CAPTAIN_KNOWLEDGE

ALLOWED_NAV_PATHS: frozenset[str] = frozenset(chunk.href for chunk in CAPTAIN_KNOWLEDGE)
ALLOWED_LOCALES: frozenset[str] = frozenset({"en", "yue", "zh"})

TOOL_NAMES: frozenset[str] = frozenset({"navigate_to_page", "set_site_language"})

TOOLS_PROMPT = """
You can invoke at most ONE site tool per turn when the user clearly wants an action:

1. navigate_to_page — open a Love 21 page for the user.
   arguments: {"path": "<allowed path>"}

2. set_site_language — switch the site UI language.
   arguments: {"locale": "en" | "yue" | "zh"}

Use navigate_to_page when the user wants to go somewhere (volunteer, donate, programmes, contact, etc.).
Use set_site_language only when they ask to change language (English, Cantonese, Mandarin).
If they only need information, return tool_calls as [] and answer in reply.

Allowed paths:
""" + "\n".join(f"- {path}" for path in sorted(ALLOWED_NAV_PATHS))
