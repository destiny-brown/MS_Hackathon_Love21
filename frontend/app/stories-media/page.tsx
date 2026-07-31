import Link from "next/link";

import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/media-stories";

export default function StoriesMediaPage() {
  const pressStories = mediaPosts.filter((p) => p.type === "press" || p.type === "interview");
  const communityStories = mediaPosts.filter((p) => p.type === "event");

  return (
    <SiteLayout>
      <PageHero
        title="Stories"
        subtitle="Member spotlights, press coverage, and community stories — learn through shared experiences."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="rounded-2xl border border-brand-sand bg-brand-cream p-6">
            <h2 className="font-serif-display text-2xl text-brand-ink">Learn through real experiences</h2>
            <p className="mt-2 text-brand-ink/75">
              These stories come from Love 21&apos;s media archive — press coverage, interviews, and community events.
              Pair them with our{" "}
              <Link href="/learn-play" className="font-semibold text-brand-coral hover:underline">
                Learn section
              </Link>{" "}
              to connect facts with lived experience.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Press & Interviews</h2>
            <p className="mt-1 text-sm text-brand-ink/65">Click any cover to read the original article.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pressStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Community Events</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {communityStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link href="/learn-play/resources" className="text-sm font-semibold text-brand-coral hover:underline">
              Browse all stories in Learn →
            </Link>
            <Link href="/media" className="text-sm font-semibold text-brand-coral hover:underline">
              View full media archive →
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
