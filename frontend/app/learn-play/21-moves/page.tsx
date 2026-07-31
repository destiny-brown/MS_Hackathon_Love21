"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DayMapStrip } from "@/components/learn/trail-map/day-map-strip";
import { DragonBoatStage } from "@/components/learn/trail-map/dragon-boat-stage";
import { EventAnimationStage } from "@/components/learn/trail-map/event-animation-stage";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { getLocationForDayNumber, LOCATION_DAYS } from "@/lib/day-locations-data";

import "./event-animations.css";

const STORAGE_KEY = "love21_trail_progress_v2";

interface StoredProgress {
  dayNumber: number; // 1-based, keeps counting up past 6 (the location loops, the day count doesn't)
  eventIndex: number; // 0-4, which event within the current day
  correctCount: number;
  totalAnswered: number;
}

const DEFAULT_PROGRESS: StoredProgress = {
  dayNumber: 1,
  eventIndex: 0,
  correctCount: 0,
  totalAnswered: 0,
};

function loadProgress(): StoredProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function TwentyOneMovesPage() {
  const [progress, setProgress] = useState<StoredProgress | null>(null);
  const [dayJustCompleted, setDayJustCompleted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    if (!progress) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const location = useMemo(() => (progress ? getLocationForDayNumber(progress.dayNumber) : null), [progress]);
  const completedLoops = progress ? Math.floor((progress.dayNumber - 1) / LOCATION_DAYS.length) : 0;

  function handleEventComplete(correct: boolean) {
    setProgress((prev) => {
      if (!prev || !location) return prev;
      const nextEventIndex = prev.eventIndex + 1;
      const updated: StoredProgress = {
        ...prev,
        correctCount: prev.correctCount + (correct ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
      };

      if (nextEventIndex >= location.events.length) {
        // day complete — advance to the next day (location loops automatically)
        setDayJustCompleted(true);
        return { ...updated, dayNumber: prev.dayNumber + 1, eventIndex: 0 };
      }
      return { ...updated, eventIndex: nextEventIndex };
    });
  }

  function startNextDay() {
    setDayJustCompleted(false);
  }

  if (!progress || !location) {
    return (
      <SiteLayout>
        <PageHero title="21 Moves" subtitle="Loading your trail…" />
      </SiteLayout>
    );
  }

  const currentEvent = location.events[progress.eventIndex];
  const dayProgressFraction = progress.eventIndex / location.events.length;

  return (
    <SiteLayout>
      <PageHero
        title="21 Moves"
        subtitle="Bust a myth, learn a fact, and make the right call — five moves a day with Captain 21."
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← Back to Learn
            </Link>
            <div className="flex flex-wrap gap-3 text-sm text-brand-ink/65">
              <span className="rounded-full bg-brand-cream px-3 py-1">
                Correct answers: <strong className="text-brand-ink">{progress.correctCount}</strong> / {progress.totalAnswered}
              </span>
            </div>
          </div>

          {/* MAP — now at the top */}
          <DayMapStrip
            currentDayNumber={progress.dayNumber}
            currentDayProgress={dayJustCompleted ? 1 : dayProgressFraction}
            completedLoops={completedLoops}
          />

          {/* location header */}
          <div className="overflow-hidden rounded-2xl border border-brand-sand bg-brand-ink text-white shadow-sm">
            <div className="px-5 py-6 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">
                Day {progress.dayNumber} · {location.title}
              </p>
              <h2 className="mt-2 font-serif-display text-2xl leading-tight sm:text-3xl">{location.subtitle}</h2>
              {!dayJustCompleted && (
                <p className="mt-2 text-sm text-white/70">
                  Event {progress.eventIndex + 1} of {location.events.length}
                </p>
              )}
            </div>
          </div>

          {/* ANIMATION + QUESTION — now at the bottom */}
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm sm:p-8">
            {dayJustCompleted ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <p className="text-4xl">🏁</p>
                <h3 className="font-serif-display text-2xl text-brand-ink">
                  {location.title} complete!
                </h3>
                <p className="max-w-md text-sm text-brand-ink/65">
                  Captain 21 is ready for the next stop on the trail. The six locations keep looping — new day,
                  same crew.
                </p>
                <button
                  type="button"
                  onClick={startNextDay}
                  className="mt-2 rounded-full bg-brand-coral px-6 py-3 text-sm font-semibold text-white hover:bg-brand-ink"
                >
                  Head to Day {progress.dayNumber}
                </button>
              </div>
            ) : location.theme === "harbour" ? (
              <DragonBoatStage
                events={location.events}
                legIndex={progress.eventIndex}
                progressAtLegStart={dayProgressFraction}
                onLegComplete={handleEventComplete}
              />
            ) : (
              <EventAnimationStage
                key={currentEvent.id}
                event={currentEvent}
                locationTheme={location.theme}
                onEventComplete={handleEventComplete}
              />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}