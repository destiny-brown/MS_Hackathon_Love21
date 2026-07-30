"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Input } from "@/components/ui/input";
import { api, type YouTubeVideo } from "@/lib/api";

const DEFAULT_TOPIC_QUERY = "autism OR down syndrome OR neurodivergence inclusive education";

function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  if (match?.[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return "/images/love21_logo.png";
}

export default function ShortVideosPage() {
  const [query, setQuery] = useState("");
  const [remoteVideos, setRemoteVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    const effectiveQuery = trimmed || DEFAULT_TOPIC_QUERY;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setErrorText(null);
      try {
        const response = await api.searchYouTube(effectiveQuery, 20, 5);
        if (!response.enabled) {
          setRemoteVideos([]);
          setErrorText(response.error || "YouTube search is currently unavailable.");
          return;
        }
        setRemoteVideos(response.items);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to search YouTube right now.";
        setRemoteVideos([]);
        setErrorText(message);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const rankedVideos = useMemo(() => {
    const baseVideos = remoteVideos.map((video) => ({
      title: video.title,
      channelTitle: video.channel_title,
      videoUrl: `https://www.youtube.com/watch?v=${video.video_id}`,
      score: 0,
    }));

    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return baseVideos
      .map((video) => {
        if (tokens.length === 0) {
          return { video, score: 0 };
        }

        const haystack = `${video.title} ${video.channelTitle}`.toLowerCase();
        const score = tokens.reduce((sum, token) => {
          if (video.title.toLowerCase().includes(token)) return sum + 2;
          if (haystack.includes(token)) return sum + 1;
          return sum;
        }, 0);

        return { video, score };
      })
      .sort((a, b) => b.score - a.score || a.video.title.localeCompare(b.video.title));
  }, [query, remoteVideos]);

  const hasQuery = query.trim().length > 0;

  return (
    <SiteLayout>
      <PageHero
        title="Short Videos"
        subtitle="Neurodiversity education clips for families, volunteers, and community partners."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← Back to Learn
            </Link>
          </div>

          <div className="mb-8 rounded-2xl border border-brand-sand bg-white p-5">
            <label htmlFor="learn-query" className="mb-2 block text-sm font-semibold text-brand-ink">
              What do you want to learn about?
            </label>
            <Input
              id="learn-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: autism in school, down syndrome support, inclusive communication"
            />
            <p className="mt-2 text-xs text-brand-ink/65">
              Showing top 20 YouTube videos up to 5 minutes on autism, Down syndrome, and neurodivergence.
            </p>
          </div>

          {isLoading ? <p className="mb-4 text-sm text-brand-ink/70">Searching YouTube videos...</p> : null}
          {errorText ? <p className="mb-4 text-sm text-brand-coral">{errorText}</p> : null}
          {!isLoading && !errorText && rankedVideos.length === 0 ? (
            <p className="mb-4 text-sm text-brand-ink/70">No videos found for this search yet.</p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rankedVideos.map(({ video, score }) => (
              <a
                key={video.videoUrl}
                href={video.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-brand-sand bg-white"
              >
                <img
                  src={getYouTubeThumbnail(video.videoUrl)}
                  alt={video.title}
                  className="aspect-video w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                />
                <div className="p-3">
                  {hasQuery && score > 0 ? (
                    <span className="inline-flex rounded-full bg-brand-coral/15 px-2 py-0.5 text-[11px] font-semibold text-brand-coral">
                      Recommended
                    </span>
                  ) : null}
                  <p className="line-clamp-2 text-sm font-semibold text-brand-ink">{video.title}</p>
                  <p className="mt-1 text-xs text-brand-ink/65">{video.channelTitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
