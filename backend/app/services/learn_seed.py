"""Seed Love 21 Learn content when the database tables are empty."""

from sqlalchemy import func, select

from app.db import SessionLocal
from app.models.learn_content import (
    LearnContentStatus,
    LearnQuestion,
    LearnQuestionKind,
    LearnResource,
    LearnVideo,
)

QUIZ_SEED = [
    {
        "external_id": "q1",
        "statement": "Autistic people lack empathy.",
        "answer": "myth",
        "explanation": "Many autistic people feel empathy deeply — they may just express or process it differently. Difficulty reading social cues is not the same as not caring.",
        "topic": "Autism",
        "related_story_slugs": ["autistic-police-officer-interview"],
    },
    {
        "external_id": "q2",
        "statement": "Down syndrome is caused by an extra copy of chromosome 21.",
        "answer": "fact",
        "explanation": "Trisomy 21 means each cell has three copies of chromosome 21 instead of two. This affects development, but abilities vary widely from person to person.",
        "topic": "Down Syndrome",
        "related_story_slugs": ["purposeful-employment"],
    },
    {
        "external_id": "q3",
        "statement": "ADHD is just a childhood behaviour problem that people grow out of.",
        "answer": "myth",
        "explanation": "ADHD is a lifelong neurodevelopmental condition. Many adults live with ADHD; symptoms may change over time but do not simply disappear.",
        "topic": "ADHD",
        "related_story_slugs": ["hbr-neurodiversity-competitive-advantage"],
    },
    {
        "external_id": "q4",
        "statement": "Using person-first language (e.g. 'person with autism') is always preferred.",
        "answer": "myth",
        "explanation": "Language preferences vary. Some people prefer identity-first language ('autistic person'). The best approach is to ask individuals what they prefer.",
        "topic": "Inclusive Language",
        "related_story_slugs": ["ability-mag-neurodiversity-real-world"],
    },
    {
        "external_id": "q5",
        "statement": "Neurodivergent students benefit from predictable routines and clear instructions.",
        "answer": "fact",
        "explanation": "Structure, visual supports, and explicit expectations reduce cognitive load and anxiety, helping many neurodivergent learners participate more confidently.",
        "topic": "Education",
        "related_story_slugs": ["edsurge-peer-mentors"],
    },
]

DAILY_SEED = [
    {
        "external_id": "d1",
        "statement": "Vaccines cause autism.",
        "answer": "myth",
        "explanation": "Decades of research show no link between vaccines and autism. The original study suggesting a connection was retracted and discredited.",
        "hint": "Major health organisations have studied this extensively since the late 1990s.",
        "source": "CDC, WHO",
        "topic": "Autism",
    },
    {
        "external_id": "d2",
        "statement": "Autistic people can have deep, meaningful friendships.",
        "answer": "fact",
        "explanation": "Autistic people often form strong bonds. They may prefer smaller groups or communicate differently, but desire for friendship is universal.",
        "hint": "Social style differs — but connection and loyalty are not absent.",
        "topic": "Family",
    },
]

RESOURCE_SEED = [
    {
        "slug": "beyond-limits-banquet",
        "title": "Tables & Seats Now Open for Beyond Limits Banquet",
        "date_label": "May 11, 2026",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2026/05/bey0nd-limit_sz-1-1024x604.png",
        "source_url": "https://love21foundation.com/beyond-limits-banquet/",
        "source_label": "Love 21 Foundation",
        "topics": ["community", "inclusion"],
        "learning_hook": "See how Love 21 celebrates the neurodiverse community at live events.",
        "audience": "all",
        "resource_type": "event",
        "origin": "love21",
    },
    {
        "slug": "purposeful-employment",
        "title": "Purposeful Employment for People with Down Syndrome",
        "date_label": "June 6, 2022",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.42.30-1024x638.png",
        "source_url": "https://www.scmp.com/lifestyle/health-wellness/article/3180605/down-syndrome-hong-kong-jobs",
        "source_label": "South China Morning Post",
        "topics": ["employment", "down-syndrome", "inclusion"],
        "learning_hook": "A real story of meaningful work and employer inclusion.",
        "audience": "all",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "hbr-neurodiversity-competitive-advantage",
        "title": "Neurodiversity as a Competitive Advantage",
        "date_label": "May 2017",
        "cover_image_url": "https://hbr.org/resources/images/article_assets/2017/04/Jun21_01_183494879.jpg",
        "source_url": "https://hbr.org/2017/05/neurodiversity-as-a-competitive-advantage",
        "source_label": "Harvard Business Review",
        "topics": ["employment", "autism", "inclusion"],
        "learning_hook": "Why inclusive workplaces benefit everyone, not just neurodivergent employees.",
        "audience": "teachers",
        "resource_type": "journal",
        "origin": "external",
    },
]

