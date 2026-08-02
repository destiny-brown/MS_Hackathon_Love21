export type WishlistItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  impact: string;
  unitCost: number;
  unitLabel: string;
  securedCount: number;
  totalCount: number;
  amountRaised: number;
  goalAmount: number;
};

// TODO: Swap these placeholder image URLs for real Love 21 wishlist photos.
export const WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "athlete-training-kits",
    title: "Athlete Training Kits",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Placeholder photo of athletes training together, to be replaced with real Love 21 sports-session photos",
    shortDescription:
      "Placeholder image — swap for real Love 21 sports-session photos. Kits give members dependable equipment for practising skills and reaching their next sporting milestone.",
    impact: "HKD 600 funds one reusable training kit for weekly sport sessions.",
    unitCost: 600,
    unitLabel: "kit",
    securedCount: 6,
    totalCount: 20,
    amountRaised: 3600,
    goalAmount: 12000,
  },
  {
    id: "nutrition-workshop-equipment",
    title: "Nutrition Workshop Equipment",
    image: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Placeholder photo of nutrition workshop ingredients and equipment, to be replaced with real Love 21 workshop photos",
    shortDescription:
      "Placeholder image — swap for real Love 21 workshop photos. Practical equipment helps members and families turn nutrition knowledge into confident everyday choices.",
    impact: "HKD 1,500 equips one hands-on nutrition station.",
    unitCost: 1500,
    unitLabel: "station",
    securedCount: 3,
    totalCount: 12,
    amountRaised: 4500,
    goalAmount: 18000,
  },
  {
    id: "creative-learning-tablets",
    title: "Creative Learning Tablets",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Placeholder photo of a tablet used for learning, to be replaced with real Love 21 learning-session photos",
    shortDescription:
      "Placeholder image — swap for real Love 21 learning-session photos. Shared tablets expand how members communicate, create, learn, and show what they know.",
    impact: "HKD 4,000 funds one shared accessibility-friendly tablet.",
    unitCost: 4000,
    unitLabel: "tablet",
    securedCount: 2,
    totalCount: 6,
    amountRaised: 8000,
    goalAmount: 24000,
  },
];

export function getWishlistItem(itemId?: string | null) {
  if (!itemId) return null;
  return WISHLIST_ITEMS.find((item) => item.id === itemId) ?? null;
}

export function getWishlistProgressPercent(item: Pick<WishlistItem, "amountRaised" | "goalAmount">) {
  if (!item.goalAmount) return 0;
  return Math.round((item.amountRaised / item.goalAmount) * 100);
}
