import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { MediaPost } from "@/lib/media-stories";

type DailyMythFooterProps = {
  completed: boolean;
  currentStreak: number;
  longestStreak: number;
  relatedStory?: MediaPost | null;
};

export function DailyMythFooter({
  completed,
  currentStreak,
  longestStreak,
  relatedStory,
}: DailyMythFooterProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-brand-sand bg-white px-5 py-6 text-center shadow-sm">
        {completed ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">
              That&apos;s today&apos;s challenge
            </p>
            <p className="mt-1 font-serif-display text-2xl text-brand-ink">See you tomorrow</p>
            <p className="mt-1 text-sm text-brand-ink/60">A new myth or fact drops every day.</p>

            {currentStreak > 0 && (
              <div className="mt-5">
                <p className="font-serif-display text-5xl leading-none text-brand-coral">{currentStreak}</p>
                <p className="mt-2 text-sm text-brand-ink/65">
                  {currentStreak === 1
                    ? "Day streak started"
                    : `Day streak · Best ${longestStreak}`}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="font-medium text-brand-ink">Keep your streak safe</p>
            <p className="mt-1 text-sm text-brand-ink/60">
              Sign in so your progress follows you across devices.
            </p>
            {currentStreak > 0 && (
              <p className="mt-4 font-serif-display text-3xl text-brand-coral">{currentStreak}</p>
            )}
          </>
        )}

        <p className="mt-5 text-sm text-brand-ink/65">
          {completed ? "Sign in to keep adding to your streak." : "Save your streak before you go."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button className="min-w-[6.5rem]">Sign in</Button>
          <Button variant="outline" className="min-w-[6.5rem]">
            Sign up
          </Button>
        </div>
      </div>

      {completed && relatedStory && (
        <a
          href={relatedStory.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto block max-w-md overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm transition hover:border-brand-coral/30"
        >
          <img
            src={relatedStory.coverImageUrl}
            alt=""
            className="aspect-[2/1] w-full object-cover"
          />
          <div className="px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">Go deeper</p>
            <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-brand-ink">
              {relatedStory.title}
            </p>
            <p className="mt-1 text-xs text-brand-ink/50">{relatedStory.sourceLabel}</p>
          </div>
        </a>
      )}

      <p className="pt-2 text-center text-sm text-brand-ink/55">
        <Link
          href="/learn-play/quiz"
          className="font-medium text-brand-ink hover:text-brand-coral hover:underline"
        >
          Play full quiz
        </Link>
        <span className="mx-2 text-brand-ink/25">·</span>
        <Link
          href="/learn-play/resources"
          className="font-medium text-brand-ink hover:text-brand-coral hover:underline"
        >
          Browse resources
        </Link>
      </p>
    </div>
  );
}
