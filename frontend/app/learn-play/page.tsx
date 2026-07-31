"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { CommunityQuotesWall } from "@/components/learn/community-quotes-wall";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const resourceKeys = ["moves", "quiz", "videos", "resources"] as const;
const resourceHrefs = {
  moves: "/learn-play/21-moves",
  quiz: "/learn-play/quiz",
  videos: "/learn-play/short-videos",
  resources: "/learn-play/resources",
} as const;

export default function LearnPlayPage() {
  const { t } = useTranslation(["pages", "common"]);

  return (
    <SiteLayout>
      <PageHero title={t("pages:learnPlay.title")} subtitle={t("pages:learnPlay.subtitle")} />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <CommunityQuotesWall />

          <p className="max-w-3xl text-center text-base text-brand-ink/70 sm:mx-auto">
            {t("pages:learnPlay.cta")}{" "}
            <Link href="/get-involved" className="font-semibold text-brand-coral hover:underline">
              {t("pages:learnPlay.getInvolved")}
            </Link>
            .
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {resourceKeys.map((key) => (
              <article key={key} className="rounded-2xl border border-brand-sand bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif-display text-3xl text-brand-ink">
                    {t(`pages:learnPlay.${key}.title`)}
                  </h2>
                  <span className="shrink-0 rounded-full bg-brand-coral/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-coral">
                    {t(`pages:learnPlay.${key}.badge`)}
                  </span>
                </div>
                <p className="mt-3 text-brand-ink/75">{t(`pages:learnPlay.${key}.description`)}</p>
                <Link
                  href={resourceHrefs[key]}
                  className="mt-5 inline-flex text-sm font-semibold text-brand-coral hover:underline"
                >
                  {t("common:actions.explore")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
