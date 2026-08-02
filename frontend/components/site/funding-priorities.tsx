"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";

function OpportunityCard({
  opportunity,
  remarkLabel,
  supportLabel,
}: {
  opportunity: SupportOpportunity;
  remarkLabel: string;
  supportLabel: string;
}) {
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
        {opportunity.moonclerk_url ? (
          <>
            <p className="mt-5 text-xs text-brand-ink/65">{remarkLabel}</p>
            <Button asChild className="mt-3 w-full">
              <a href={opportunity.moonclerk_url} target="_blank" rel="noreferrer">
                {supportLabel}
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </>
        ) : null}
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

  const campaigns = useMemo(
    () => opportunities.filter((entry) => entry.status === "active" && entry.kind === "campaign"),
    [opportunities],
  );
  const causes = useMemo(
    () => opportunities.filter((entry) => entry.status === "active" && entry.kind === "cause"),
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

  if (!campaigns.length && !causes.length) {
    return <p className="text-brand-ink/70">{t("opportunities.emptySoon")}</p>;
  }

  return (
    <div className="space-y-10" aria-labelledby="giving-opportunities-heading">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
          {t("mockForm.prioritiesEyebrow")}
        </p>
        <h2 id="giving-opportunities-heading" className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
          {t("mockForm.prioritiesTitle")}
        </h2>
      </div>

      {campaigns.length ? (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("opportunities.campaignEyebrow")}</p>
          <h3 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">{t("opportunities.campaignTitle")}</h3>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {campaigns.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                remarkLabel={t("opportunities.remarkMoonclerk", { title: opportunity.title })}
                supportLabel={t("opportunities.support", { kind: opportunity.kind })}
              />
            ))}
          </div>
        </section>
      ) : null}

      {causes.length ? (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("opportunities.causeEyebrow")}</p>
          <h3 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">{t("opportunities.causeTitle")}</h3>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {causes.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                remarkLabel={t("opportunities.remarkMoonclerk", { title: opportunity.title })}
                supportLabel={t("opportunities.support", { kind: opportunity.kind })}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
