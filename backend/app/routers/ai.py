from __future__ import annotations

import json
import re
import ssl
from datetime import UTC, datetime, timedelta
from pathlib import Path
from time import time
from urllib.parse import urlencode
from urllib.request import urlopen

import certifi

from pydantic import BaseModel
from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(prefix="/ai", tags=["ai"])

YOUTUBE_CACHE_TTL_SECONDS = 60 * 60
_YOUTUBE_CACHE: dict[tuple[str, int, int], tuple[float, YouTubeSearchResponse]] = {}


def _cache_key(q: str, max_results: int, max_duration_minutes: int) -> tuple[str, int, int]:
    return (normalize_text(q), max_results, max_duration_minutes)


def _get_cached_youtube_response(q: str, max_results: int, max_duration_minutes: int) -> YouTubeSearchResponse | None:
    key = _cache_key(q, max_results, max_duration_minutes)
    cached_entry = _YOUTUBE_CACHE.get(key)
    if not cached_entry:
        return None

    cached_at, cached_response = cached_entry
    if time() - cached_at < YOUTUBE_CACHE_TTL_SECONDS:
        return cached_response

    _YOUTUBE_CACHE.pop(key, None)
    return None


def _should_cache_youtube_response(response: YouTubeSearchResponse) -> bool:
    if response.error and "429" in response.error:
        return False
    return True


def _store_youtube_response(q: str, max_results: int, max_duration_minutes: int, response: YouTubeSearchResponse) -> None:
    if not _should_cache_youtube_response(response):
        return
    key = _cache_key(q, max_results, max_duration_minutes)
    _YOUTUBE_CACHE[key] = (time(), response)

# Trusted channels chosen for child/family-safe neurodiversity education content.
TRUSTED_CHANNEL_TITLES = {
    "ambitious about autism",
    "national autistic society",
    "national health service",
    "nhs",
    "world health organization (who)",
    "world health organization",
    "cdc",
    "centers for disease control and prevention",
    "down syndrome international",
    "national down syndrome society",
    "global down syndrome foundation",
    "child mind institute",
    "understood",
}

ALLOW_TERMS = {
    "autism",
    "autistic",
    "asd",
    "down syndrome",
    "neurodivergent",
    "neurodivergence",
    "neurodiversity",
    "inclusive",
    "inclusion",
    "special education",
    "developmental disability",
    "learning support",
}

BLOCK_TERMS = {
    "porn",
    "sex",
    "xxx",
    "nude",
    "violence",
    "gore",
    "hate",
    "self-harm",
    "suicide",
    "conspiracy",
    "hoax",
    "miracle cure",
    "clickbait",
}

# Education + nonprofit + news/public service categories used as a safety relevance gate.
ALLOWED_CATEGORY_IDS = {"27", "29", "25"}


class AskRequest(BaseModel):
    prompt: str


class AskResponse(BaseModel):
    enabled: bool
    answer: str
    retrieved_context: list[str] = []


class YouTubeVideo(BaseModel):
    video_id: str
    title: str
    channel_title: str
    published_at: str
    description: str = ""
    thumbnail_url: str | None = None


class YouTubeSearchResponse(BaseModel):
    enabled: bool
    items: list[YouTubeVideo]
    error: str | None = None


def build_ssl_context() -> ssl.SSLContext:
    context = ssl.create_default_context(cafile=certifi.where())
    context.check_hostname = True
    context.verify_mode = ssl.CERT_REQUIRED
    return context


def fetch_json_from_url(url: str, timeout: int = 10) -> dict:
    with urlopen(url, timeout=timeout, context=build_ssl_context()) as response:
        return json.loads(response.read().decode("utf-8"))


def parse_iso8601_duration_to_seconds(duration: str) -> int:
    """Parse YouTube ISO 8601 duration (e.g. PT4M59S) into seconds."""
    match = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
    if not match:
        return 0

    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def relevance_score(text: str, query_tokens: list[str]) -> int:
    score = 0
    for token in query_tokens:
        if token and token in text:
            score += 1

    for term in ALLOW_TERMS:
        if term in text:
            score += 2

    return score


def is_trusted_channel(channel_title: str) -> bool:
    normalized = normalize_text(channel_title)
    if normalized in TRUSTED_CHANNEL_TITLES:
        return True

    # Allow light fuzzy matches for official variants such as "NHS England".
    return any(trusted in normalized for trusted in TRUSTED_CHANNEL_TITLES)


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


