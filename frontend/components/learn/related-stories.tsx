import { MediaStoryCard } from "@/components/learn/media-story-card";
import type { MediaPost } from "@/lib/media-stories";

type RelatedStoriesProps = {
  stories: MediaPost[];
  title?: string;
  subtitle?: string;
};

export function RelatedStories({
  stories,
  title = "Hear it from the community",
  subtitle = "Real stories from Love 21 families, programmes, and press coverage.",
}: RelatedStoriesProps) {
  if (stories.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-brand-sand bg-brand-cream/60 p-5">
      <h3 className="font-serif-display text-xl text-brand-ink">{title}</h3>
      <p className="mt-1 text-sm text-brand-ink/65">{subtitle}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {stories.map((post) => (
          <MediaStoryCard key={post.slug} post={post} compact />
        ))}
      </div>
    </div>
  );
}
