import os
import ssl
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.routers.ai import fetch_json_from_url


class DummyResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self):
        return b'{"ok": true}'


def test_fetch_json_from_url_uses_certifi_context(monkeypatch):
    captured = {}

    def fake_urlopen(url, timeout=10, context=None):
        captured["url"] = url
        captured["timeout"] = timeout
        captured["context"] = context
        return DummyResponse()

    monkeypatch.setattr("app.routers.ai.urlopen", fake_urlopen)

    payload = fetch_json_from_url("https://example.com")

    assert payload == {"ok": True}
    assert captured["url"] == "https://example.com"
    assert captured["timeout"] == 10
    assert captured["context"] is not None
    assert captured["context"].verify_mode == ssl.CERT_REQUIRED
