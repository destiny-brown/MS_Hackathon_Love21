"use client";

import { BrandCard } from "@/components/brand/BrandCard";
import { Reveal } from "@/components/brand/Reveal";
import { useDonationAmount } from "@/components/site/donation-amount-context";
import { DONATION_TIERS } from "@/lib/donation-tiers";
import { donationFormUrl } from "@/lib/donation-form-url";
import { cn } from "@/lib/utils";

export function DonationTierGrid() {
  const { selectTier, isTierSelected } = useDonationAmount();

  function handleSelect(tierAmount: number) {
    selectTier(tierAmount);
    window.location.href = donationFormUrl({ amount: tierAmount });
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DONATION_TIERS.map((tier, i) => {
        const isSelected = isTierSelected(tier);
        return (
          <Reveal key={tier.amount} delay={i * 0.08}>
            <button
              type="button"
              onClick={() => handleSelect(tier.amount)}
              aria-pressed={isSelected}
              className="block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
              <BrandCard
                className={cn(
                  "rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6",
                  i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1",
                  isSelected && "ring-2 ring-brand-red ring-offset-2",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-serif-display text-2xl text-brand-red">{tier.label}</div>
                  {isSelected ? (
                    <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Selected
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-brand-dark/70">{tier.impact}</p>
              </BrandCard>
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}
