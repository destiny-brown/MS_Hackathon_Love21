from __future__ import annotations

import re

from app.data.captain_knowledge import CAPTAIN_KNOWLEDGE, KnowledgeChunk

_TOKEN_RE = re.compile(r"[a-z0-9]+")


def _tokenize(text: str) -> set[str]:
    return set(_TOKEN_RE.findall(text.lower()))


def _score_chunk(query_tokens: set[str], chunk: KnowledgeChunk) -> int:
    haystack = f"{chunk.title} {chunk.text} {' '.join(chunk.topics)}"
    chunk_tokens = _tokenize(haystack)
    overlap = len(query_tokens & chunk_tokens)
    # Boost title/topic hits
    title_tokens = _tokenize(chunk.title)
    topic_tokens = _tokenize(" ".join(chunk.topics))
    overlap += len(query_tokens & title_tokens) * 2
    overlap += len(query_tokens & topic_tokens)
    return overlap


def retrieve_knowledge(query: str, limit: int = 4) -> list[KnowledgeChunk]:
    query_tokens = _tokenize(query)
    if not query_tokens:
        return list(CAPTAIN_KNOWLEDGE[:limit])

    scored = sorted(
        (( _score_chunk(query_tokens, chunk), chunk) for chunk in CAPTAIN_KNOWLEDGE),
        key=lambda item: item[0],
        reverse=True,
    )
    top = [chunk for score, chunk in scored if score > 0][:limit]
    if top:
        return top
    return list(CAPTAIN_KNOWLEDGE[:limit])


def format_context(chunks: list[KnowledgeChunk]) -> str:
    if not chunks:
        return "(No specific context retrieved.)"
    parts = []
    for chunk in chunks:
        parts.append(f"[{chunk.title}]\n{chunk.text}")
    return "\n\n".join(parts)
