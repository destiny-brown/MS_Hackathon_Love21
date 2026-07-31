import type { MediaPost } from "@/lib/media-stories";

type DailyStoryIntroProps = {
  story: MediaPost;
};

export function DailyStoryIntro({ story }: DailyStoryIntroProps) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm">
      <img src={story.coverImageUrl} alt="" className="aspect-[2/1] w-full object-cover sm:aspect-[21/9]" />
      <div className="border-b border-brand-sand bg-brand-cream/50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">From the community</p>
        <p className="mt-2 font-serif-display text-xl leading-snug text-brand-ink sm:text-2xl">
          {story.learningHook}
        </p>
        <p className="mt-2 text-sm text-brand-ink/55">{story.sourceLabel}</p>
      </div>
      <p className="px-5 py-3 text-center text-sm font-medium text-brand-ink/65">
        Now fact-check today&apos;s claim — is it a myth or a fact?
      </p>
    </div>
  );
}
