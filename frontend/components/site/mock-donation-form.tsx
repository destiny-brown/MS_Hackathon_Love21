"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, HeartHandshake } from "lucide-react";

import { useDonationAmount } from "@/components/site/donation-amount-context";
import { formatHkd } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, DonationFrequency, DonationReceipt, OpportunityKind, SupportOpportunity } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { DONATION_TIERS } from "@/lib/donation-tiers";

const KIND_ORDER: OpportunityKind[] = ["wishlist", "campaign", "cause"];

export function MockDonationForm({
  opportunities,
  initialOpportunitySlug,
}: {
  opportunities: SupportOpportunity[];
  initialOpportunitySlug?: string | null;
}) {
  const { t } = useTranslation("donate");
  const { user } = useCurrentUser();
  const { amountText, amount, selectTier, setAmountText, isTierSelected } = useDonationAmount();
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const [opportunityId, setOpportunityId] = useState<number | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedOpportunity = useMemo(
    () => opportunities.find((entry) => entry.id === opportunityId) ?? opportunities[0] ?? null,
    [opportunities, opportunityId],
  );

  const groupedOpportunities = useMemo(() => {
    const groups: Record<OpportunityKind, SupportOpportunity[]> = {
      wishlist: [],
      campaign: [],
      cause: [],
    };

    for (const opportunity of opportunities) {
      groups[opportunity.kind].push(opportunity);
    }

    return groups;
  }, [opportunities]);

  useEffect(() => {
    if (!opportunities.length) {
      setOpportunityId(null);
      return;
    }

    const preferred = initialOpportunitySlug
      ? opportunities.find((entry) => entry.slug === initialOpportunitySlug)
      : null;

    setOpportunityId(preferred?.id ?? opportunities[0]?.id ?? null);
  }, [initialOpportunitySlug, opportunities]);

  const kindHintKey = selectedOpportunity
    ? selectedOpportunity.kind === "wishlist"
      ? "mockForm.wishlistSelectedHint"
      : selectedOpportunity.kind === "campaign"
        ? "mockForm.campaignSelectedHint"
        : "mockForm.causeSelectedHint"
    : null;

  const supportsLine = selectedOpportunity
    ? `${formatHkd(amount || 0)} ${frequency === "monthly" ? "each month " : ""}helps fund ${selectedOpportunity.title.toLowerCase()}: ${selectedOpportunity.impact_statement}`
    : `${formatHkd(amount || 0)} helps Love 21 create more inclusive programmes.`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setReceipt(null);
    try {
      const response = await api.createMockDonation({
        amount_hkd: amount,
        frequency,
        support_opportunity_id: selectedOpportunity?.id ?? null,
        donor_email: user?.role === "supporter" ? null : donorEmail,
        donor_name: donorName || null,
        message: message || null,
      });
      setReceipt(response);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record this mock donation");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="mock-donation-heading" className="rounded-3xl border border-brand-sand bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-coral">
          <HeartHandshake className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("mockForm.eyebrow")}</p>
          <h2 id="mock-donation-heading" className="mt-1 font-serif-display text-4xl text-brand-ink">
            {t("mockForm.title")}
          </h2>
          <p className="mt-2 text-sm text-brand-ink/75">{t("mockForm.description")}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {opportunities.length ? (
          <div className="space-y-2">
            <Label htmlFor="support-area">{t("mockForm.supportAreaLabel")}</Label>
            <select
              id="support-area"
              value={opportunityId ?? ""}
              onChange={(event) => setOpportunityId(Number(event.target.value))}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {KIND_ORDER.map((kind) => {
                const entries = groupedOpportunities[kind];
                if (!entries.length) {
                  return null;
                }

                return (
                  <optgroup key={kind} label={t(`mockForm.kindLabels.${kind}`)}>
                    {entries.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.title}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
            {kindHintKey ? (
              <p className="rounded-2xl bg-brand-cream/80 px-4 py-3 text-sm text-brand-ink/80">{t(kindHintKey)}</p>
            ) : null}
          </div>
        ) : null}

        <fieldset>
          <legend className="text-sm font-semibold text-brand-ink">{t("mockForm.amountLegend")}</legend>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DONATION_TIERS.map((tier) => (
              <label
                key={tier.amount}
                className="flex cursor-pointer items-center justify-center rounded-2xl border border-brand-sand px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-cream has-[:checked]:border-brand-red has-[:checked]:bg-brand-cream focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              >
                <input
                  type="radio"
                  name="preset-amount"
                  value={tier.amount}
                  checked={isTierSelected(tier)}
                  onChange={() => selectTier(tier.amount)}
                  className="sr-only"
                />
                {tier.openEnded ? tier.label : formatHkd(tier.amount)}
              </label>
            ))}
          </div>
          <div className="mt-4 max-w-xs space-y-2">
            <Label htmlFor="custom-amount">{t("mockForm.customAmount")}</Label>
            <Input
              id="custom-amount"
              type="number"
              min={1}
              step={1}
              value={amountText}
              onChange={(event) => setAmountText(event.target.value)}
              placeholder={t("mockForm.customAmountPlaceholder")}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-brand-ink">{t("mockForm.frequencyLegend")}</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { value: "one_time" as const, label: t("mockForm.frequencyOneTime"), description: t("mockForm.frequencyOneTimeDesc") },
              { value: "monthly" as const, label: t("mockForm.frequencyMonthly"), description: t("mockForm.frequencyMonthlyDesc") },
            ].map((option) => (
              <label
                key={option.value}
                className="cursor-pointer rounded-2xl border border-brand-sand p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={frequency === option.value}
                  onChange={() => setFrequency(option.value)}
                  className="mr-2 h-4 w-4 accent-primary"
                />
                <span className="font-semibold text-brand-ink">{option.label}</span>
                <span className="mt-1 block text-sm text-brand-ink/70">{option.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {selectedOpportunity ? (
          <p className="rounded-2xl bg-brand-cream p-4 text-sm font-medium text-brand-ink" aria-live="polite">
            {supportsLine}
          </p>
        ) : null}

        {user?.role === "supporter" ? (
          <p className="rounded-2xl bg-brand-cream p-4 text-sm text-brand-ink">
            {t("mockForm.signedInAs", { email: user.email })}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="donor-name">{t("mockForm.donorName")}</Label>
              <Input id="donor-name" value={donorName} onChange={(event) => setDonorName(event.target.value)} autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donor-email">{t("mockForm.donorEmail")}</Label>
              <Input
                id="donor-email"
                type="email"
                value={donorEmail}
                onChange={(event) => setDonorEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="donation-message">{t("mockForm.messageLabel")}</Label>
          <Input
            id="donation-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t("mockForm.messagePlaceholder")}
          />
        </div>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={saving || !amount || amount < 1} className="w-full sm:w-auto">
          {saving ? t("mockForm.submitting") : t("mockForm.submit")}
        </Button>
      </form>

      {receipt ? (
        <div className="mt-6 rounded-2xl border border-brand-sand bg-brand-cream p-5" role="status" aria-live="polite">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-sea" aria-hidden="true" />
            <div>
              <p className="font-semibold text-brand-ink">
                Thank you — {formatHkd(receipt.donation.amount_hkd)} was recorded successfully.
              </p>
              <p className="mt-1 text-sm text-brand-ink/75">
                Reference {receipt.donation.payment_reference}. {receipt.attributed_to_account ? "It is now visible on your dashboard." : receipt.account_prompt}
              </p>
              {!receipt.attributed_to_account ? (
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/register">Create an account to track your impact</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
