"use client";

import Link from "next/link";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { TrailDebriefPanel } from "@/components/learn/trail-map/trail-debrief-panel";
import { trailBadges, type TrailStop } from "@/lib/trail-map-data";
import { getCaptainOutfit } from "@/lib/captain-character";
import type { LearnerRole } from "@/lib/skill-missions";
import { getActiveCosmetic, type TrailProgress } from "@/lib/trail-map-storage";

type TrailHandoffProps = {
  stop: TrailStop;
  sectionsCompleted: number;
  progress: TrailProgress;
  learnerRole: LearnerRole;
  mythCompletedToday: boolean;
  mythWonToday: boolean;
  mythStatement?: string;
  onPlayAgain: () => void;
};

export function TrailHandoff({
  stop,
  sectionsCompleted,
  progress,
  learnerRole,
  mythCompletedToday,
  mythWonToday,
  mythStatement,
  onPlayAgain,
}: TrailHandoffProps) {
  const badge = trailBadges[stop.badge];

  return (
    <div className="rounded-3xl border border-brand-sand bg-white p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 border-b border-brand-sand pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-coral text-sm font-bold text-white">
          05
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">Grow</p>
          <p className="text-sm text-brand-ink/60">Your move becomes a new ability and a new place on the trail.</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-8">
        <CaptainMascot
          mood="cheering"
          outfit={getCaptainOutfit(progress.badges)}
          cosmetic={getActiveCosmetic(progress)}
          size={120}
          label="Captain celebrating your ability journey"
        />
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">{badge.label} ability earned</p>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink lg:text-4xl">{stop.handoffTitle}</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-ink/75 lg:text-lg">&ldquo;{stop.handoffQuote}&rdquo;</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="border-l-4 border-brand-coral bg-brand-coral/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-coral">Ability unlocked</p>
          <p className="mt-1 font-semibold text-brand-ink">{badge.label}</p>
          <p className="mt-1 text-sm text-brand-ink/70">{badge.description}</p>
        </div>
        <div className="border-l-4 border-brand-sea bg-brand-sea/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-sea">Hong Kong trail</p>
          <p className="mt-1 font-semibold text-brand-ink">{stop.emoji} {stop.name}</p>
          <p className="mt-1 text-sm text-brand-ink/70">
            {sectionsCompleted} section{sectionsCompleted === 1 ? "" : "s"} cleared and saved.
          </p>
        </div>
      </div>

      <TrailDebriefPanel
        stop={stop}
        sectionsCompleted={sectionsCompleted}
        progress={progress}
        learnerRole={learnerRole}
        mythCompletedToday={mythCompletedToday}
        mythWonToday={mythWonToday}
        mythStatement={mythStatement}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        {stop.storyHref && (
          <a
            href={stop.storyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-ink"
          >
            Read the real story →
          </a>
        )}
        <Link
          href={stop.programmeHref}
          className="rounded-full border border-brand-sand px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-coral"
        >
          Get involved
        </Link>
        <Link
          href="/learn-play/resources"
          className="rounded-full border border-brand-sand px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-coral"
        >
          Browse resources
        </Link>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-full border border-brand-sand px-5 py-2.5 text-sm font-semibold text-brand-ink/70 hover:border-brand-ink"
        >
          Run again
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-brand-ink/50">
        Not fixing anyone — growing in understanding, empathy, and practical inclusion.
      </p>
    </div>
  );
}
