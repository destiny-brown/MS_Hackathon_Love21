from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LearnQuestionRead(BaseModel):
    id: int
    external_id: str | None
    kind: str
    status: str
    statement: str
    answer: str
    explanation: str
    hint: str | None
    topic: str | None
    question_type: str | None
    options_json: list[dict] | None
    image_url: str | None
    image_credit: str | None
    source: str | None
    related_story_slugs: list[str]
    audience: str
    display_order: int
    trail_location_id: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LearnQuestionCreate(BaseModel):
    external_id: str | None = None
    kind: str = "quiz"
    status: str = "draft"
    statement: str = Field(min_length=5, max_length=2000)
    answer: str = Field(min_length=2, max_length=40)
    explanation: str = Field(min_length=5, max_length=4000)
    hint: str | None = None
    topic: str | None = None
    question_type: str | None = None
    options_json: list[dict] | None = None
    image_url: str | None = None
    image_credit: str | None = None
    source: str | None = None
    related_story_slugs: list[str] = Field(default_factory=list)
    audience: str = "all"
    display_order: int = 0
    trail_location_id: str | None = None


class LearnQuestionUpdate(BaseModel):
    external_id: str | None = None
    kind: str | None = None
    status: str | None = None
    statement: str | None = Field(default=None, min_length=5, max_length=2000)
    answer: str | None = Field(default=None, min_length=2, max_length=40)
    explanation: str | None = Field(default=None, min_length=5, max_length=4000)
    hint: str | None = None
    topic: str | None = None
    question_type: str | None = None
    options_json: list[dict] | None = None
    image_url: str | None = None
    image_credit: str | None = None
    source: str | None = None
    related_story_slugs: list[str] | None = None
    audience: str | None = None
    display_order: int | None = None
    trail_location_id: str | None = None


class LearnQuestionGenerateRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=120)
    count: int = Field(default=3, ge=1, le=8)
    kind: str = "quiz"
    guidance: str | None = Field(default=None, max_length=500)


class LearnQuestionGenerateResponse(BaseModel):
    enabled: bool
    message: str | None = None
    questions: list[LearnQuestionRead]


class LearnResourceRead(BaseModel):
    id: int
    slug: str
    title: str
    date_label: str
    cover_image_url: str
    source_url: str
    source_label: str
    topics: list[str]
    learning_hook: str
    audience: str
    resource_type: str
    origin: str
    show_on_learn: bool
    show_on_stories: bool
    status: str
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LearnResourceCreate(BaseModel):
    slug: str = Field(min_length=2, max_length=120)
    title: str = Field(min_length=2, max_length=300)
    date_label: str = Field(min_length=2, max_length=40)
    cover_image_url: str = Field(min_length=5, max_length=500)
    source_url: str = Field(min_length=5, max_length=500)
    source_label: str = Field(min_length=2, max_length=200)
    topics: list[str] = Field(default_factory=list)
    learning_hook: str = Field(min_length=5, max_length=2000)
    audience: str = "all"
    resource_type: str = "press"
    origin: str = "love21"
    show_on_learn: bool = True
    show_on_stories: bool = True
    status: str = "draft"
    display_order: int = 0


class LearnResourceUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=2, max_length=120)
    title: str | None = Field(default=None, min_length=2, max_length=300)
    date_label: str | None = None
    cover_image_url: str | None = None
    source_url: str | None = None
    source_label: str | None = None
    topics: list[str] | None = None
    learning_hook: str | None = None
    audience: str | None = None
    resource_type: str | None = None
    origin: str | None = None
    show_on_learn: bool | None = None
    show_on_stories: bool | None = None
    status: str | None = None
    display_order: int | None = None


class LearnVideoRead(BaseModel):
    id: int
    video_id: str
    title: str
    channel_title: str
    published_at: str
    thumbnail_url: str | None
    status: str
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LearnVideoCreate(BaseModel):
    video_id: str = Field(min_length=6, max_length=40)
    title: str = Field(min_length=2, max_length=300)
    channel_title: str = Field(min_length=2, max_length=200)
    published_at: str = Field(min_length=4, max_length=40)
    thumbnail_url: str | None = None
    status: str = "draft"
    display_order: int = 0


class LearnVideoUpdate(BaseModel):
    video_id: str | None = Field(default=None, min_length=6, max_length=40)
    title: str | None = None
    channel_title: str | None = None
    published_at: str | None = None
    thumbnail_url: str | None = None
    status: str | None = None
    display_order: int | None = None
