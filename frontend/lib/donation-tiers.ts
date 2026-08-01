export type DonationTier = {
  /** The numeric HKD amount this tier represents. This is the value that
   *  actually flows into shared state — `label` is display-only. */
  amount: number;
  /** Formatted label shown on the tier card/button. */
  label: string;
  impact: string;
  /** True for a tier like "HKD$1,000+" where the amount is a floor, not a fixed value. */
  openEnded?: boolean;
};

/**
 * Single shared list of donation tiers. Both the "Where your gift goes" tier
 * cards and the mock donation form's preset amount buttons read from this
 * array so the two never drift out of sync with each other.
 */
export const DONATION_TIERS: DonationTier[] = [
  {
    amount: 100,
    label: "HKD$100",
    impact: "Provides sports equipment for one member for a month",
  },
  {
    amount: 250,
    label: "HKD$250",
    impact: "Funds one vocational training workshop session",
  },
  {
    amount: 500,
    label: "HKD$500",
    impact: "Supports a member's participation in community activities for 3 months",
  },
  {
    amount: 1000,
    label: "HKD$1,000+",
    impact: "Helps run a full day of inclusive sports programs",
    openEnded: true,
  },
];

export const DEFAULT_DONATION_AMOUNT = DONATION_TIERS[2].amount; // HKD$500
