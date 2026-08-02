"""Curated Love 21 knowledge chunks for Captain 21 site routing (keyword retrieval)."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class KnowledgeChunk:
    id: str
    title: str
    text: str
    href: str
    topics: tuple[str, ...]


CAPTAIN_KNOWLEDGE: tuple[KnowledgeChunk, ...] = (
    KnowledgeChunk(
        id="about-love21",
        title="Our Story",
        text="Learn about Love 21's mission, history, and the community we serve in Hong Kong.",
        href="/our-story",
        topics=("about", "mission", "neurodiversity", "love 21", "who", "what is"),
    ),
    KnowledgeChunk(
        id="programmes-overview",
        title="Our Programmes",
        text="Sport, nutrition, family support, and CSR programmes — see everything Love 21 offers.",
        href="/get-involved#programmes",
        topics=("programmes", "program", "classes", "activities", "what do you do", "services"),
    ),
    KnowledgeChunk(
        id="programmes-sport",
        title="Sport Programmes",
        text="Football, basketball, swimming, dragon boat, trampoline, and karate sessions.",
        href="/get-involved#programmes",
        topics=("sport", "football", "swimming", "karate", "dragon boat", "athlete", "special olympics"),
    ),
    KnowledgeChunk(
        id="programmes-nutrition",
        title="Nutrition Programmes",
        text="Healthy cooking workshops, dietician check-ins, and family health support.",
        href="/get-involved#programmes",
        topics=("nutrition", "food", "cooking", "health", "diet", "eating"),
    ),
    KnowledgeChunk(
        id="programmes-family",
        title="Family Support",
        text="Parent counselling, mentorship buddies, and community dinners and outings.",
        href="/get-involved#programmes",
        topics=("family", "parents", "mentorship", "counselling", "caregiver", "mother", "father"),
    ),
    KnowledgeChunk(
        id="get-involved",
        title="Get Involved",
        text="Ways to donate, volunteer, partner, or join the Love 21 community.",
        href="/get-involved",
        topics=("get involved", "join", "support", "help", "participate", "involved"),
    ),
    KnowledgeChunk(
        id="volunteer",
        title="Volunteer With Us",
        text="Find open roles and use Smart Matching to pick a volunteer shift that fits you.",
        href="/our-volunteer",
        topics=("volunteer", "volunteering", "sign up", "weekend", "coach", "corporate", "csr", "help out"),
    ),
    KnowledgeChunk(
        id="learn-play",
        title="Learn & Play",
        text="Myth vs Fact quiz, 21 Moves, short videos, and inclusion resources.",
        href="/learn-play",
        topics=("learn", "education", "inclusion", "neurodiversity", "teach", "resources"),
    ),
    KnowledgeChunk(
        id="myth-quiz",
        title="Myth vs Fact Quiz",
        text="Test what you know about autism, Down syndrome, ADHD, and inclusive practices.",
        href="/learn-play/quiz",
        topics=("quiz", "myth", "fact", "test", "autism", "adhd", "down syndrome", "misconception", "stereotype"),
    ),
    KnowledgeChunk(
        id="21-moves",
        title="21 Moves",
        text="Daily inclusion journey across Hong Kong with Captain 21 — bust myths and build skills.",
        href="/learn-play/21-moves",
        topics=("21 moves", "daily", "game", "trail", "captain", "journey", "moves"),
    ),
    KnowledgeChunk(
        id="short-videos",
        title="Short Videos",
        text="Neurodiversity education clips for families, volunteers, and community partners.",
        href="/learn-play/short-videos",
        topics=("video", "videos", "watch", "clip", "youtube"),
    ),
    KnowledgeChunk(
        id="learn-resources",
        title="Resources & Stories",
        text="Real community stories and curated articles about neurodiversity and inclusion.",
        href="/learn-play/resources",
        topics=("resources", "stories", "articles", "reading", "library", "education", "school", "classroom", "inclusion"),
    ),
    KnowledgeChunk(
        id="donate",
        title="Donate",
        text="Support Love 21 campaigns and causes — every gift backs our members' potential.",
        href="/donate",
        topics=("donate", "donation", "give", "money", "fund", "support financially", "payme", "bank"),
    ),
    KnowledgeChunk(
        id="shop-wishlist",
        title="Wishlist Shop",
        text="Buy practical items that help members train, learn, and participate.",
        href="/wishlist",
        topics=("shop", "wishlist", "buy", "item", "equipment", "gift in kind"),
    ),
    KnowledgeChunk(
        id="stories",
        title="Stories & Media",
        text="Community stories, press features, and moments that celebrate ability.",
        href="/stories-media",
        topics=("stories", "media", "press", "news", "feature", "community"),
    ),
    KnowledgeChunk(
        id="impact",
        title="Impact Dashboard",
        text="See how Love 21 serves families across Hong Kong every month.",
        href="/impact-dashboard",
        topics=("impact", "numbers", "stats", "families served", "results", "outcomes"),
    ),
    KnowledgeChunk(
        id="events",
        title="Events & Campaigns",
        text="Upcoming sports events, nutrition workshops, and community gatherings.",
        href="/events-campaigns",
        topics=("events", "campaign", "calendar", "banquet", "raffle", "upcoming"),
    ),
    KnowledgeChunk(
        id="contact",
        title="Contact Us",
        text="Reach the Love 21 team for programmes, volunteering, partnerships, or enquiries.",
        href="/contact-us",
        topics=("contact", "email", "phone", "location", "san po kong", "address", "reach", "talk to"),
    ),
    KnowledgeChunk(
        id="members",
        title="Members",
        text="Register to join Love 21 programmes and activities as a member or family.",
        href="/members",
        topics=("member", "members", "register", "sign up", "join programme", "enrol"),
    ),
    KnowledgeChunk(
        id="join-internship",
        title="Join Us — Internships",
        text="Internship opportunities at Love 21 for students who want NGO experience.",
        href="/join-us",
        topics=("intern", "internship", "student", "university", "work experience"),
    ),
    KnowledgeChunk(
        id="about-governance",
        title="About & Governance",
        text="Board of directors, staff, finances, and how Love 21 is governed.",
        href="/about-governance",
        topics=("board", "directors", "governance", "staff", "finance", "annual report", "charity"),
    ),
)

# Default pages when no strong match is found
DEFAULT_LINKS: tuple[KnowledgeChunk, ...] = (
    CAPTAIN_KNOWLEDGE[0],  # our story
    CAPTAIN_KNOWLEDGE[6],  # learn-play
    CAPTAIN_KNOWLEDGE[5],  # get involved
)
