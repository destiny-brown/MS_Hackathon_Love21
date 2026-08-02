from __future__ import annotations

import json
import logging
import time
from urllib.error import HTTPError
from urllib.error import URLError
from urllib.request import Request, urlopen

from app.core.config import get_settings


logger = logging.getLogger(__name__)


def _log_model_event(event: str, **details: object) -> None:
    logger.warning("model_client_event %s", json.dumps({"event": event, **details}, default=str))


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
        _log_model_event(
            "model_disabled_or_unconfigured",
            model_enabled=settings.model_enabled,
            has_base_url=bool(settings.model_base_url),
            has_api_key=bool(settings.model_api_key),
        )
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
    endpoint = f"{settings.model_base_url.rstrip('/')}/chat/completions"

    # Modal + vLLM can return brief 503/502/504 windows while the GPU server cold-starts.
    # Retry a few times so first user request doesn't immediately fall back to non-AI mode.
    for attempt in range(4):
        try:
            with urlopen(request, timeout=timeout) as response:
                body = json.loads(response.read().decode("utf-8"))
            content = body["choices"][0]["message"]["content"]
            break
        except HTTPError as exc:
            _log_model_event(
                "http_error",
                endpoint=endpoint,
                model=settings.model_name,
                attempt=attempt + 1,
                status_code=exc.code,
                reason=str(exc.reason),
                retriable=exc.code in {502, 503, 504} and attempt < 3,
            )
            if exc.code in {502, 503, 504} and attempt < 3:
                time.sleep(3 * (attempt + 1))
                continue
            return None
        except URLError as exc:
            _log_model_event(
                "url_error",
                endpoint=endpoint,
                model=settings.model_name,
                attempt=attempt + 1,
                reason=str(exc.reason),
                retriable=attempt < 3,
            )
            if attempt < 3:
                time.sleep(3 * (attempt + 1))
                continue
            return None
        except TimeoutError as exc:
            _log_model_event(
                "timeout_error",
                endpoint=endpoint,
                model=settings.model_name,
                attempt=attempt + 1,
                timeout_seconds=timeout,
                reason=str(exc),
            )
            return None
        except json.JSONDecodeError as exc:
            _log_model_event(
                "invalid_json_response",
                endpoint=endpoint,
                model=settings.model_name,
                attempt=attempt + 1,
                reason=str(exc),
            )
            return None
        except (KeyError, IndexError, TypeError) as exc:
            _log_model_event(
                "unexpected_response_shape",
                endpoint=endpoint,
                model=settings.model_name,
                attempt=attempt + 1,
                error_type=type(exc).__name__,
                reason=str(exc),
            )
            return None
    else:
        _log_model_event(
            "retry_exhausted",
            endpoint=endpoint,
            model=settings.model_name,
            max_attempts=4,
        )
        return None

    if not isinstance(content, str) or not content.strip():
        _log_model_event(
            "empty_model_content",
            endpoint=endpoint,
            model=settings.model_name,
        )
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
    except json.JSONDecodeError as exc:
        _log_model_event(
            "chat_json_parse_error",
            model=get_settings().model_name,
            reason=str(exc),
            content_preview=content[:200],
        )
        return None
    if not isinstance(parsed, dict):
        _log_model_event(
            "chat_json_non_object",
            model=get_settings().model_name,
            parsed_type=type(parsed).__name__,
        )
        return None
    return parsed


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