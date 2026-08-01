"use client";

import { useEffect, useState } from "react";
import { Brain, CheckCircle2, MapPin } from "lucide-react";

import { api, type TrailDebriefResponse } from "@/lib/api";
import { getSkillMission, learnerRoles, type LearnerRole } from "@/lib/skill-missions";
import type { TrailStop } from "@/lib/trail-map-data";
import { getUpgradeTier, type TrailProgress } from "@/lib/trail-map-storage";

type TrailDebriefPanelProps = {
  stop: TrailStop;
  sectionsCompleted: number;
  progress: TrailProgress;
  learnerRole: LearnerRole;
  mythCompletedToday: boolean;
  mythWonToday: boolean;
  mythStatement?: string;
};

const tierLabels = {
  full: "Evidence checked",
  partial: "Learning completed",
  base: "Trail completed",
} as const;

export function TrailDebriefPanel({
  stop,
  sectionsCompleted,
  progress,
  learnerRole,
  mythCompletedToday,
  mythWonToday,
  mythStatement,
}: TrailDebriefPanelProps) {
  const [debrief, setDebrief] = useState<TrailDebriefResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const tier = getUpgradeTier(mythWonToday, mythCompletedToday);
  const mission = getSkillMission(stop, learnerRole);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .trailDebrief({
        captain_name: progress.captainName,
        stop_title: stop.name,
        ability_line: `${mission.skill}: ${stop.abilityLine}`,
        sections_completed: sectionsCompleted,
        trail_streak: progress.currentStreak,
        myth_completed_today: mythCompletedToday,
        myth_won_today: mythWonToday,
        myth_statement: mythStatement,
      })
      .then((response) => {
        if (!cancelled) setDebrief(response);
      })
      .catch(() => {
        if (!cancelled) setDebrief(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [learnerRole, mission.skill, mythCompletedToday, mythStatement, mythWonToday, progress.captainName, progress.currentStreak, sectionsCompleted, stop]);

  const encouragement =
    debrief?.encouragement ??
    `${progress.captainName} completed ${sectionsCompleted} practical inclusion skills across the Love 21 trail.`;

  return (
    <div className="mt-6 border-t border-brand-sand pt-6">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-l-4 border-brand-coral bg-brand-coral/5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">Your skill profile</p>
              <h3 className="mt-2 font-serif-display text-2xl text-brand-ink">{mission.skill}</h3>
            </div>
            <CheckCircle2 className="h-7 w-7 text-brand-coral" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">
            As a {learnerRoles[learnerRole].label.toLowerCase()}, you practised making support specific, respectful,
            and centred on the person&apos;s choices.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="bg-white px-3 py-1.5 text-brand-ink">{tierLabels[tier]}</span>
            <span className="bg-white px-3 py-1.5 text-brand-ink">{sectionsCompleted} locations</span>
          </div>
        </div>

        <div className="bg-brand-ink p-5 text-white sm:p-6">
          <div className="flex items-center gap-2 text-brand-coral">
            <Brain className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">Captain&apos;s reflection</p>
            {debrief?.ai_enhanced && (
              <span className="ml-auto border border-white/15 px-2 py-0.5 text-[10px] text-white/50">Local AI</span>
            )}
          </div>
          <p className="mt-4 font-serif-display text-xl leading-relaxed text-white/90">
            {loading ? "Captain 21 is connecting your choices…" : encouragement}
          </p>
          <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-4">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-white/60">
              At {stop.name}, your choices changed the environment so participation could grow. That is the Love 21
              move: see ability, ask what helps, and build belonging together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}