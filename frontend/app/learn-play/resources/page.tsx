"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { getStoryLearnConnections } from "@/lib/learn-connections";
import {
  getExternalResourcesForAudience,
  getLove21LearnStories,
  type StoryAudience,
} from "@/lib/media-stories";

type FilterOption = StoryAudience | "all-filter";

function ResourcesContent() {
  const { t } = useTranslation(["learn", "pages"]);
  const searchParams = useSearchParams();
  const audienceParam = searchParams.get("audience") as FilterOption | null;
  const highlightSlug = searchParams.get("highlight");

  const filter: FilterOption =
    audienceParam === "teachers" || audienceParam === "parents" ? audienceParam : "all-filter";

  const filters: { value: FilterOption; label: string }[] = [
    { value: "all-filter", label: t("learn:ui.all") },
    { value: "teachers", label: t("learn:ui.teachers") },
    { value: "parents", label: t("learn:ui.parentsCarers") },
  ];

  const love21Stories = useMemo(() => getLove21LearnStories(filter), [filter]);
  const externalResources = useMemo(() => getExternalResourcesForAudience(filter), [filter]);

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
        <h2 className="font-serif-display text-2xl text-brand-ink">{t("learn:ui.resourcesArchiveTitle")}</h2>
        <p className="mt-1 text-sm text-brand-ink/65">{t("learn:ui.resourcesArchiveSubtitle")}</p>
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
        <h2 className="font-serif-display text-2xl text-brand-ink">{t("learn:ui.resourcesReadingTitle")}</h2>
        <p className="mt-1 text-sm text-brand-ink/65">
          {t("learn:ui.resourcesReadingSubtitle")}{" "}
          <a
            href="https://www.neurodiversitynetwork.net/articles-websites#news"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-coral hover:underline"
          >
            {t("learn:ui.resourcesNeurodiversityNetwork")}
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
  const { t } = useTranslation(["learn", "pages"]);

  return (
    <SiteLayout>
      <PageHero
        title={t("pages:learnPlay.resources.title")}
        subtitle={t("pages:learnPlay.resources.description")}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← {t("learn:ui.backToLearn")}
            </Link>
          </div>

          <Suspense fallback={<p className="text-sm text-brand-ink/70">{t("learn:ui.resourcesLoading")}</p>}>
            <ResourcesContent />
          </Suspense>

          <div className="mt-12 rounded-2xl border border-brand-sand bg-white p-6">
            <h3 className="font-serif-display text-xl text-brand-ink">{t("learn:ui.moreFromLove21")}</h3>
            <p className="mt-2 text-sm text-brand-ink/75">{t("learn:ui.resourcesMoreBody")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/stories-media" className="text-sm font-semibold text-brand-coral hover:underline">
                {t("learn:ui.resourcesStoriesLink")}
              </Link>
              <Link href="/media" className="text-sm font-semibold text-brand-coral hover:underline">
                {t("learn:ui.resourcesMediaLink")}
              </Link>
              <Link href="/get-involved" className="text-sm font-semibold text-brand-coral hover:underline">
                {t("learn:ui.resourcesGetInvolvedLink")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
