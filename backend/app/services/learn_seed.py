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
        "show_on_learn": False,
    },
    {
        "slug": "charity-raffle-2025",
        "title": "Love 21 Foundation Charity Raffle 2025",
        "date_label": "November 27, 2025",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2025/11/rafflebanner.png",
        "source_url": "https://love21foundation.com/raffle2025-2/",
        "source_label": "Love 21 Foundation",
        "topics": ["community"],
        "learning_hook": "Community support helps fund nearly 1,000 free sessions monthly for families.",
        "audience": "all",
        "resource_type": "event",
        "origin": "love21",
        "show_on_learn": False,
    },
    {
        "slug": "protecting-special-needs-children-covid",
        "title": "【繞場一週】守護特殊兒童對抗疫境",
        "date_label": "May 25, 2022",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-12.15.00.png",
        "source_url": "https://love21foundation.com/%e3%80%90%e7%b9%9e%e5%a0%b4%e4%b8%80%e9%80%b1%e3%80%91%e5%ae%88%e8%ad%b7%e7%89%b9%e6%ae%8a%e5%85%92%e7%ab%a5%e5%b0%8d%e6%8a%97%e7%96%ab%e5%a2%83/",
        "source_label": "Love 21 Foundation",
        "topics": ["family", "community"],
        "learning_hook": "Families navigating challenges together — a shared experience many parents relate to.",
        "audience": "parents",
        "resource_type": "press",
        "origin": "love21",
    },
    {
        "slug": "rthk-health-interview",
        "title": "精靈一點 健康人物專訪- 愛·很簡單",
        "date_label": "December 16, 2021",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-12.05.49-1024x575.png",
        "source_url": "https://www.rthk.hk/tv/dtt31/programme/healthpedia_tv/episode/783569",
        "source_label": "RTHK 精靈一點",
        "topics": ["family", "inclusion"],
        "learning_hook": "Love is simple — hear from Love 21 families in this health interview.",
        "audience": "parents",
        "resource_type": "interview",
        "origin": "love21",
    },
    {
        "slug": "long-happy-life",
        "title": "Love 21's Open Secret to a Long, Happy Life",
        "date_label": "November 9, 2021",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.59.49-1024x684.png",
        "source_url": "https://www.afoodieworld.com/foodie/love-21-s-open-secret-to-a-long-happy-life",
        "source_label": "A Foodie World",
        "topics": ["nutrition", "family"],
        "learning_hook": "Nutrition and sport together — how Love 21 supports longer, healthier lives.",
        "audience": "parents",
        "resource_type": "press",
        "origin": "love21",
    },
    {
        "slug": "purposeful-employment",
        "title": "Hong Kong's Love 21 Foundation aims to prove those with Down's syndrome, autism ready for purposeful employment",
        "date_label": "November 8, 2021",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.42.30-1024x638.png",
        "source_url": "https://www.scmp.com/news/hong-kong/society/article/3155167/hong-kongs-love-21-foundation-aims-prove-those-downs",
        "source_label": "South China Morning Post",
        "topics": ["employment", "down-syndrome", "autism", "inclusion"],
        "learning_hook": "Real proof that employment myths don't match reality — members building meaningful careers.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "love21",
    },
    {
        "slug": "dragon-boating-inclusion",
        "title": "Hong Kong yacht club and charity team up to help special needs teens learn dragon boating",
        "date_label": "September 30, 2021",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.51.15-1024x583.png",
        "source_url": "https://www.scmp.com/video/scmp-originals/3150667/hong-kong-yacht-club-and-charity-team-help-mentally-disabled-teens",
        "source_label": "South China Morning Post",
        "topics": ["sport", "inclusion", "down-syndrome", "autism"],
        "learning_hook": "From fear of water to racing in open water — inclusion through sport in action.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "love21",
    },
    {
        "slug": "free-nutrition-guidance",
        "title": "Hong Kong charity offers free diet advice and guidance for children with intellectual disabilities in low-income families",
        "date_label": "May 22, 2021",
        "cover_image_url": "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-16.15.14-1024x683.png",
        "source_url": "https://www.scmp.com/lifestyle/health-wellness/article/3134294/hong-kong-charity-offers-free-diet-advice-and-guidance",
        "source_label": "South China Morning Post",
        "topics": ["nutrition", "family"],
        "learning_hook": "How Love 21's nutrition programme supports families who need it most.",
        "audience": "parents",
        "resource_type": "press",
        "origin": "love21",
    },
    {
        "slug": "hbr-neurodiversity-competitive-advantage",
        "title": "Neurodiversity as a Competitive Advantage",
        "date_label": "May 2017",
        "cover_image_url": "https://hbr.org/resources/images/article_assets/2017/04/Jun21_01_183494879.jpg",
        "source_url": "https://hbr.org/2017/05/neurodiversity-as-a-competitive-advantage",
        "source_label": "Harvard Business Review",
        "topics": ["employment", "inclusion", "autism"],
        "learning_hook": "Why hiring neurodivergent talent is a business advantage, not just a moral one.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "nyt-autism-office-design",
        "title": "The Future of Work: An Office Designed for Neurodiversity",
        "date_label": "February 2019",
        "cover_image_url": "https://static01.nyt.com/images/2019/02/24/magazine/24mag-autistic-slide-NPKV/24mag-autistic-slide-NPKV-facebookJumbo-v3.png",
        "source_url": "https://www.nytimes.com/interactive/2019/02/21/magazine/autism-office-design.html",
        "source_label": "The New York Times",
        "topics": ["employment", "inclusion", "autism"],
        "learning_hook": "What happens when workplaces are designed for people who think differently.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "forbes-autism-employment-legal",
        "title": "Effective Autism (Neurodiversity) Employment: A Legal Perspective",
        "date_label": "January 2019",
        "cover_image_url": "https://imageio.forbes.com/blogs-images/michaelbernick/files/2019/01/autismatwork.png?format=png&height=900&width=1600&fit=bounds",
        "source_url": "https://www.forbes.com/sites/michaelbernick/2019/01/15/effective-autism-neurodiversity-employment-a-legal-perspective/",
        "source_label": "Forbes",
        "topics": ["employment", "autism", "inclusion"],
        "learning_hook": "Legal frameworks that support neurodiverse hiring programmes.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "edsurge-peer-mentors",
        "title": "Colleges Enlist Peer Mentors to Welcome Neurodivergent Students",
        "date_label": "August 2019",
        "cover_image_url": "https://images.ctfassets.net/eflsecw4kznd/1E0PYQKWuKMNIzrhRgghiW/180ef8c7b951b6d680d9a9b9c2656c1e/shutterstock_565422706-1565303586.jpg",
        "source_url": "https://www.edsurge.com/news/2019-08-08-colleges-enlist-peer-mentors-to-make-campuses-more-welcoming-to-neurodivergent-students",
        "source_label": "EdSurge",
        "topics": ["inclusion", "autism"],
        "learning_hook": "How peer support makes schools and campuses more inclusive.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "cbs-autism-talent",
        "title": "Companies Open Doors to Talent with Autism",
        "date_label": "September 2018",
        "cover_image_url": "https://assets2.cbsnewsstatic.com/hub/i/r/2018/02/09/c3db469f-a1ee-425f-8018-81ac27885c30/thumbnail/1200x630g2/dac07d36a6522bbec3c42f57c4c31de0/autism-at-work-sap-game-night-promo-top.jpg",
        "source_url": "https://www.cbsnews.com/news/companies-open-doors-to-talent-with-autism/",
        "source_label": "CBS News",
        "topics": ["employment", "autism", "inclusion"],
        "learning_hook": "Corporate programmes that create real jobs for autistic adults.",
        "audience": "teachers",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "psychology-today-neurodiverse-college",
        "title": "Choosing a College When You're Neurodiverse",
        "date_label": "August 2018",
        "cover_image_url": "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_teaser_image/2018-08/_dsc4753.jpg?itok=H7MEnzpW",
        "source_url": "https://www.psychologytoday.com/us/blog/my-life-aspergers/201808/choosing-college-when-youre-neurodiverse",
        "source_label": "Psychology Today",
        "topics": ["family", "inclusion", "autism"],
        "learning_hook": "Guidance for families navigating post-school transitions.",
        "audience": "parents",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "ability-mag-neurodiversity-real-world",
        "title": "Neurodiversity in the Real World",
        "date_label": "December 2019",
        "cover_image_url": "https://media.abilitymagazine.com/wp-content/uploads/2019/11/18120255/John-Robison-ocean.jpg",
        "source_url": "https://abilitymagazine.com/john-robison-neurodiversity-in-the-real-world/",
        "source_label": "Ability Magazine",
        "topics": ["inclusion", "autism", "employment"],
        "learning_hook": "John Robison on what neurodiversity looks like beyond the textbook.",
        "audience": "all",
        "resource_type": "press",
        "origin": "external",
    },
    {
        "slug": "autistic-police-officer-interview",
        "title": "An Interview with an Autistic Police Officer",
        "date_label": "October 2019",
        "cover_image_url": "https://autisticandunapologetic.com/wp-content/uploads/2019/10/The-Autistic-Policeman.jpg",
        "source_url": "https://autisticandunapologetic.com/2019/10/12/an-interview-with-an-autistic-police-officer/",
        "source_label": "Autistic & Unapologetic",
        "topics": ["employment", "autism", "inclusion"],
        "learning_hook": "A first-person story challenging assumptions about autistic careers.",
        "audience": "all",
        "resource_type": "interview",
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

        for index, item in enumerate(RESOURCE_SEED, start=1):
            existing = db.scalar(select(LearnResource).where(LearnResource.slug == item["slug"]))
            if existing:
                existing.title = item["title"]
                existing.date_label = item["date_label"]
                existing.cover_image_url = item["cover_image_url"]
                existing.source_url = item["source_url"]
                existing.source_label = item["source_label"]
                existing.topics = item["topics"]
                existing.learning_hook = item["learning_hook"]
                existing.audience = item["audience"]
                existing.resource_type = item["resource_type"]
                existing.origin = item["origin"]
                existing.show_on_learn = item.get("show_on_learn", True)
                existing.show_on_stories = item.get("show_on_stories", True)
                existing.status = LearnContentStatus.PUBLISHED
                existing.display_order = index
                continue
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
                    show_on_learn=item.get("show_on_learn", True),
                    show_on_stories=item.get("show_on_stories", True),
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
