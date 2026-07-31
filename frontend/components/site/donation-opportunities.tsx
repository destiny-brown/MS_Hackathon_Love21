"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { MockDonationForm } from "@/components/site/mock-donation-form";
import { SupportProgress } from "@/components/site/support-progress";
import { api, SupportOpportunity } from "@/lib/api";

function OpportunityCard({ opportunity }: { opportunity: SupportOpportunity }) {
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
      </div>
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

  const donationOpportunities = useMemo(
    () => opportunities.filter((entry) => entry.kind !== "wishlist"),
    [opportunities],
  );
  const tiedOpportunities = useMemo(() => opportunities.slice(0, 8), [opportunities]);

  if (loading) {
    return <p className="text-brand-ink/70" role="status">Loading opportunities…</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-sand bg-white p-6">
        <p className="font-semibold text-brand-ink">Donation opportunities are temporarily unavailable.</p>
        <p className="mt-2 text-sm text-brand-ink/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <MockDonationForm opportunities={tiedOpportunities} initialOpportunitySlug={initialItemSlug} />

      <section aria-labelledby="giving-opportunities-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Where gifts connect</p>
        <h2 id="giving-opportunities-heading" className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
          Current funding priorities
        </h2>
        {donationOpportunities.length ? (
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {donationOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-brand-ink/70">New opportunities will be shared here soon.</p>
        )}
      </section>
    </div>
  );
}
