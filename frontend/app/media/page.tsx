import Link from "next/link";

import { ElfsightFeeds } from "@/components/media/elfsight-feeds";
import { ProgrammeShowcase } from "@/components/media/programme-showcase";
import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/media-stories";

export default function MediaPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Media & Programmes"
        subtitle="Stories, sports, nutrition, and community — social feeds, programme highlights, and Love 21 press coverage in one place."
      />

      <section className="border-b border-brand-sand bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Social feed</h2>
            <p className="mt-2 max-w-2xl text-brand-ink/75">
              Follow Love 21 on Instagram and YouTube — live community moments from our programmes.
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
              Sport, nutrition, family support, and CSR — the pillars of how Love 21 shows up for the community.
            </p>
          </div>
          <ProgrammeShowcase />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif-display text-3xl text-brand-ink">Press &amp; stories</h2>
              <p className="mt-2 max-w-2xl text-brand-ink/75">
                Archive coverage, events, and community updates from Love 21 Foundation.
              </p>
            </div>
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              Explore Learn &amp; Play →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mediaPosts.map((post) => (
              <MediaStoryCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
