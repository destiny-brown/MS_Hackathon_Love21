"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import { MockDonationForm } from "@/components/site/mock-donation-form";
import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";
import { DONATION_FORM_ANCHOR_ID, scrollToDonationForm, wantsDonationFormFocus } from "@/lib/donation-form-anchor";

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

function OpportunitySection({
  eyebrow,
  title,
  opportunities,
  remarkFor,
  supportFor,
}: {
  eyebrow: string;
  title: string;
  opportunities: SupportOpportunity[];
  remarkFor: (title: string) => string;
  supportFor: (kind: string) => string;
}) {
  if (!opportunities.length) {
    return null;
  }

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{eyebrow}</p>
      <h3 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">{title}</h3>
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            remarkLabel={remarkFor(opportunity.title)}
            supportLabel={supportFor(opportunity.kind)}
          />
        ))}
      </div>
    </section>
  );
}

export function DonationOpportunities({ initialItemSlug }: { initialItemSlug?: string | null }) {
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

  const campaigns = useMemo(
    () => formOpportunities.filter((entry) => entry.kind === "campaign"),
    [formOpportunities],
  );
  const causes = useMemo(
    () => formOpportunities.filter((entry) => entry.kind === "cause"),
    [formOpportunities],
  );
  const wishlistItems = useMemo(
    () => formOpportunities.filter((entry) => entry.kind === "wishlist"),
    [formOpportunities],
  );

  useEffect(() => {
    if (loading || !wantsDonationFormFocus(initialItemSlug)) {
      return;
    }
    scrollToDonationForm();
  }, [loading, initialItemSlug]);

  if (loading) {
    return (
      <div id={DONATION_FORM_ANCHOR_ID} className="scroll-mt-28">
        <p className="text-brand-dark/70" role="status">
          {t("opportunities.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div id={DONATION_FORM_ANCHOR_ID} className="scroll-mt-28">
        <div className="rounded-2xl border border-brand-light bg-white p-6">
          <p className="font-semibold text-brand-dark">{t("opportunities.unavailableTitle")}</p>
          <p className="mt-2 text-sm text-brand-dark/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id={DONATION_FORM_ANCHOR_ID} className="scroll-mt-28 space-y-16">
      <MockDonationForm opportunities={formOpportunities} initialOpportunitySlug={initialItemSlug} />

      <section aria-labelledby="giving-opportunities-heading" className="space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
            {t("mockForm.prioritiesEyebrow")}
          </p>
          <h2 id="giving-opportunities-heading" className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
            {t("mockForm.prioritiesTitle")}
          </h2>
          {wishlistItems.length ? (
            <p className="mt-3 max-w-3xl text-sm text-brand-ink/70">{t("mockForm.prioritiesWishlistNote")}</p>
          ) : null}
        </div>

        <OpportunitySection
          eyebrow={t("opportunities.campaignEyebrow")}
          title={t("opportunities.campaignTitle")}
          opportunities={campaigns}
          remarkFor={(title) => t("opportunities.remarkMoonclerk", { title })}
          supportFor={(kind) => t("opportunities.support", { kind })}
        />

        <OpportunitySection
          eyebrow={t("opportunities.causeEyebrow")}
          title={t("opportunities.causeTitle")}
          opportunities={causes}
          remarkFor={(title) => t("opportunities.remarkMoonclerk", { title })}
          supportFor={(kind) => t("opportunities.support", { kind })}
        />

        {!campaigns.length && !causes.length ? (
          <p className="text-brand-ink/70">{t("opportunities.emptySoon")}</p>
        ) : null}
      </section>
    </div>
  );
}
