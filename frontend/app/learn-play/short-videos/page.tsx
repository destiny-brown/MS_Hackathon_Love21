"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Input } from "@/components/ui/input";

const shortVideos = [
  {
    title: "Why Autism is a Difference, not a Deficit",
    videoUrl: "https://www.youtube.com/watch?v=We2fJz866NU",
    channelName: "Ambitious about Autism",
    topics: ["autism", "neurodiversity", "difference", "awareness", "inclusion"],
  },
  {
    title: "What is Autism? Neurodiversity Affirming Video for Students",
    videoUrl: "https://www.youtube.com/watch?v=bRL7M5oGT6Q",
    channelName: "The Neurodivergent Teacher",
    topics: ["autism", "students", "school", "education", "neurodiversity"],
  },
  {
    title: "Things Autistic People Are Tired Of Hearing",
    videoUrl: "https://www.youtube.com/watch?v=PJ2UquTTzjA",
    channelName: "BBC Three",
    topics: ["autism", "stigma", "communication", "respect", "society"],
  },
  {
    title: "Living with Down syndrome",
    videoUrl: "https://www.youtube.com/watch?v=O19hQ_1meR0",
    channelName: "National Health Service (NHS)",
    topics: ["down syndrome", "health", "support", "daily life", "families"],
  },
];

function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  if (match?.[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return "/images/love21_logo.png";
}

export default function ShortVideosPage() {
  const [query, setQuery] = useState("");

  const rankedVideos = useMemo(() => {
    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return shortVideos
      .map((video) => {
        if (tokens.length === 0) {
          return { video, score: 0 };
        }

        const haystack = `${video.title} ${video.channelName} ${video.topics.join(" ")}`.toLowerCase();
        const score = tokens.reduce((sum, token) => {
          if (video.topics.some((topic) => topic.includes(token))) return sum + 3;
          if (video.title.toLowerCase().includes(token)) return sum + 2;
          if (haystack.includes(token)) return sum + 1;
          return sum;
        }, 0);

        return { video, score };
      })
      .sort((a, b) => b.score - a.score || a.video.title.localeCompare(b.video.title));
  }, [query]);

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
              Recommendations appear first. The rest of the catalog is ordered by relevance.
            </p>
          </div>

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
                  <p className="mt-1 text-xs text-brand-ink/65">{video.channelName}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
