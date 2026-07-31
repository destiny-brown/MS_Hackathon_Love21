import type { TrailBadge } from "@/lib/trail-map-data";
import type { StreakCosmetic } from "@/lib/trail-map-storage";

export type CaptainMood = "idle" | "happy" | "cheering" | "thinking";

export type CaptainOutfit = "default" | TrailBadge;

export const captainMeta = {
  name: "Cap",
  fullName: "Captain 21",
  tagline: "Your Team Captain — turning understanding into inclusive action.",
};

/** Cosmetic unlocks tied to trail badges */
export const captainOutfits: Record<
  CaptainOutfit,
  { label: string; accessory: string }
> = {
  default: { label: "Starter kit", accessory: "Captain bandana" },
  athlete: { label: "Athlete kit", accessory: "Sport headband" },
  dancer: { label: "Dancer kit", accessory: "Rhythm scarf" },
  coach: { label: "Coach kit", accessory: "Coach whistle" },
  leader: { label: "Leader kit", accessory: "Gold armband" },
  teammate: { label: "Teammate kit", accessory: "Team jersey stripe" },
  buddy: { label: "Buddy kit", accessory: "Buddy pin" },
};

export function getCaptainOutfit(progressBadges: TrailBadge[]): CaptainOutfit {
  if (progressBadges.length === 0) return "default";
  return progressBadges[progressBadges.length - 1];
}

export const streakCosmeticLabels: Record<StreakCosmetic, string> = {
  "warmup-cape": "Warm-up cape",
  "harbour-glow": "Harbour glow bandana",
  "trail-legend": "Trail legend cape",
};