VIDEO_SEED = [
    {
        "video_id": "RbwRrVw-CRo",
        "title": "Amazing Things Happen — Understanding Autism",
        "channel_title": "National Autistic Society",
        "published_at": "2017-07-18T00:00:00Z",
        "thumbnail_url": "https://img.youtube.com/vi/RbwRrVw-CRo/hqdefault.jpg",
    },
    {
        "video_id": "Lk4qs8jGN4U",
        "title": "What is Autism?",
        "channel_title": "National Autistic Society",
        "published_at": "2019-04-01T00:00:00Z",
        "thumbnail_url": "https://img.youtube.com/vi/Lk4qs8jGN4U/hqdefault.jpg",
    },
    {
        "video_id": "KW_F7xG5J5c",
        "title": "Assume That I Can — World Down Syndrome Day",
        "channel_title": "NDSS",
        "published_at": "2024-03-21T00:00:00Z",
        "thumbnail_url": "https://img.youtube.com/vi/KW_F7xG5J5c/hqdefault.jpg",
    },
]


def ensure_learn_content() -> None:
    with SessionLocal() as db:
        question_count = db.scalar(select(func.count()).select_from(LearnQuestion)) or 0
        if question_count == 0:
            order = 0
            for item in QUIZ_SEED:
                order += 1
                db.add(
                    LearnQuestion(
                        external_id=item["external_id"],
                        kind=LearnQuestionKind.QUIZ,
                        status=LearnContentStatus.PUBLISHED,
                        statement=item["statement"],
                        answer=item["answer"],
                        explanation=item["explanation"],
                        topic=item.get("topic"),
                        related_story_slugs=item.get("related_story_slugs", []),
                        display_order=order,
                    )
                )
            for item in DAILY_SEED:
                order += 1
                db.add(
                    LearnQuestion(
                        external_id=item["external_id"],
                        kind=LearnQuestionKind.DAILY,
                        status=LearnContentStatus.PUBLISHED,
                        statement=item["statement"],
                        answer=item["answer"],
                        explanation=item["explanation"],
                        hint=item.get("hint"),
                        source=item.get("source"),
                        topic=item.get("topic"),
                        display_order=order,
                    )
                )

        resource_count = db.scalar(select(func.count()).select_from(LearnResource)) or 0
        if resource_count == 0:
            for index, item in enumerate(RESOURCE_SEED, start=1):
                db.add(
                    LearnResource(
                        slug=item["slug"],
                        title=item["title"],
                        date_label=item["date_label"],
                        cover_image_url=item["cover_image_url"],
                        source_url=item["source_url"],
                        source_label=item["source_label"],
                        topics=item["topics"],
                        learning_hook=item["learning_hook"],
                        audience=item["audience"],
                        resource_type=item["resource_type"],
                        origin=item["origin"],
                        show_on_learn=True,
                        show_on_stories=True,
                        status=LearnContentStatus.PUBLISHED,
                        display_order=index,
                    )
                )

        video_count = db.scalar(select(func.count()).select_from(LearnVideo)) or 0
        if video_count == 0:
            for index, item in enumerate(VIDEO_SEED, start=1):
                db.add(
                    LearnVideo(
                        video_id=item["video_id"],
                        title=item["title"],
                        channel_title=item["channel_title"],
                        published_at=item["published_at"],
                        thumbnail_url=item.get("thumbnail_url"),
                        status=LearnContentStatus.PUBLISHED,
                        display_order=index,
                    )
                )

        db.commit()
