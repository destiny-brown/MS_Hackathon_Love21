from __future__ import annotations

import json
from urllib.error import URLError
from urllib.request import Request, urlopen

from app.core.config import get_settings


def chat_json(system: str, user: str, timeout_seconds: int | None = None) -> dict | None:
    """Call a local Ollama model and parse a JSON object from the response."""
    settings = get_settings()
    if not settings.ollama_enabled:
        return None

    timeout = timeout_seconds if timeout_seconds is not None else settings.ollama_timeout_seconds

    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "format": "json",
        "keep_alive": "10m",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "options": {
            "num_predict": 120,
            "temperature": 0.2,
        },
    }

    request = Request(
        f"{settings.ollama_base_url.rstrip('/')}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(request, timeout=timeout) as response:
            body = json.loads(response.read().decode("utf-8"))
    except (URLError, TimeoutError, json.JSONDecodeError, KeyError):
        return None

    content = body.get("message", {}).get("content")
    if not content:
        return None

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return None
