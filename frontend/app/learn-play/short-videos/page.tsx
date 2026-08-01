"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type YouTubeVideo } from "@/lib/api";
import { curatedVideos, filterCuratedVideos } from "@/lib/curated-videos";

function getYouTubeThumbnail(video: YouTubeVideo): string {
  if (video.thumbnail_url) return video.thumbnail_url;
  return `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;
}

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-HK", { month: "short", year: "numeric" }).format(new Date(value));
}

export default function ShortVideosPage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>(curatedVideos);

  function handleReset() {
    setQuery("");
    setVideos(curatedVideos);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setVideos(filterCuratedVideos(value));
  }

  const rankedVideos = useMemo(() => {
    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return videos
      .map((video) => {
        if (tokens.length === 0) return { video, score: 0 };

        const haystack = `${video.title} ${video.channel_title}`.toLowerCase();
        const score = tokens.reduce((sum, token) => {
          if (video.title.toLowerCase().includes(token)) return sum + 2;
          if (haystack.includes(token)) return sum + 1;
          return sum;
        }, 0);

        return { video, score };
      })
      .sort((a, b) => b.score - a.score || a.video.title.localeCompare(b.video.title));
  }, [query, videos]);

  const hasQuery = query.trim().length > 0;
  return (
    <SiteLayout>
      <PageHero
        title="Short Videos"
        subtitle="A calm library of short neurodiversity education clips for families, volunteers, and community partners."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <Link href="/learn-play" className="inline-flex rounded-md text-sm font-semibold text-brand-coral transition hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            ← Back to Learn
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <aside className="rounded-3xl border border-brand-sand bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">Video library</p>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">Choose one topic at a time</h2>
              <p className="mt-4 text-sm leading-6 text-brand-ink/70">
                Curated picks are selected to keep this page fast, focused, and safe for families.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl bg-brand-cream p-4 text-sm text-brand-ink/75">
                <p><strong className="text-brand-ink">Accessible viewing:</strong> open a video on YouTube to use captions, playback speed, and keyboard shortcuts.</p>
                <p><strong className="text-brand-ink">Suggested pace:</strong> watch one short clip, then discuss one practical action.</p>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-3xl border border-brand-sand bg-white p-5 shadow-sm sm:p-6">
                <label htmlFor="learn-query" className="block text-sm font-semibold text-brand-ink">
                  What do you want to learn about?
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <Input
                    id="learn-query"
                    value={query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    placeholder="Try: autism in school, Down syndrome support"
                    className="bg-white"
                  />
                  {query.trim() ? (
                    <Button variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  ) : null}
                </div>
                <p className="mt-3 text-xs leading-5 text-brand-ink/65">
                  Filter applies to curated titles and channels only.
                </p>
              </div>

              <div aria-live="polite" className="space-y-3">
                <p className="text-sm text-brand-ink/70">
                  Showing {rankedVideos.length} curated video{rankedVideos.length === 1 ? "" : "s"} from trusted organisations.
                </p>

                {rankedVideos.length === 0 ? (
                  <p className="rounded-2xl border border-brand-sand bg-white p-4 text-sm text-brand-ink/70" role="status">
                    No videos match your filter. Try a different keyword or reset to see all curated picks.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Video results">
            {rankedVideos.map(({ video, score }) => (
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
                      src={getYouTubeThumbnail(video)}
                      alt=""
                      className="aspect-video w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {hasQuery && score > 0 ? (
                        <span className="inline-flex rounded-full bg-brand-coral/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-coral">
                          Recommended
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-brand-sea/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-sea">
                          Curated
                        </span>
                      )}
                      <span className="inline-flex rounded-full bg-brand-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-ink/60">
                        {formatPublishedDate(video.published_at)}
                      </span>
                    </div>
                    <h2 className="line-clamp-2 font-semibold leading-snug text-brand-ink">{video.title}</h2>
                    <p className="mt-2 text-sm text-brand-ink/65">{video.channel_title}</p>
                    <span className="mt-5 text-sm font-semibold text-brand-coral">Watch on YouTube →</span>
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
