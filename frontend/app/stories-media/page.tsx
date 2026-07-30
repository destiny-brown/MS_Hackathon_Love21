import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/site-data";

const highlights = [
  {
    title: "Member Spotlights",
    description: "Ability-first stories including daily accomplishments and milestones.",
  },
  {
    title: "Testimonials",
    description: "Family, volunteer, and partner voices from the Love 21 community.",
  },
  {
    title: "News & Blog Archive",
    description: "Social updates moved into a permanent archive to preserve stories and programme impact.",
  },
];

export default function StoriesMediaPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Stories"
        subtitle="Member spotlights, testimonials, and a long-term archive for social and media updates."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => (
              <article key={highlight.title} className="rounded-2xl border border-brand-sand bg-white p-5">
                <h2 className="font-serif-display text-2xl text-brand-ink">{highlight.title}</h2>
                <p className="mt-3 text-brand-ink/75">{highlight.description}</p>
              </article>
            ))}
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-serif-display text-3xl text-brand-ink">Latest Posts</h2>
              <Link href="/media" className="text-sm font-semibold text-brand-coral hover:underline">
                View full media page
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mediaPosts.slice(0, 6).map((post) => (
                <article key={post.title} className="rounded-2xl border border-brand-sand bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-brand-ink/55">{post.date}</p>
                  <h3 className="mt-2 text-lg font-semibold text-brand-ink">{post.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
