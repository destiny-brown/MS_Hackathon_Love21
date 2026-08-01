import json

from app.core.config import Settings
from app.services import model_client


class FakeResponse:
    def __init__(self, body: dict) -> None:
        self.body = body

    def __enter__(self) -> "FakeResponse":
        return self

    def __exit__(self, *_args: object) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps(self.body).encode("utf-8")


def test_chat_json_uses_openai_compatible_modal_endpoint(monkeypatch) -> None:
    settings = Settings(
        _env_file=None,
        model_enabled=True,
        model_base_url="https://example.modal.run/v1",
        model_api_key="test-secret",
        model_name="qwen3-8b",
    )
    monkeypatch.setattr(model_client, "get_settings", lambda: settings)
    captured: dict[str, object] = {}

    def fake_urlopen(request, timeout):
        captured["url"] = request.full_url
        captured["authorization"] = request.get_header("Authorization")
        captured["payload"] = json.loads(request.data)
        captured["timeout"] = timeout
        return FakeResponse(
            {
                "choices": [
                    {"message": {"content": '{"reply":"Hello","tool_calls":[]}'}}
                ]
            }
        )

    monkeypatch.setattr(model_client, "urlopen", fake_urlopen)

    result = model_client.chat_json("system prompt", "user prompt")

    assert result == {"reply": "Hello", "tool_calls": []}
    assert captured["url"] == "https://example.modal.run/v1/chat/completions"
    assert captured["authorization"] == "Bearer test-secret"
    assert captured["timeout"] == 45
    payload = captured["payload"]
    assert isinstance(payload, dict)
    assert payload["model"] == "qwen3-8b"
    assert payload["response_format"] == {"type": "json_object"}
    assert payload["chat_template_kwargs"] == {"enable_thinking": False}


def test_chat_returns_none_when_hosted_model_is_not_configured(monkeypatch) -> None:
    settings = Settings(_env_file=None)
    monkeypatch.setattr(model_client, "get_settings", lambda: settings)

    def unexpected_urlopen(*_args, **_kwargs):
        raise AssertionError("disabled model must not make an HTTP request")

    monkeypatch.setattr(model_client, "urlopen", unexpected_urlopen)

    assert model_client.chat_text("system", [{"role": "user", "content": "hello"}]) is None