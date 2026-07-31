"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function EventsCampaignsPage() {
  const { t } = useTranslation("pages");

  const campaigns = [
    {
      title: t("events.campaign1.title", { defaultValue: "Beyond Limits Banquet" }),
      description: t("events.campaign1.description", {
        defaultValue: "Signature fundraising event supporting community programmes.",
      }),
    },
    {
      title: t("events.campaign2.title", { defaultValue: "Charity Raffle" }),
      description: t("events.campaign2.description", {
        defaultValue: "Community raffle campaign to fund sports, nutrition, and support activities.",
      }),
    },
    {
      title: t("events.campaign3.title", { defaultValue: "Programme-specific Drives" }),
      description: t("events.campaign3.description", {
        defaultValue: "Targeted support drives aligned with specific programme needs and calendar moments.",
      }),
    },
  ];

  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="events.title" subtitleKey="events.subtitle" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <article key={campaign.title} className="rounded-2xl border border-brand-sand bg-white p-6">
                <h2 className="font-serif-display text-2xl text-brand-ink">{campaign.title}</h2>
                <p className="mt-3 text-brand-ink/75">{campaign.description}</p>
              </article>
            ))}
          </div>
          <p className="text-brand-ink/70">
            <Link href="/get-involved" className="font-semibold text-brand-coral hover:underline">
              {t("learnPlay.getInvolved", { defaultValue: "Get involved" })}
            </Link>{" "}
            to see the latest calendar and volunteer opportunities.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
