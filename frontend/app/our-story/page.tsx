"use client";

import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { useTranslation } from "react-i18next";

export default function OurStoryPage() {
  const { t } = useTranslation("pages");

  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="ourStory.title" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-lg text-brand-ink/80">
          <p>{t("ourStory.p1")}</p>
          <p>{t("ourStory.p2")}</p>
          <p>{t("ourStory.p3")}</p>
        </div>
      </section>
    </SiteLayout>
  );
}
