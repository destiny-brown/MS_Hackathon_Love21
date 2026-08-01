"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, HeartHandshake } from "lucide-react";

import { useDonationAmount } from "@/components/site/donation-amount-context";
import { formatHkd } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, DonationFrequency, DonationReceipt, SupportOpportunity } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { DONATION_TIERS } from "@/lib/donation-tiers";

export function MockDonationForm({
  opportunities,
  initialOpportunitySlug,
}: {
  opportunities: SupportOpportunity[];
  initialOpportunitySlug?: string | null;
}) {
  const { user } = useCurrentUser();
  // Amount state is shared (via DonationAmountProvider, wrapping this form and
  // the tier cards further up the page) so choosing a tier there and editing
  // the amount here always reflect the same single source of truth.
  const { amountText, amount, selectTier, setAmountText, isTierSelected } = useDonationAmount();
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const initialOpportunity = opportunities.find((entry) => entry.slug === initialOpportunitySlug) ?? opportunities[0];
  const [opportunityId, setOpportunityId] = useState<number | null>(initialOpportunity?.id ?? null);
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
    <section id="donation-form" aria-labelledby="mock-donation-heading" className="scroll-mt-24 rounded-3xl border border-brand-sand bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-coral">
          <HeartHandshake className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Mock donation flow</p>
          <h2 id="mock-donation-heading" className="mt-1 font-serif-display text-4xl text-brand-ink">
            Give without leaving the page
          </h2>
          <p className="mt-2 text-sm text-brand-ink/75">
            No real payment is taken in this demo. A successful mock payment is recorded so the dashboard and progress bars update.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold text-brand-ink">Choose an amount</legend>
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
            <Label htmlFor="custom-amount">Amount (HKD)</Label>
            <Input
              id="custom-amount"
              type="number"
              min={1}
              step={1}
              value={amountText}
              onChange={(event) => setAmountText(event.target.value)}
              placeholder="Enter an amount"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-brand-ink">Gift frequency</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { value: "one_time" as const, label: "One-time", description: "A single mock payment today." },
              { value: "monthly" as const, label: "Monthly", description: "A recurring status appears on your dashboard." },
            ].map((option) => (
              <label key={option.value} className="cursor-pointer rounded-2xl border border-brand-sand p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
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

        {opportunities.length ? (
          <div className="space-y-2">
            <Label htmlFor="support-area">What should this support?</Label>
            <select
              id="support-area"
              value={opportunityId ?? ""}
              onChange={(event) => setOpportunityId(Number(event.target.value))}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {opportunities.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.title}</option>
              ))}
            </select>
            <p className="rounded-2xl bg-brand-cream p-4 text-sm font-medium text-brand-ink" aria-live="polite">
              {supportsLine}
            </p>
          </div>
        ) : null}

        {user?.role === "supporter" ? (
          <p className="rounded-2xl bg-brand-cream p-4 text-sm text-brand-ink">
            Signed in as <strong>{user.email}</strong>. This donation will appear in your supporter dashboard.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="donor-name">Name (optional)</Label>
              <Input id="donor-name" value={donorName} onChange={(event) => setDonorName(event.target.value)} autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donor-email">Email for receipt</Label>
              <Input id="donor-email" type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} autoComplete="email" required />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="donation-message">Message to Love 21 (optional)</Label>
          <Input id="donation-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Dedication or note" />
        </div>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        <Button type="submit" disabled={saving || !amount || amount < 1} className="w-full sm:w-auto">
          {saving ? "Recording mock donation…" : "Complete mock donation"}
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
