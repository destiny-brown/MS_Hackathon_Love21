"use client";

import { AnimatePresence, motion } from "framer-motion";

import { trailBadges, trailStops, type TrailStop } from "@/lib/trail-map-data";
import { isStopUnlocked } from "@/lib/trail-map-storage";
import { getActiveCosmetic, type TrailProgress } from "@/lib/trail-map-storage";
import { CaptainMascot } from "@/components/learn/captain-mascot";
import { captainMeta, getCaptainOutfit } from "@/lib/captain-character";

type TrailMapBoardProps = {
  progress: TrailProgress;
  activeStopOrder: number;
};

export function TrailMapBoard({ progress, activeStopOrder }: TrailMapBoardProps) {
  const routeProgress = trailStops.length > 1 ? activeStopOrder / (trailStops.length - 1) : 0;

  return (
    <div className="overflow-hidden border border-brand-sand bg-gradient-to-b from-[#EAF6F2] via-brand-cream to-[#F7DDD3] p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">Hong Kong trail</p>
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">{progress.captainName}&apos;s ability journey</h2>
            <p className="text-xs text-brand-ink/50">{captainMeta.fullName} moves when practical skills unlock</p>
        </div>
        <p className="text-sm text-brand-ink/60">
          Best run: <span className="font-semibold text-brand-ink">{progress.bestSections}</span> sections
        </p>
      </div>

      <div className="relative">
        <div className="absolute bottom-8 left-8 top-8 w-1 overflow-hidden bg-white/70 sm:left-1/2 sm:-ml-0.5" aria-hidden="true">
          <motion.div
            className="h-full origin-top bg-brand-coral"
            animate={{ scaleY: routeProgress }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
          />
        </div>

        <ol className="space-y-4">
          {trailStops.map((stop) => (
            <TrailStopRow
              key={stop.id}
              stop={stop}
              unlocked={isStopUnlocked(stop.id, progress)}
              active={stop.order === activeStopOrder}
              earned={progress.badges.includes(stop.badge)}
              progress={progress}
            />
          ))}
        </ol>
      </div>

      {progress.badges.length > 0 && (
        <div className="mt-6 border-t border-brand-sand/80 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">What we can do</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {progress.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-brand-coral/30 bg-white px-3 py-1 text-xs font-semibold text-brand-ink"
                title={trailBadges[badge].description}
              >
                {trailBadges[badge].label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrailStopRow({
  stop,
  unlocked,
  active,
  earned,
  progress,
}: {
  stop: TrailStop;
  unlocked: boolean;
  active: boolean;
  earned: boolean;
  progress: TrailProgress;
}) {
  return (
    <li
      className={`relative flex items-start gap-4 sm:gap-5 ${
        stop.order % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse sm:text-right"
      }`}
    >
      <div
        className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center text-xl shadow-sm transition ${
          active
            ? "border-2 border-brand-coral bg-white ring-4 ring-brand-coral/20"
            : unlocked
              ? "border border-brand-sand bg-white"
              : "border border-brand-sand/80 bg-brand-sand/40 grayscale opacity-50"
        }`}
      >
        <span className={active ? "absolute right-1 top-1 text-sm" : ""}>{stop.emoji}</span>
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={stop.id}
              initial={{ x: stop.order % 2 === 0 ? -45 : 45, y: -28, scale: 0.7, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -35, scale: 0.75, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="absolute -bottom-1"
            >
              <CaptainMascot
                outfit={getCaptainOutfit(progress.badges)}
                cosmetic={getActiveCosmetic(progress)}
                mood="happy"
                size={58}
                label={`${progress.captainName} arriving at ${stop.name}`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 transition ${
          active
            ? "border-brand-coral/40 bg-white shadow-md"
            : unlocked
              ? "border-brand-sand bg-white/80"
              : "border-brand-sand/60 bg-white/40"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-brand-ink">{stop.name}</p>
          <span className="text-xs text-brand-ink/45">{stop.area}</span>
          {earned && (
            <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-coral">
              {stop.badgeLabel}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-brand-ink/65">{stop.abilityLine}</p>
        {!unlocked && <p className="mt-1 text-xs font-medium text-brand-ink/40">Complete the previous leg to unlock</p>}
      </div>
    </li>
  );
}
