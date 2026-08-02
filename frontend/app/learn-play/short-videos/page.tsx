"use client";

import Link from "next/link";

import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { curatedVideos } from "@/lib/curated-videos";

export default function ShortVideosPage() {
  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="learnPlay.videos.title" subtitleKey="learnPlay.videos.description" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <Link
            href="/learn-play"
            className="inline-flex rounded-md text-sm font-semibold text-brand-coral transition hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            ← Back to Learn
          </Link>

          <section className="rounded-3xl border border-brand-sand bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">
                  Video library
                </p>
                <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">
                  Choose one topic at a time
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-brand-ink/70 lg:text-right">
                Curated picks load first to keep the page fast and focused. Search YouTube directly when you need a fresh topic.
              </p>
            </div>
          </section>

          {/* Video Cards Grid */}
          <div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Video results"
          >
            {curatedVideos.map((video) => (
              <a
                key={video.video_id}
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Watch ${video.title} on YouTube`}
                className="group flex overflow-hidden rounded-3xl border border-brand-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <article className="flex w-full flex-col">
                  <div className="overflow-hidden bg-brand-cream">
                    <img
                      src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
                      alt=""
                      className="aspect-video w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-brand-sea/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-sea">
                        Curated
                      </span>
                      <span className="inline-flex rounded-full bg-brand-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-ink/60">
                        {new Intl.DateTimeFormat("en-HK", {
                          month: "short",
                          year: "numeric",
                        }).format(new Date(video.published_at))}
                      </span>
                    </div>
                    <h2 className="line-clamp-2 font-semibold leading-snug text-brand-ink">
                      {video.title}
                    </h2>
                    <p className="mt-2 text-sm text-brand-ink/65">
                      {video.channel_title}
                    </p>
                    <span className="mt-5 text-sm font-semibold text-brand-coral">
                      Watch on YouTube →
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
