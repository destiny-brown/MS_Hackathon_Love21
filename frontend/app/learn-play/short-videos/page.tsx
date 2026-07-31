"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type YouTubeVideo } from "@/lib/api";
import { curatedVideos, filterCuratedVideos } from "@/lib/curated-videos";

const DEFAULT_TOPIC_QUERY = "autism OR down syndrome OR neurodivergence inclusive education";

type VideoSource = "curated" | "youtube";

function getYouTubeThumbnail(video: YouTubeVideo): string {
  if (video.thumbnail_url) return video.thumbnail_url;
  return `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;
}

export default function ShortVideosPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>(curatedVideos);
  const [source, setSource] = useState<VideoSource>("curated");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function runYouTubeSearch(searchQuery: string) {
    setIsLoading(true);
    setErrorText(null);
    setSubmittedQuery(searchQuery);

    try {
      const response = await api.searchYouTube(searchQuery, 20, 5);
      if (!response.enabled) {
        setVideos(filterCuratedVideos(query));
        setSource("curated");
        setErrorText(response.error || "YouTube search is currently unavailable. Showing curated picks.");
        return;
      }
      if (response.items.length === 0) {
        setVideos(filterCuratedVideos(query));
        setSource("curated");
        setErrorText(response.error || "No videos found. Showing curated picks instead.");
        return;
      }
      setVideos(response.items);
      setSource("youtube");
    } catch (error) {
      setVideos(filterCuratedVideos(query));
      setSource("curated");
      const message = error instanceof Error ? error.message : "Unable to search YouTube right now.";
      setErrorText(`${message} Showing curated picks instead.`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch() {
    const trimmed = query.trim();
    const effectiveQuery = trimmed || DEFAULT_TOPIC_QUERY;
    void runYouTubeSearch(effectiveQuery);
  }

  function handleReset() {
    setQuery("");
    setSubmittedQuery("");
    setVideos(curatedVideos);
    setSource("curated");
    setErrorText(null);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (source === "curated") {
      setVideos(filterCuratedVideos(value));
    }
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
  const isQuotaError = errorText?.includes("429") ?? false;

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
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="learn-query"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
                placeholder="Try: autism in school, down syndrome support, inclusive communication"
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching…" : "Search YouTube"}
              </Button>
              {source === "youtube" ? (
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-brand-ink/65">
              Curated picks load instantly. YouTube search uses your daily API quota — click Search only when
              needed.
            </p>
          </div>

          {source === "curated" && !errorText ? (
            <p className="mb-4 text-sm text-brand-ink/70">
              Showing {rankedVideos.length} curated video{rankedVideos.length === 1 ? "" : "s"} from trusted
              organisations.
            </p>
          ) : null}

          {source === "youtube" && submittedQuery ? (
            <p className="mb-4 text-sm text-brand-ink/70">
              YouTube results for: <span className="font-medium text-brand-ink">{submittedQuery}</span>
            </p>
          ) : null}

          {isLoading ? <p className="mb-4 text-sm text-brand-ink/70">Searching YouTube videos…</p> : null}

          {errorText ? (
            <div className="mb-4 rounded-xl border border-brand-coral/30 bg-brand-coral/5 p-4">
              <p className="text-sm text-brand-coral">{errorText}</p>
              {isQuotaError ? (
                <p className="mt-2 text-xs text-brand-ink/65">
                  Your YouTube API key has a limit of <strong>100 search queries per day</strong> (separate from
                  the 10,000 general quota). It resets at midnight Pacific Time. Request a quota increase in
                  Google Cloud Console if needed.
                </p>
              ) : null}
            </div>
          ) : null}

          {!isLoading && rankedVideos.length === 0 ? (
            <p className="mb-4 text-sm text-brand-ink/70">
              No videos match your filter. Try a different keyword or reset to see all curated picks.
            </p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rankedVideos.map(({ video, score }) => (
              <a
                key={video.video_id}
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-brand-sand bg-white"
              >
                <img
                  src={getYouTubeThumbnail(video)}
                  alt={video.title}
                  className="aspect-video w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                />
                <div className="p-3">
                  {hasQuery && score > 0 ? (
                    <span className="inline-flex rounded-full bg-brand-coral/15 px-2 py-0.5 text-[11px] font-semibold text-brand-coral">
                      Recommended
                    </span>
                  ) : source === "curated" ? (
                    <span className="inline-flex rounded-full bg-brand-sea/10 px-2 py-0.5 text-[11px] font-semibold text-brand-sea">
                      Curated
                    </span>
                  ) : null}
                  <p className="line-clamp-2 text-sm font-semibold text-brand-ink">{video.title}</p>
                  <p className="mt-1 text-xs text-brand-ink/65">{video.channel_title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
