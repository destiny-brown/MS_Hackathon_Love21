"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { useTranslatedProgrammes } from "@/lib/i18n/translated-data";

export default function OurProgrammesPage() {
  const { t } = useTranslation("governance");
  const programmes = useTranslatedProgrammes();

  return (
    <SiteLayout>
      <TranslatedPageHero
        ns="pages"
        titleKey="ourProgrammes.title"
        subtitleKey="ourProgrammes.subtitle"
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <article className="rounded-2xl border border-brand-sand bg-white p-6">
            <p className="text-brand-ink/80">
              {t("pages.ourProgrammes.legacyNotice", {
                defaultValue:
                  "You are on a legacy programmes URL. For the newest experience, explore programmes under Get Involved where each programme links directly to family registration, volunteer signup, CSR, donations, and wishlist support.",
              })}
            </p>
            <Link
              href="/get-involved"
              className="mt-4 inline-flex text-sm font-semibold text-brand-coral hover:underline"
            >
              {t("pages.ourProgrammes.goToGetInvolved", { defaultValue: "Go to Get Involved" })}
            </Link>
          </article>

          {programmes.map((programme) => (
            <article key={programme.title} className="border-b border-brand-sand pb-12 last:border-0">
              <h2 className="font-serif-display text-3xl text-brand-ink">{programme.title}</h2>
              <p className="mt-4 max-w-3xl text-brand-ink/80">{programme.description}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
