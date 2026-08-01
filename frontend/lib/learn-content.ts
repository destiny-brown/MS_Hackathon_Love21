import { api, type LearnQuestion, type LearnResource, type LearnVideo, type YouTubeVideo } from "@/lib/api";
import { curatedVideos } from "@/lib/curated-videos";
import { mythVsFactQuestions, type QuizAnswer, type QuizQuestion } from "@/lib/learn-quiz-data";
import {
  getExternalResourcesForAudience,
  getLove21LearnStories,
  type MediaPost,
  type ResourceOrigin,
  type StoryAudience,
  type StoryTopic,
  type StoryType,
} from "@/lib/media-stories";

export function mapLearnQuestionToQuiz(question: LearnQuestion): QuizQuestion {
  return {
    id: question.external_id || String(question.id),
    statement: question.statement,
    answer: question.answer as QuizAnswer,
    explanation: question.explanation,
    topic: question.topic || "General",
    imageUrl: question.image_url || undefined,
    imageCredit: question.image_credit || undefined,
    relatedStorySlugs: question.related_story_slugs?.length ? question.related_story_slugs : undefined,
  };
}

export function mapLearnResourceToMediaPost(resource: LearnResource): MediaPost {
  return {
    slug: resource.slug,
    title: resource.title,
    date: resource.date_label,
    coverImageUrl: resource.cover_image_url,
    sourceUrl: resource.source_url,
    sourceLabel: resource.source_label,
    topics: resource.topics as StoryTopic[],
    learningHook: resource.learning_hook,
    audience: resource.audience as StoryAudience,
    type: resource.resource_type as StoryType,
    origin: resource.origin as ResourceOrigin,
  };
}

export function mapLearnVideoToYouTube(video: LearnVideo): YouTubeVideo {
  return {
    video_id: video.video_id,
    title: video.title,
    channel_title: video.channel_title,
    published_at: video.published_at,
    thumbnail_url: video.thumbnail_url,
  };
}

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const questions = await api.listPublishedLearnQuestions("quiz");
    if (questions.length === 0) return mythVsFactQuestions;
    return questions.map(mapLearnQuestionToQuiz);
  } catch {
    return mythVsFactQuestions;
  }
}

export async function fetchLearnResourcesForAudience(
  audience: StoryAudience | "all-filter",
): Promise<{ love21Stories: MediaPost[]; externalResources: MediaPost[] }> {
  try {
    const apiAudience = audience === "all-filter" ? undefined : audience;
    const resources = await api.listPublishedLearnResources(apiAudience);
    if (resources.length === 0) {
      return {
        love21Stories: getLove21LearnStories(audience),
        externalResources: getExternalResourcesForAudience(audience),
      };
    }

    const posts = resources.map(mapLearnResourceToMediaPost);
    const love21Stories = posts.filter((post) => post.origin === "love21");
    const externalResources = posts.filter((post) => post.origin === "external");
    return { love21Stories, externalResources };
  } catch {
    return {
      love21Stories: getLove21LearnStories(audience),
      externalResources: getExternalResourcesForAudience(audience),
    };
  }
}

export async function fetchLearnVideos(): Promise<YouTubeVideo[]> {
  try {
    const videos = await api.listPublishedLearnVideos();
    if (videos.length === 0) return curatedVideos;
    return videos.map(mapLearnVideoToYouTube);
  } catch {
    return curatedVideos;
  }
}
