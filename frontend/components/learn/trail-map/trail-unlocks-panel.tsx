"use client";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { captainOutfits, getCaptainOutfit } from "@/lib/captain-character";
import { trailBadges, trailStops } from "@/lib/trail-map-data";
import {
  getActiveCosmetic,
  getNextStreakUnlock,
  isStopUnlocked,
  streakUnlocks,
  type TrailProgress,
} from "@/lib/trail-map-storage";

type TrailUnlocksPanelProps = {
  progress: TrailProgress;
  mythStreak: number;
  mythCompletedToday: boolean;
  mythWonToday: boolean;
};

export function TrailUnlocksPanel({
  progress,
  mythStreak,
  mythCompletedToday,
  mythWonToday,
}: TrailUnlocksPanelProps) {
  const nextUnlock = getNextStreakUnlock(progress);
  const cosmetic = getActiveCosmetic(progress);

  return (
    <div className="rounded-3xl border border-brand-sand bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">Streaks & unlocks</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Trail streak" value={progress.currentStreak} suffix="days" />
        <StatCard label="Myth streak" value={mythStreak} suffix="days" />
        <StatCard label="Best journey" value={progress.bestSections} suffix="skills" />
      </div>

      {nextUnlock && (
        <div className="mt-4 rounded-2xl bg-brand-cream/70 px-4 py-3 text-sm">
          <p className="font-semibold text-brand-ink">
            Next unlock in {nextUnlock.daysRequired - progress.currentStreak} day
            {nextUnlock.daysRequired - progress.currentStreak === 1 ? "" : "s"}
          </p>
          <p className="text-brand-ink/70">
            {nextUnlock.label} — {nextUnlock.description}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-sand">
            <div
              className="h-full rounded-full bg-brand-coral transition-all"
              style={{ width: `${Math.min(100, (progress.currentStreak / nextUnlock.daysRequired) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-4">
        <CaptainMascot
          mood="happy"
          outfit={getCaptainOutfit(progress.badges)}
          cosmetic={cosmetic}
          size={80}
          label="Captain with current unlocks"
        />
        <div className="text-sm text-brand-ink/75">
          <p>
            Outfit: <span className="font-semibold text-brand-ink">{captainOutfits[getCaptainOutfit(progress.badges)].label}</span>
          </p>
          {cosmetic && (
            <p className="mt-1">
              Streak cosmetic: <span className="font-semibold text-brand-ink">{streakUnlocks.find((u) => u.id === cosmetic)?.label}</span>
            </p>
          )}
          <p className="mt-2 text-xs">
            {mythWonToday
              ? "Today's myth checked — practical skill journey unlocked."
              : mythCompletedToday
                ? "Today's evidence reviewed — your skill journey is ready."
                : "Begin 21 Moves to unlock today's practical skill journey."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">Trail map progress</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {trailStops.map((stop) => (
            <span
              key={stop.id}
              title={stop.name}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isStopUnlocked(stop.id, progress)
                  ? "bg-brand-coral/15 text-brand-coral"
                  : "bg-brand-sand/80 text-brand-ink/40"
              }`}
            >
              {stop.emoji} {stop.area}
            </span>
          ))}
        </div>
      </div>

      {progress.badges.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">What we can do badges</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {progress.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-brand-sand bg-white px-3 py-1 text-xs font-semibold"
                title={trailBadges[badge].description}
              >
                {trailBadges[badge].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {progress.unlockedCosmetics.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">Streak cosmetics</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {streakUnlocks
              .filter((unlock) => progress.unlockedCosmetics.includes(unlock.id))
              .map((unlock) => (
                <span key={unlock.id} className="rounded-full bg-[#EAF6F2] px-3 py-1 text-xs font-semibold text-brand-ink">
                  ✓ {unlock.label}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-2xl border border-brand-sand bg-brand-cream/40 px-4 py-3 text-center">
      <p className="text-xs uppercase tracking-wide text-brand-ink/45">{label}</p>
      <p className="mt-1 font-serif-display text-2xl text-brand-ink">
        {value}
        <span className="ml-1 text-xs font-sans font-normal text-brand-ink/50">{suffix}</span>
      </p>
    </div>
  );
}
