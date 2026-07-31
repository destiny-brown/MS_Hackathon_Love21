import Link from "next/link";

import { ElfsightFeeds } from "@/components/media/elfsight-feeds";
import { ProgrammeShowcase } from "@/components/media/programme-showcase";
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
        subtitle="Social feeds, programme highlights, press coverage, and community stories — learn through shared experiences."
      />

      <section className="border-b border-brand-sand bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-2xl border border-brand-sand bg-brand-cream p-6">
            <h2 className="font-serif-display text-2xl text-brand-ink">Learn through real experiences</h2>
            <p className="mt-2 text-brand-ink/75">
              Follow Love 21 live, explore our programmes, then dive into press coverage and community events. Pair
              stories with our{" "}
              <Link href="/learn-play" className="font-semibold text-brand-coral hover:underline">
                Learn section
              </Link>{" "}
              to connect facts with lived experience.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Social feed</h2>
            <p className="mt-2 max-w-2xl text-brand-ink/75">
              Instagram and YouTube — community moments from sport, nutrition, and family programmes.
            </p>
          </div>
          <ElfsightFeeds />
        </div>
      </section>

      <section className="border-b border-brand-sand bg-brand-cream/40 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Our Programmes</h2>
            <p className="mt-2 max-w-2xl text-brand-ink/75">
              Sport, nutrition, family support, and CSR — where Love 21 stories begin.
            </p>
          </div>
          <ProgrammeShowcase />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Press &amp; Interviews</h2>
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

          <div className="flex flex-wrap items-center justify-between gap-4">
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
