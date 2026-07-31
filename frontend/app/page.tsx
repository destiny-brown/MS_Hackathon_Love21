import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MediaStoryCard } from "@/components/learn/media-story-card";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { mediaPosts, programmes, stats } from "@/lib/site-data";

export default function HomePage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-brand-sand px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="pointer-events-none absolute -left-32 top-8 h-64 w-64 rounded-full bg-brand-coral/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-sea/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-coral">#Somuchability</p>
            <h1 className="font-serif-display text-5xl leading-[1.05] text-brand-ink sm:text-6xl">OUR STORY</h1>
            <p className="max-w-2xl text-lg text-brand-ink/75">
              Love 21 is a charity empowering the Down syndrome and autistic community in Hong Kong through sport,
              nutrition, and holistic support programmes.
            </p>
            <Button asChild>
              <Link href="/our-story">
                Discover More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-3xl border border-brand-sand bg-white p-7 shadow-[0_20px_60px_rgba(34,62,86,0.08)]">
            <ul className="space-y-5">
              {stats.map((stat) => (
                <li key={stat.label} className="border-b border-brand-sand pb-4 last:border-0 last:pb-0">
                  <p className="font-serif-display text-4xl text-brand-sea">{stat.value}</p>
                  <p className="text-sm uppercase tracking-[0.13em] text-brand-ink/70">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-sand px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 font-serif-display text-4xl text-brand-ink sm:text-5xl">Our Programmes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((programme) => (
              <article
                key={programme.title}
                className="rounded-2xl border border-brand-sand bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-serif-display text-3xl text-brand-ink">{programme.title}</h3>
                <p className="mt-3 text-sm text-brand-ink/70">{programme.description.slice(0, 120)}…</p>
              </article>
            ))}
          </div>
          <Link
            href="/our-programmes"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-brand-coral transition hover:text-brand-ink"
          >
            View All Programmes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-b border-brand-sand bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 font-serif-display text-4xl text-brand-ink sm:text-5xl">Latest Updates</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mediaPosts.slice(0, 6).map((post) => (
              <MediaStoryCard key={post.slug} post={post} compact />
            ))}
          </div>
          <Link
            href="/media"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-brand-coral transition hover:text-brand-ink"
          >
            View All Media <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-brand-ink px-4 py-16 text-brand-cream sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-coral">Subscribe to our eNews</p>
            <h2 className="mt-2 font-serif-display text-4xl sm:text-5xl">Stay close to the mission</h2>
          </div>
          <NewsletterForm dark />
        </div>
      </section>
    </SiteLayout>
  );
}
