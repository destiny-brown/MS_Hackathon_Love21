from __future__ import annotations

import json
import time
from urllib.error import HTTPError
from urllib.error import URLError
from urllib.request import Request, urlopen

from app.core.config import get_settings


def _chat_completion(
    system: str,
    messages: list[dict[str, str]],
    timeout_seconds: int | None,
    max_tokens: int,
    temperature: float,
    json_mode: bool,
) -> str | None:
    settings = get_settings()
    if not (
        settings.model_enabled
        and settings.model_base_url
        and settings.model_api_key
    ):
        return None

    payload: dict[str, object] = {
        "model": settings.model_name,
        "stream": False,
        "messages": [{"role": "system", "content": system}, *messages],
        "max_tokens": max_tokens,
        "temperature": temperature,
        "chat_template_kwargs": {"enable_thinking": False},
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    request = Request(
        f"{settings.model_base_url.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.model_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    timeout = timeout_seconds if timeout_seconds is not None else settings.model_timeout_seconds

    # Modal + vLLM can return brief 503/502/504 windows while the GPU server cold-starts.
    # Retry a few times so first user request doesn't immediately fall back to non-AI mode.
    for attempt in range(4):
        try:
            with urlopen(request, timeout=timeout) as response:
                body = json.loads(response.read().decode("utf-8"))
            content = body["choices"][0]["message"]["content"]
            break
        except HTTPError as exc:
            if exc.code in {502, 503, 504} and attempt < 3:
                time.sleep(3 * (attempt + 1))
                continue
            return None
        except URLError:
            if attempt < 3:
                time.sleep(3 * (attempt + 1))
                continue
            return None
        except (TimeoutError, json.JSONDecodeError, KeyError, IndexError, TypeError):
            return None
    else:
        return None

    if not isinstance(content, str) or not content.strip():
        return None
    return content.strip()


def chat_json(
    system: str,
    user: str,
    timeout_seconds: int | None = None,
    num_predict: int = 180,
) -> dict | None:
    """Call the hosted model and parse its JSON response."""
    content = _chat_completion(
        system=system,
        messages=[{"role": "user", "content": user}],
        timeout_seconds=timeout_seconds,
        max_tokens=num_predict,
        temperature=0.2,
        json_mode=True,
    )
    if content is None:
        return None

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        return None
    return parsed if isinstance(parsed, dict) else None


def chat_text(
    system: str,
    messages: list[dict[str, str]],
    timeout_seconds: int | None = None,
    num_predict: int = 400,
) -> str | None:
    """Call the hosted model for a plain-text assistant reply."""
    return _chat_completion(
        system=system,
        messages=messages,
        timeout_seconds=timeout_seconds,
        max_tokens=num_predict,
        temperature=0.35,
        json_mode=False,
    )