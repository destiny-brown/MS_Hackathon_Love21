"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";
import { donationFormUrl } from "@/lib/donation-form-url";

function OpportunityCard({
  opportunity,
  remarkLabel,
  supportLabel,
  mockSupportNote,
}: {
  opportunity: SupportOpportunity;
  remarkLabel: string;
  supportLabel: string;
  mockSupportNote: string;
}) {
  const supportHref = opportunity.moonclerk_url ?? donationFormUrl({ item: opportunity.slug });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-sand bg-white">
      {opportunity.image_url ? (
        <div className="relative h-48 w-full bg-brand-cream">
          <Image
            src={opportunity.image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{opportunity.kind}</p>
        <h3 className="mt-2 font-serif-display text-3xl text-brand-ink">{opportunity.title}</h3>
        <p className="mt-3 text-brand-ink/75">{opportunity.description}</p>
        <p className="mt-4 rounded-xl bg-brand-cream p-4 text-sm font-medium text-brand-ink">
          {opportunity.impact_statement}
        </p>
        <SupportProgress
          className="mt-6"
          label={opportunity.title}
          fundedAmount={opportunity.funded_amount_hkd}
          targetAmount={opportunity.target_amount_hkd}
          progressPercent={opportunity.progress_percent}
        />
        <p className="mt-5 text-xs text-brand-ink/65">
          {opportunity.moonclerk_url ? remarkLabel : mockSupportNote}
        </p>
        <Button asChild className="mt-3 w-full">
          {opportunity.moonclerk_url ? (
            <a href={opportunity.moonclerk_url} target="_blank" rel="noreferrer">
              {supportLabel}
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <a href={supportHref}>
              {supportLabel}
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </Button>
      </div>
    </article>
  );
}

/** Campaign and cause cards for the main /donate page (no mock form). */
export function FundingPriorities() {
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

  const donationOpportunities = useMemo(
    () => opportunities.filter((entry) => entry.kind !== "wishlist"),
    [opportunities],
  );

  if (loading) {
    return <p className="text-brand-dark/70" role="status">{t("opportunities.loading")}</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-light bg-white p-6">
        <p className="font-semibold text-brand-dark">{t("opportunities.unavailableTitle")}</p>
        <p className="mt-2 text-sm text-brand-dark/70">{error}</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="giving-opportunities-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
        {t("opportunities.prioritiesEyebrow")}
      </p>
      <h2 id="giving-opportunities-heading" className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
        {t("opportunities.prioritiesTitle")}
      </h2>
      {donationOpportunities.length ? (
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {donationOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              remarkLabel={t("opportunities.remarkMoonclerk", { title: opportunity.title })}
              supportLabel={t("opportunities.support", { kind: opportunity.kind })}
              mockSupportNote={t("opportunities.mockSupportNote")}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-brand-ink/70">{t("opportunities.emptySoon")}</p>
      )}
    </section>
  );
}
