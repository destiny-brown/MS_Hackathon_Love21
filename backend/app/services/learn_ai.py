from __future__ import annotations

from app.services.model_client import chat_json

GENERATE_SYSTEM = """You draft inclusive education questions for Love 21 Foundation in Hong Kong.
Love 21 supports people with Down syndrome, autism, and other neurodiverse conditions through sport, nutrition, and community.

Rules:
- Be accurate, respectful, and non-stigmatising.
- Avoid stereotypes and medical misinformation.
- For kind "quiz" or "daily", answer must be exactly "myth" or "fact".
- Each statement should be a single clear claim someone could agree or disagree with.
- Explanations should be 1-3 sentences, plain language, suitable for families and teachers.
- Return ONLY valid JSON matching the requested schema. No markdown."""


def generate_learn_questions(*, topic: str, count: int, kind: str, guidance: str | None) -> tuple[list[dict] | None, str | None]:
    user = f"""Create {count} draft {kind} question(s) about: {topic}.
{f"Extra guidance: {guidance}" if guidance else ""}

Return JSON:
{{
  "questions": [
    {{
      "statement": "string",
      "answer": "myth" or "fact",
      "explanation": "string",
      "hint": "string",
      "topic": "string"
    }}
  ]
}}"""

    parsed = chat_json(system=GENERATE_SYSTEM, user=user, num_predict=900)
    if parsed is None:
        return None, "AI generation is unavailable. Set MODEL_ENABLED, MODEL_BASE_URL, and MODEL_API_KEY in the backend."

    questions = parsed.get("questions")
    if not isinstance(questions, list) or not questions:
        return None, "The model returned an empty or invalid question list."

    cleaned: list[dict] = []
    for item in questions[:count]:
        if not isinstance(item, dict):
            continue
        statement = str(item.get("statement", "")).strip()
        answer = str(item.get("answer", "")).strip().lower()
        explanation = str(item.get("explanation", "")).strip()
        if not statement or answer not in {"myth", "fact"} or not explanation:
            continue
        cleaned.append(
            {
                "statement": statement,
                "answer": answer,
                "explanation": explanation,
                "hint": str(item.get("hint", "")).strip() or None,
                "topic": str(item.get("topic", topic)).strip() or topic,
            }
        )

    if not cleaned:
        return None, "The model response did not include any usable questions."

    return cleaned, None