@router.get("/youtube/search", response_model=YouTubeSearchResponse)
def youtube_search(
    q: str,
    max_results: int = 20,
    max_duration_minutes: int = 5,
    min_relevance_score: int = 3,
    published_within_days: int = 3650,
) -> YouTubeSearchResponse:
    settings = get_settings()
    if not settings.youtube_api_key:
        return YouTubeSearchResponse(
            enabled=False,
            items=[],
            error="YouTube is disabled because YOUTUBE_API_KEY is not set in backend/.env or backend/.env.local.",
        )

    safe_max_results = min(max(max_results, 1), 25)
    cache_key = _cache_key(q, safe_max_results, max_duration_minutes)
    cached_response = _get_cached_youtube_response(q, safe_max_results, max_duration_minutes)
    if cached_response is not None:
        return cached_response

    # Fetch a broader candidate set so strict safety filtering still yields enough videos.
    upstream_max_results = min(max(safe_max_results * 3, 25), 50)
    params = urlencode(
        {
            "part": "snippet",
            "type": "video",
            "q": q,
            "maxResults": upstream_max_results,
            # This pre-filters to YouTube "short" videos (< 4 min). We still enforce
            # exact max_duration_minutes with a second API call below.
            "videoDuration": "short",
            "safeSearch": "strict",
            "relevanceLanguage": "en",
            "regionCode": "HK",
            "key": settings.youtube_api_key,
        }
    )
    url = f"https://www.googleapis.com/youtube/v3/search?{params}"

    try:
        payload = fetch_json_from_url(url, timeout=10)
    except Exception as exc:
        response = YouTubeSearchResponse(enabled=False, items=[], error=f"YouTube request failed: {exc}")
        _store_youtube_response(q, safe_max_results, max_duration_minutes, response)
        return response

    raw_items = payload.get("items", [])
    video_ids = [item.get("id", {}).get("videoId") for item in raw_items if item.get("id", {}).get("videoId")]
    durations_by_id: dict[str, int] = {}
    categories_by_id: dict[str, str] = {}

    if video_ids:
        details_params = urlencode(
            {
                "part": "contentDetails,snippet",
                "id": ",".join(video_ids),
                "key": settings.youtube_api_key,
            }
        )
        details_url = f"https://www.googleapis.com/youtube/v3/videos?{details_params}"
        try:
            details_payload = fetch_json_from_url(details_url, timeout=10)
            for detail in details_payload.get("items", []):
                detail_id = detail.get("id")
                if not detail_id:
                    continue
                duration_text = detail.get("contentDetails", {}).get("duration", "")
                durations_by_id[detail_id] = parse_iso8601_duration_to_seconds(duration_text)
                categories_by_id[detail_id] = detail.get("snippet", {}).get("categoryId", "")
        except Exception:
            # If details lookup fails, keep search results instead of failing hard.
            durations_by_id = {}
            categories_by_id = {}

    videos: list[YouTubeVideo] = []
    max_duration_seconds = max(max_duration_minutes, 1) * 60
    min_published_at = datetime.now(UTC) - timedelta(days=max(published_within_days, 1))
    query_tokens = [token for token in normalize_text(q).split(" ") if token]

    for item in raw_items:
        snippet = item.get("snippet", {})
        video_id = item.get("id", {}).get("videoId")
        if not video_id:
            continue

        if durations_by_id and durations_by_id.get(video_id, 0) > max_duration_seconds:
            continue

        channel_title = snippet.get("channelTitle", "Unknown channel")

        title = snippet.get("title", "Untitled")
        description = snippet.get("description", "")
        searchable_text = normalize_text(f"{title} {description}")

        if not any(term in searchable_text for term in ALLOW_TERMS):
            continue

        if any(term in searchable_text for term in BLOCK_TERMS):
            continue

        score = relevance_score(searchable_text, query_tokens)
        if score < max(min_relevance_score, 1):
            continue

        published_at = snippet.get("publishedAt", "")
        if published_at:
            try:
                published_dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
                if published_dt < min_published_at:
                    continue
            except ValueError:
                pass

        thumbnails = snippet.get("thumbnails", {})
        thumbnail_url = (
            thumbnails.get("high", {}).get("url")
            or thumbnails.get("medium", {}).get("url")
            or thumbnails.get("default", {}).get("url")
        )

        videos.append(
            YouTubeVideo(
                video_id=video_id,
                title=title,
                channel_title=channel_title,
                published_at=published_at,
                description=description,
                thumbnail_url=thumbnail_url,
            )
        )

    def passes_common_safety(video: YouTubeVideo) -> bool:
        text = normalize_text(f"{video.title} {video.description}")
        if any(term in text for term in BLOCK_TERMS):
            return False
        if not any(term in text for term in ALLOW_TERMS):
            return False

        score = relevance_score(text, query_tokens)
        if score < max(min_relevance_score, 1):
            return False

        if video.published_at:
            try:
                published_dt = datetime.fromisoformat(video.published_at.replace("Z", "+00:00"))
                if published_dt < min_published_at:
                    return False
            except ValueError:
                pass

        return True

    def category_ok(video: YouTubeVideo) -> bool:
        category_id = categories_by_id.get(video.video_id)
        if not category_id:
            return False
        return category_id in ALLOWED_CATEGORY_IDS

    tier1 = [
        video
        for video in videos
        if passes_common_safety(video) and is_trusted_channel(video.channel_title) and category_ok(video)
    ]

    if len(tier1) >= safe_max_results:
        response = YouTubeSearchResponse(enabled=True, items=tier1[:safe_max_results])
        _store_youtube_response(q, safe_max_results, max_duration_minutes, response)
        return response

    tier2_extra = [
        video
        for video in videos
        if passes_common_safety(video)
        and is_trusted_channel(video.channel_title)
        and not category_ok(video)
        and video.video_id not in {v.video_id for v in tier1}
    ]

    combined = tier1 + tier2_extra
    if len(combined) >= safe_max_results:
        response = YouTubeSearchResponse(enabled=True, items=combined[:safe_max_results])
        _store_youtube_response(q, safe_max_results, max_duration_minutes, response)
        return response

    tier3_extra = [
        video
        for video in videos
        if passes_common_safety(video)
        and not is_trusted_channel(video.channel_title)
        and category_ok(video)
        and video.video_id not in {v.video_id for v in combined}
    ]

    combined += tier3_extra
    if combined:
        response = YouTubeSearchResponse(enabled=True, items=combined[:safe_max_results])
        _store_youtube_response(q, safe_max_results, max_duration_minutes, response)
        return response

    if not videos:
        response = YouTubeSearchResponse(
            enabled=True,
            items=[],
            error="No suitable videos found right now. Try a different search phrase.",
        )
        _store_youtube_response(q, safe_max_results, max_duration_minutes, response)
        return response

    response = YouTubeSearchResponse(
        enabled=True,
        items=[],
        error="No suitable videos passed safety checks. Try a broader search phrase.",
    )
    _store_youtube_response(q, safe_max_results, max_duration_minutes, response)
    return response
