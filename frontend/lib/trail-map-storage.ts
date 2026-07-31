import { getDateKey } from "@/lib/myth-buster-data";
import { type TrailBadge, trailStops } from "@/lib/trail-map-data";

const STORAGE_KEY = "love21_trail_map";

export type StreakCosmetic = "warmup-cape" | "harbour-glow" | "trail-legend";

export type StreakUnlock = {
  id: StreakCosmetic;
  daysRequired: number;
  label: string;
  description: string;
};

export const streakUnlocks: StreakUnlock[] = [
  {
    id: "warmup-cape",
    daysRequired: 3,
    label: "Warm-up cape",
    description: "Three days on the trail — Captain 21 keeps showing up.",
  },
  {
    id: "harbour-glow",
    daysRequired: 7,
    label: "Harbour glow",
    description: "A week of learning through play — bandana shines gold.",
  },
  {
    id: "trail-legend",
    daysRequired: 14,
    label: "Trail legend",
    description: "Two weeks strong — full relay captain status.",
  },
];

export type TrailProgress = {
  captainName: string;
  unlockedStopIds: string[];
  badges: TrailBadge[];
  unlockedCosmetics: StreakCosmetic[];
  bestSections: number;
  totalRuns: number;
  lastRunAt: string | null;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDateKey: string | null;
};

const defaultProgress = (): TrailProgress => ({
  captainName: "Captain",
  unlockedStopIds: [trailStops[0].id],
  badges: [],
  unlockedCosmetics: [],
  bestSections: 0,
  totalRuns: 0,
  lastRunAt: null,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDateKey: null,
});

function readProgress(): TrailProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<TrailProgress>;
    return {
      ...defaultProgress(),
      ...parsed,
      unlockedCosmetics: parsed.unlockedCosmetics ?? [],
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
    };
  } catch {
    return defaultProgress();
  }
}

function writeProgress(data: TrailProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isYesterday(dateKey: string, previousDateKey: string | null): boolean {
  if (!previousDateKey) return false;
  const current = new Date(`${dateKey}T12:00:00`);
  const previous = new Date(`${previousDateKey}T12:00:00`);
  const diffDays = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

function applyStreakUnlocks(data: TrailProgress): void {
  for (const unlock of streakUnlocks) {
    if (data.currentStreak >= unlock.daysRequired && !data.unlockedCosmetics.includes(unlock.id)) {
      data.unlockedCosmetics.push(unlock.id);
    }
  }
}

function bumpDailyStreak(data: TrailProgress, date: Date = new Date()): void {
  const dateKey = getDateKey(date);
  if (data.lastPlayedDateKey === dateKey) return;

  if (data.lastPlayedDateKey === null || isYesterday(dateKey, data.lastPlayedDateKey)) {
    data.currentStreak += 1;
  } else {
    data.currentStreak = 1;
  }

  data.lastPlayedDateKey = dateKey;
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  applyStreakUnlocks(data);
}

export function getTrailProgress(): TrailProgress {
  return readProgress();
}

export function setCaptainName(name: string): TrailProgress {
  const data = readProgress();
  data.captainName = name.trim() || "Captain";
  writeProgress(data);
  return data;
}

export function recordTrailRun(
  sectionsCompleted: number,
  stopIdsUnlocked: string[],
  badgesEarned: TrailBadge[],
): TrailProgress {
  const data = readProgress();
  data.totalRuns += 1;
  data.bestSections = Math.max(data.bestSections, sectionsCompleted);
  data.lastRunAt = new Date().toISOString();
  bumpDailyStreak(data);

  for (const id of stopIdsUnlocked) {
    if (!data.unlockedStopIds.includes(id)) {
      data.unlockedStopIds.push(id);
    }
  }

  for (const badge of badgesEarned) {
    if (!data.badges.includes(badge)) {
      data.badges.push(badge);
    }
  }

  writeProgress(data);
  return data;
}

export function isStopUnlocked(stopId: string, progress: TrailProgress): boolean {
  return progress.unlockedStopIds.includes(stopId);
}

export function getNextStreakUnlock(progress: TrailProgress): StreakUnlock | null {
  return streakUnlocks.find((unlock) => progress.currentStreak < unlock.daysRequired) ?? null;
}

export function getActiveCosmetic(progress: TrailProgress): StreakCosmetic | null {
  if (progress.unlockedCosmetics.length === 0) return null;
  const order: StreakCosmetic[] = ["warmup-cape", "harbour-glow", "trail-legend"];
  const unlocked = order.filter((id) => progress.unlockedCosmetics.includes(id));
  return unlocked[unlocked.length - 1] ?? null;
}

/** Myth won today = easier relay (fewer hits per section) */
export function getHitsPerSection(mythWonToday: boolean, mythCompletedToday: boolean): number {
  if (mythWonToday) return 4;
  if (mythCompletedToday) return 5;
  return 5;
}

export function getUpgradeTier(mythWonToday: boolean, mythCompletedToday: boolean): "full" | "partial" | "base" {
  if (mythWonToday) return "full";
  if (mythCompletedToday) return "partial";
  return "base";
}
