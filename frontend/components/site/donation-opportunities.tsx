"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { MockDonationForm } from "@/components/site/mock-donation-form";
import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { WISHLIST_ITEMS, getWishlistProgressPercent } from "@/lib/wishlist-items";

type CurrentFundingPriority = {
  id: string;
  kind: string;
  title: string;
  description: string;
  impact: string;
  image: string;
  imageAlt: string;
  amountRaised: number;
  goalAmount: number;
};

const CURRENT_FUNDING_PRIORITIES: CurrentFundingPriority[] = [
  {
    id: "sports-programmes",
    kind: "campaign",
    title: "Inclusive Sports Programmes",
    description: "Coach-led sessions help members build confidence, friendship, and healthy routines week by week.",
    impact: "HKD 500 supports a member's participation in community sports activities.",
    image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Placeholder photo of an inclusive sports session",
    amountRaised: 15600,
    goalAmount: 30000,
  },
  {
    id: "family-support",
    kind: "cause",
    title: "Family Support Sessions",
    description: "Parent and sibling sessions give families practical tools, encouragement, and community connection.",
    impact: "HKD 1,000 helps run a family support session for the Love 21 community.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Placeholder photo of families connecting during a support session",
    amountRaised: 9200,
    goalAmount: 20000,
  },
];

function OpportunityCard({ opportunity }: { opportunity: CurrentFundingPriority }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-sand bg-white">
      <div className="relative h-48 w-full bg-brand-cream">
        <Image
          src={opportunity.image}
          alt={opportunity.imageAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{opportunity.kind}</p>
        <h3 className="mt-2 font-serif-display text-3xl text-brand-ink">{opportunity.title}</h3>
        <p className="mt-3 text-brand-ink/75">{opportunity.description}</p>
        <p className="mt-4 rounded-xl bg-brand-cream p-4 text-sm font-medium text-brand-ink">
          {opportunity.impact}
        </p>
        <SupportProgress
          className="mt-6"
          label={opportunity.title}
          fundedAmount={opportunity.amountRaised}
          targetAmount={opportunity.goalAmount}
          progressPercent={getWishlistProgressPercent(opportunity)}
        />
        <Button asChild className="mt-5 w-full">
          <a href={`/donate?amount=${opportunity.goalAmount - opportunity.amountRaised}#donation-form`}>
            Support this {opportunity.kind}
            <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </article>
  );
}

export function DonationOpportunities({ initialWishlistItemId }: { initialWishlistItemId?: string | null }) {
  return (
    <div className="space-y-16">
      <MockDonationForm wishlistItems={WISHLIST_ITEMS} initialWishlistItemId={initialWishlistItemId} />

      <section aria-labelledby="giving-opportunities-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Where gifts connect</p>
        <h2 id="giving-opportunities-heading" className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
          Current funding priorities
        </h2>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {CURRENT_FUNDING_PRIORITIES.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </section>
    </div>
  );
}
