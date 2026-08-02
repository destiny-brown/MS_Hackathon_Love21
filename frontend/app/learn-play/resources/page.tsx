"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { MediaStoryCard } from "@/components/learn/media-story-card";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { fetchLearnResourcesForAudience } from "@/lib/learn-content";
import { getStoryLearnConnections } from "@/lib/learn-connections";
import {
  getExternalResourcesForAudience,
  getLove21LearnStories,
  type MediaPost,
  type StoryAudience,
} from "@/lib/media-stories";

type FilterOption = StoryAudience | "all-filter";

const filters: { value: FilterOption; label: string }[] = [
  { value: "all-filter", label: "All" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents & Carers" },
];

function ResourcesContent() {
  const searchParams = useSearchParams();
  const audienceParam = searchParams.get("audience") as FilterOption | null;
  const highlightSlug = searchParams.get("highlight");

  const filter: FilterOption =
    audienceParam === "teachers" || audienceParam === "parents" ? audienceParam : "all-filter";

  const [love21Stories, setLove21Stories] = useState<MediaPost[]>(() => getLove21LearnStories(filter));
  const [externalResources, setExternalResources] = useState<MediaPost[]>(() => getExternalResourcesForAudience(filter));

  useEffect(() => {
    void fetchLearnResourcesForAudience(filter).then(({ love21Stories: love21, externalResources: external }) => {
      setLove21Stories(love21);
      setExternalResources(external);
    });
  }, [filter]);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all-filter" ? "/learn-play/resources" : `/learn-play/resources?audience=${f.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f.value
                ? "bg-brand-coral text-white"
                : "border border-brand-sand bg-white text-brand-ink hover:border-brand-coral"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mb-14">
        <h2 className="font-serif-display text-2xl text-brand-ink">Love 21 Archive</h2>
        <p className="mt-1 text-sm text-brand-ink/65">Educational stories</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {love21Stories.map((post) => (
            <MediaStoryCard
              key={post.slug}
              post={post}
              highlighted={post.slug === highlightSlug}
              learnConnections={getStoryLearnConnections(post.slug)}
            />
          ))}
        </div>
      </div>

      <div className="mb-14">
        <h2 className="font-serif-display text-2xl text-brand-ink">Further Reading</h2>
        <p className="mt-1 text-sm text-brand-ink/65">
          Curated from{" "}
          <a
            href="https://www.neurodiversitynetwork.net/articles-websites#news"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-coral hover:underline"
          >
            Neurodiversity Network
          </a>
          .
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {externalResources.map((post) => (
            <MediaStoryCard
              key={post.slug}
              post={post}
              highlighted={post.slug === highlightSlug}
              learnConnections={getStoryLearnConnections(post.slug)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default function LearnResourcesPage() {
  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="learnPlay.resources.title" subtitleKey="learnPlay.resources.description" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← Back to Learn
            </Link>
          </div>

          <Suspense fallback={<p className="text-sm text-brand-ink/70">Loading stories…</p>}>
            <ResourcesContent />
          </Suspense>

          <div className="mt-12 rounded-2xl border border-brand-sand bg-white p-6">
            <h3 className="font-serif-display text-xl text-brand-ink">More from Love 21</h3>
            <p className="mt-2 text-sm text-brand-ink/75">
              Explore the full Love 21 stories hub and media archive — press coverage, interviews, and community
              stories from the foundation.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/stories-media" className="text-sm font-semibold text-brand-coral hover:underline">
                Love 21 Stories →
              </Link>
              <Link href="/stories-media" className="text-sm font-semibold text-brand-coral hover:underline">
                Media archive →
              </Link>
              <Link href="/get-involved" className="text-sm font-semibold text-brand-coral hover:underline">
                Get involved →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
