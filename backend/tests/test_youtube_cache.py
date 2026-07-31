import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import app.routers.ai as ai


def test_youtube_search_uses_cache(monkeypatch):
    ai._YOUTUBE_CACHE.clear()

    settings = SimpleNamespace(youtube_api_key="fake-key")
    monkeypatch.setattr(ai, "get_settings", lambda: settings)

    calls = []

    def fake_fetch_json_from_url(url, timeout=10):
        calls.append((url, timeout))
        return {"items": []}

    monkeypatch.setattr(ai, "fetch_json_from_url", fake_fetch_json_from_url)

    first = ai.youtube_search("autism", max_results=2, max_duration_minutes=5)
    second = ai.youtube_search("autism", max_results=2, max_duration_minutes=5)

    assert first.enabled is True
    assert second.enabled is True
    assert len(calls) == 1
