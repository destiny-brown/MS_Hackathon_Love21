import type { MediaPost } from "@/lib/media-stories";
import { storyAudienceLabels } from "@/lib/media-stories";
import type { StoryLearnConnections } from "@/lib/learn-connections";

type MediaStoryCardProps = {
  post: MediaPost;
  compact?: boolean;
  highlighted?: boolean;
  learnConnections?: StoryLearnConnections | null;
};

export function MediaStoryCard({ post, compact = false, highlighted = false, learnConnections }: MediaStoryCardProps) {
  return (
    <a
      href={post.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group overflow-hidden rounded-2xl border bg-white transition hover:shadow-sm ${
        highlighted ? "border-brand-coral ring-2 ring-brand-coral/20" : "border-brand-sand hover:border-brand-coral/50"
      }`}
    >
      <img
        src={post.coverImageUrl}
        alt=""
        className={`w-full object-cover transition duration-200 group-hover:scale-[1.02] ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}
      />
      <div className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.12em] text-brand-ink/55">{post.date}</p>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-full bg-brand-sea/10 px-2 py-0.5 text-[10px] font-semibold text-brand-sea">
              {storyAudienceLabels[post.audience]}
            </span>
            {post.origin === "love21" ? (
              <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[10px] font-semibold text-brand-coral">
                Love 21
              </span>
            ) : null}
          </div>
        </div>
        <h3
          className={`mt-2 font-semibold text-brand-ink group-hover:text-brand-coral ${compact ? "line-clamp-2 text-base" : "text-lg"}`}
        >
          {post.title}
        </h3>
        {!compact ? <p className="mt-2 text-sm text-brand-ink/70">{post.learningHook}</p> : null}
        {learnConnections && (learnConnections.inMythQuiz || learnConnections.inDailyMyth) ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-ink/40">Connected to Learn</span>
            {learnConnections.inMythQuiz ? (
              <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[10px] font-semibold text-brand-coral">
                Myth quiz
              </span>
            ) : null}
            {learnConnections.inDailyMyth ? (
              <span className="rounded-full bg-brand-sea/10 px-2 py-0.5 text-[10px] font-semibold text-brand-sea">
                Daily myth
              </span>
            ) : null}
          </div>
        ) : null}
        <p className="mt-3 text-xs font-medium text-brand-coral">Read on {post.sourceLabel} →</p>
      </div>
    </a>
  );
}
