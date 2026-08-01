"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { MockDonationForm } from "@/components/site/mock-donation-form";
import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";

function OpportunityCard({ opportunity }: { opportunity: SupportOpportunity }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-brand-light bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
        {opportunity.kind}
      </p>
      <h3 className="mt-2 font-serif-display text-3xl text-brand-dark">{opportunity.title}</h3>
      <p className="mt-3 text-brand-dark/75">{opportunity.description}</p>
      <p className="mt-4 rounded-xl bg-brand-light p-4 text-sm font-medium text-brand-dark">
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
          <p className="mt-5 text-xs text-brand-dark/65">
            Please write &ldquo;{opportunity.title}&rdquo; in the MoonClerk Remarks field so Love 21 can designate your gift.
          </p>
          <Button asChild className="mt-3 w-full">
            <a href={opportunity.moonclerk_url} target="_blank" rel="noreferrer">
              Support this {opportunity.kind}
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </>
      ) : null}
    </article>
  );
}

export function DonationOpportunities({ initialItemSlug }: { initialItemSlug?: string | null }) {
  const [opportunities, setOpportunities] = useState<SupportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listSupportOpportunities()
      .then(setOpportunities)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load donation opportunities"))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(
    () => [
      {
        kind: "campaign",
        eyebrow: "Time-bound opportunities",
        title: "Current Campaigns",
        entries: opportunities.filter((entry) => entry.kind === "campaign"),
      },
      {
        kind: "cause",
        eyebrow: "Sustained impact",
        title: "Champion Their Potential",
        entries: opportunities.filter((entry) => entry.kind === "cause"),
      },
    ],
    [opportunities],
  );
  const tiedOpportunities = useMemo(() => opportunities.slice(0, 8), [opportunities]);

  if (loading) {
    return <p className="text-brand-dark/70" role="status">Loading opportunities…</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-light bg-white p-6">
        <p className="font-semibold text-brand-dark">Donation opportunities are temporarily unavailable.</p>
        <p className="mt-2 text-sm text-brand-dark/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <MockDonationForm opportunities={tiedOpportunities} initialOpportunitySlug={initialItemSlug} />

      {groups.map((group) => (
        <section key={group.kind} aria-labelledby={`${group.kind}-heading`}>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">{group.eyebrow}</p>
          <h2 id={`${group.kind}-heading`} className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">
            {group.title}
          </h2>
          {group.entries.length ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {group.entries.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-brand-dark/70">New opportunities will be shared here soon.</p>
          )}
        </section>
      ))}
    </div>
  );
}
