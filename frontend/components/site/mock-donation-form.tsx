"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, HeartHandshake } from "lucide-react";

import { useDonationAmount } from "@/components/site/donation-amount-context";
import { formatHkd } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/lib/auth";
import { DONATION_TIERS } from "@/lib/donation-tiers";
import { type WishlistItem } from "@/lib/wishlist-items";

type DonationFrequency = "one_time" | "monthly";

type MockReceipt = {
  amountHkd: number;
  frequency: DonationFrequency;
  reference: string;
  donorName: string | null;
  itemTitle: string;
};

export function MockDonationForm({
  wishlistItems,
  initialWishlistItemId,
}: {
  wishlistItems: WishlistItem[];
  initialWishlistItemId?: string | null;
}) {
  const { user } = useCurrentUser();
  // Amount state is shared (via DonationAmountProvider, wrapping this form and
  // the tier cards further up the page) so choosing a tier above and editing
  // the amount here always reflect the same single source of truth.
  const { amountText, amount, selectTier, setAmountText, isTierSelected } = useDonationAmount();
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const initialWishlistItem = wishlistItems.find((entry) => entry.id === initialWishlistItemId) ?? wishlistItems[0];
  const [wishlistItemId, setWishlistItemId] = useState(initialWishlistItem?.id ?? "");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<MockReceipt | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedWishlistItem = useMemo(
    () => wishlistItems.find((entry) => entry.id === wishlistItemId) ?? wishlistItems[0] ?? null,
    [wishlistItems, wishlistItemId],
  );
  const supportsLine = selectedWishlistItem
    ? `${formatHkd(amount || 0)} ${frequency === "monthly" ? "each month " : ""}helps fund ${selectedWishlistItem.title.toLowerCase()}: ${selectedWishlistItem.impact}`
    : `${formatHkd(amount || 0)} helps Love 21 create more inclusive programmes.`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setReceipt(null);

    if (!selectedWishlistItem) {
      setError("Please choose a wishlist item to support.");
      setSaving(false);
      return;
    }

    // TODO: Plug a real payment processor such as Stripe in here. This demo
    // intentionally mocks payment success so no card details or real charge are
    // involved.
    await new Promise((resolve) => window.setTimeout(resolve, 450));

    setReceipt({
      amountHkd: amount,
      frequency,
      reference: `MOCK-${selectedWishlistItem.id.toUpperCase().slice(0, 8)}`,
      donorName: donorName || null,
      itemTitle: selectedWishlistItem.title,
    });
    setMessage("");
    setSaving(false);
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
            No real payment is taken in this demo. Choose a wishlist need, complete the guest details, and see a thank-you confirmation.
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
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-brand-ink">Gift frequency</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { value: "one_time" as const, label: "One-time", description: "A single mocked payment today." },
              { value: "monthly" as const, label: "Monthly", description: "A mocked recurring gift for this wishlist need." },
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

        {wishlistItems.length ? (
          <div className="space-y-2">
            <Label htmlFor="support-area">What should this support?</Label>
            <select
              id="support-area"
              value={wishlistItemId}
              onChange={(event) => setWishlistItemId(event.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {wishlistItems.map((entry) => (
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
            Signed in as <strong>{user.email}</strong>. This mocked wishlist gift will be confirmed below.
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
          {saving ? "Completing mocked payment…" : "Complete mock donation"}
        </Button>
      </form>

      {receipt ? (
        <div className="mt-6 rounded-2xl border border-brand-sand bg-brand-cream p-5" role="status" aria-live="polite">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-sea" aria-hidden="true" />
            <div>
              <p className="font-semibold text-brand-ink">
                Thank you{receipt.donorName ? `, ${receipt.donorName}` : ""} — {formatHkd(receipt.amountHkd)} was mocked successfully for {receipt.itemTitle}.
              </p>
              <p className="mt-1 text-sm text-brand-ink/75">
                Reference {receipt.reference}. Your {receipt.frequency === "monthly" ? "monthly gift" : "gift"} is confirmed in this demo; no real payment was taken.
              </p>
              <p className="mt-2 text-xs text-brand-ink/60">
                Wishlist totals are hardcoded for now, so this page does not persist updated funding totals. Real persistence can be added with the production payment integration.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/wishlist">Back to wishlist</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
