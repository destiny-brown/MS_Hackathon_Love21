"use client";

import { Reveal } from "@/components/brand/Reveal";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { useTranslation } from "react-i18next";

export default function OurStoryPage() {
  const { t } = useTranslation("pages");

  return (
    <SiteLayout>
      <Reveal>
        <TranslatedPageHero titleKey="ourStory.title" />
      </Reveal>
      <Reveal>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-lg text-brand-dark/80">
            <p>{t("ourStory.p1")}</p>
            <p>{t("ourStory.p2")}</p>
            <p>{t("ourStory.p3")}</p>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
