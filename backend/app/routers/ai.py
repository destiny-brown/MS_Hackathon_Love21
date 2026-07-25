from pydantic import BaseModel
from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(prefix="/ai", tags=["ai"])


class AskRequest(BaseModel):
    prompt: str


class AskResponse(BaseModel):
    enabled: bool
    answer: str
    retrieved_context: list[str] = []


def retrieve_context_stub(prompt: str) -> list[str]:
    """Stubbed RAG helper: replace with embeddings/vector search during the hackathon."""
    if "item" in prompt.lower():
        return ["Items are user-owned demo records with title, description, and created_at."]
    return []


@router.post("/ask", response_model=AskResponse)
def ask_ai(payload: AskRequest) -> AskResponse:
    settings = get_settings()
    context = retrieve_context_stub(payload.prompt)

    if not settings.anthropic_api_key:
        return AskResponse(
            enabled=False,
            answer="AI is disabled because ANTHROPIC_API_KEY is not set. Add it to backend/.env to enable /ai/ask.",
            retrieved_context=context,
        )

    try:
        from anthropic import Anthropic

        client = Anthropic(api_key=settings.anthropic_api_key)
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=800,
            system="You are the optional AI helper inside hackkit. Be concise and practical.",
            messages=[
                {
                    "role": "user",
                    "content": f"Context:\n{chr(10).join(context) if context else '(none)'}\n\nQuestion:\n{payload.prompt}",
                }
            ],
        )
        answer = next((block.text for block in response.content if block.type == "text"), "")
        return AskResponse(enabled=True, answer=answer, retrieved_context=context)
    except Exception as exc:  # Keep the starter resilient during demos.
        return AskResponse(
            enabled=False,
            answer=f"AI request failed gracefully: {exc}",
            retrieved_context=context,
        )
