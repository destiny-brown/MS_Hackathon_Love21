from __future__ import annotations

from app.data.captain_knowledge import DEFAULT_LINKS, KnowledgeChunk
from app.services.captain_rag import retrieve_knowledge


def pick_site_links(query: str, limit: int = 3) -> list[KnowledgeChunk]:
    """Return unique knowledge chunks (by href) best matching the query."""
    chunks = retrieve_knowledge(query, limit=limit + 4)
    seen: set[str] = set()
    picked: list[KnowledgeChunk] = []
    for chunk in chunks:
        if chunk.href in seen:
            continue
        seen.add(chunk.href)
        picked.append(chunk)
        if len(picked) >= limit:
            break
    if not picked:
        return list(DEFAULT_LINKS[:limit])
    return picked


def build_link_reply(query: str) -> tuple[str, list[KnowledgeChunk]]:
    links = pick_site_links(query, limit=3)
    if len(links) == 1:
        intro = "Here's the best page on our site for that:"
    else:
        intro = "Here are the best pages on our site for that:"
    return intro, links
