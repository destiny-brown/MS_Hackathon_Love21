"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/brand/Reveal";
import { DonationAmountProvider } from "@/components/site/donation-amount-context";
import { MockDonationForm } from "@/components/site/mock-donation-form";
import { SiteLayout } from "@/components/site/site-layout";
import { api, SupportOpportunity } from "@/lib/api";

export function DonationFormPageContent({
  suggestedAmount,
  initialItemSlug,
}: {
  suggestedAmount?: number;
  initialItemSlug?: string;
}) {
  const { t } = useTranslation("donate");
  const [opportunities, setOpportunities] = useState<SupportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listSupportOpportunities()
      .then(setOpportunities)
      .catch((err) => setError(err instanceof Error ? err.message : t("opportunities.error")))
      .finally(() => setLoading(false));
  }, [t]);

  const formOpportunities = useMemo(
    () => opportunities.filter((entry) => entry.status === "active"),
    [opportunities],
  );

  return (
    <SiteLayout>
      <section className="border-b border-brand-light bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("mockForm.eyebrow")}</p>
          <h1 className="mt-3 font-serif-display text-4xl text-brand-ink sm:text-5xl">{t("mockForm.title")}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-brand-ink/75">{t("mockForm.description")}</p>
          <Link href="/donate" className="mt-6 inline-flex text-sm font-semibold text-brand-coral hover:underline">
            ← {t("formPage.backToDonate")}
          </Link>
        </div>
      </section>

      <DonationAmountProvider defaultAmount={suggestedAmount}>
        <Reveal>
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              {loading ? (
                <p className="text-brand-dark/70" role="status">
                  {t("opportunities.loading")}
                </p>
              ) : error ? (
                <div className="rounded-2xl border border-brand-light bg-white p-6">
                  <p className="font-semibold text-brand-dark">{t("opportunities.unavailableTitle")}</p>
                  <p className="mt-2 text-sm text-brand-dark/70">{error}</p>
                </div>
              ) : (
                <MockDonationForm opportunities={formOpportunities} initialOpportunitySlug={initialItemSlug} />
              )}
            </div>
          </section>
        </Reveal>
      </DonationAmountProvider>
    </SiteLayout>
  );
}
