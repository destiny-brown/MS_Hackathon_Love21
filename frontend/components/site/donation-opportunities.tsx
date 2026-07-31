"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";

function OpportunityCard({ opportunity }: { opportunity: SupportOpportunity }) {
  const { t } = useTranslation("donate");

  return (
    <article className="flex h-full flex-col rounded-2xl border border-brand-sand bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
        {opportunity.kind}
      </p>
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
          <p className="mt-5 text-xs text-brand-ink/65">
            {t("opportunities.remarkMoonclerk", { title: opportunity.title })}
          </p>
          <Button asChild className="mt-3 w-full">
            <a href={opportunity.moonclerk_url} target="_blank" rel="noreferrer">
              {t("opportunities.support", { kind: opportunity.kind })}
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </>
      ) : null}
    </article>
  );
}

export function DonationOpportunities() {
  const { t } = useTranslation("donate");
  const [opportunities, setOpportunities] = useState<SupportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listSupportOpportunities()
      .then((entries) => setOpportunities(entries.filter((entry) => entry.kind !== "wishlist")))
      .catch((err) => setError(err instanceof Error ? err.message : t("opportunities.error")))
      .finally(() => setLoading(false));
  }, [t]);

  const groups = useMemo(
    () => [
      {
        kind: "campaign",
        eyebrow: t("opportunities.campaignEyebrow"),
        title: t("opportunities.campaignTitle"),
        entries: opportunities.filter((entry) => entry.kind === "campaign"),
      },
      {
        kind: "cause",
        eyebrow: t("opportunities.causeEyebrow"),
        title: t("opportunities.causeTitle"),
        entries: opportunities.filter((entry) => entry.kind === "cause"),
      },
    ],
    [opportunities, t],
  );

  if (loading) {
    return <p className="text-brand-ink/70" role="status">{t("opportunities.loading")}</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-sand bg-white p-6">
        <p className="font-semibold text-brand-ink">{t("opportunities.unavailableTitle")}</p>
        <p className="mt-2 text-sm text-brand-ink/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section key={group.kind} aria-labelledby={`${group.kind}-heading`}>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{group.eyebrow}</p>
          <h2 id={`${group.kind}-heading`} className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
            {group.title}
          </h2>
          {group.entries.length ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {group.entries.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-brand-ink/70">{t("opportunities.emptySoon")}</p>
          )}
        </section>
      ))}
    </div>
  );
}
