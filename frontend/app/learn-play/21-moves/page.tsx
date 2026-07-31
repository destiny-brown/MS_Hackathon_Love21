"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ConfettiBurst } from "@/components/learn/trail-map/confetti-burst";
import { DayMapStrip } from "@/components/learn/trail-map/day-map-strip";
import { DragonBoatStage } from "@/components/learn/trail-map/dragon-boat-stage";
import { EventAnimationStage } from "@/components/learn/trail-map/event-animation-stage";
import { SiteLayout } from "@/components/site/site-layout";
import { getLocationForDayNumber, LOCATION_DAYS } from "@/lib/day-locations-data";

import "./event-animations.css";

const STORAGE_KEY = "love21_trail_progress_v2";

interface StoredProgress {
  dayNumber: number;
  eventIndex: number;
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

const LOCATION_ICONS: Record<string, string> = {
  stadium: "🏟️",
  harbour: "🚣",
  court: "🏀",
  wall: "🧗",
  track: "🚴",
  festival: "🎉",
};

const LOCATION_LABELS: Record<string, string> = {
  stadium: "The Stadium",
  harbour: "The Harbour",
  court: "The Court",
  wall: "The Climbing Wall",
  track: "The Cycling Track",
  festival: "Finish Line Festival",
};

export default function TwentyOneMovesPage() {
  const [progress, setProgress] = useState<StoredProgress | null>(null);
  const [dayJustCompleted, setDayJustCompleted] = useState(false);
  const [scoreBump, setScoreBump] = useState(false);
  const prevCorrectRef = useRef<number | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    if (!progress) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!progress) return;
    if (prevCorrectRef.current !== null && progress.correctCount > prevCorrectRef.current) {
      setScoreBump(true);
      const t = setTimeout(() => setScoreBump(false), 450);
      return () => clearTimeout(t);
    }
    prevCorrectRef.current = progress.correctCount;
  }, [progress?.correctCount]);

  const location = useMemo(
    () => (progress ? getLocationForDayNumber(progress.dayNumber) : null),
    [progress]
  );
  const completedLoops = progress
    ? Math.floor((progress.dayNumber - 1) / LOCATION_DAYS.length)
    : 0;

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
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f3ee]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#e8e4de] border-t-[#991b1b]" />
            <p className="text-sm font-medium text-[#666]">Loading your trail…</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const currentEvent = location.events[progress.eventIndex];
  const dayProgressFraction = progress.eventIndex / location.events.length;
  const currentLocIndex = (progress.dayNumber - 1) % LOCATION_DAYS.length;

  function resetProgress() {
  const confirmed = window.confirm(
    "Reset your 21 Moves progress and start again from Day 1?"
  );

  if (!confirmed) return;

  window.localStorage.removeItem(STORAGE_KEY);

  setDayJustCompleted(false);
  prevCorrectRef.current = null;
  setScoreBump(false);

  setProgress(DEFAULT_PROGRESS);
}
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[#f5f3ee] px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-5xl font-medium tracking-tight text-[#0f172a] sm:text-6xl lg:text-7xl">
              21 <em className="text-[#991b1b]">Moves</em>
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[#5a5a5a]">
              Bust a myth, learn a fact, and make the right call — five moves a day with Captain 21.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-[#e8e4de] bg-white px-5 py-2.5 text-sm font-semibold text-[#4a4a4a] shadow-sm transition-transform ${
                scoreBump ? "anim-score-bump" : ""
              }`}
            >
              <span className="text-lg font-bold text-[#991b1b]">{progress.correctCount}</span>
              <span className="text-[#999]">/</span>
              <span>{progress.totalAnswered}</span>
              <span className="ml-1 text-xs text-[#999]">correct</span>
              
            </div>
            {completedLoops > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#991b1b] to-[#dc2626] px-5 py-2.5 text-sm font-bold text-white shadow-md">
                🔥 Loop {completedLoops + 1}
              </div>
            )}
            <button
    type="button"
    onClick={resetProgress}
    className="rounded-full border border-[#e8e4de] bg-white px-4 py-2 text-sm font-medium text-[#991b1b] transition hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
  >
    Reset Progress
  </button>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
        <Link
          href="/learn-play"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#991b1b] transition-colors hover:text-[#7f1d1d]"
        >
          ← Back to Learn
        </Link>
      </div>

      <section className="space-y-6 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Trail Map */}
          <div className="overflow-hidden rounded-2xl border border-[#e8e4de] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999]">
                The 21 Moves Trail
              </span>
              <span className="rounded-full bg-gradient-to-r from-[#991b1b] to-[#dc2626] px-4 py-1.5 text-[11px] font-bold text-white">
                Day {progress.dayNumber}
              </span>
            </div>

            <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-2">
              {/* Connecting line */}
              <div
                className="absolute top-6 left-6 right-6 hidden h-[3px] rounded-full sm:block"
                style={{
                  background: `linear-gradient(90deg, #991b1b 0%, #991b1b ${
                    (currentLocIndex / (LOCATION_DAYS.length - 1)) * 100
                  }%, #e8e4de ${(currentLocIndex / (LOCATION_DAYS.length - 1)) * 100}%, #e8e4de 100%)`,
                }}
              />

              {LOCATION_DAYS.map((loc, i) => {
                const isDone = i < currentLocIndex;
                const isActive = i === currentLocIndex;
                return (
                  <div
                    key={loc.theme}
                    className="relative z-10 flex min-w-[80px] flex-col items-center gap-2"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] text-xl transition-all ${
                        isDone
                          ? "border-[#991b1b] bg-[#991b1b] text-white"
                          : isActive
                            ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[0_0_0_6px_rgba(15,23,42,0.1)]"
                            : "border-[#e8e4de] bg-white text-[#bbb]"
                      } ${isActive ? "animate-[node-pulse_2s_ease-in-out_infinite]" : ""}`}
                    >
                      {LOCATION_ICONS[loc.theme]}
                    </div>
                    <span
                      className={`text-center text-[11px] font-semibold leading-tight ${
                        isActive ? "text-[#0f172a]" : "text-[#888]"
                      }`}
                    >
                      {LOCATION_LABELS[loc.theme]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0a0a0a] px-6 py-8 shadow-2xl sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#991b1b] opacity-[0.06] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#1e3a5f] opacity-[0.08] blur-3xl" />

            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fca5a5]">
                Day {progress.dayNumber} · {location.title}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-white sm:text-4xl">
                {location.subtitle}
              </h2>

              {!dayJustCompleted && (
                <div className="mt-5 flex max-w-md items-center gap-2" aria-label="Progress through today's five events">
                  {location.events.map((evt, i) => (
                    <div key={evt.id} className="flex-1">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          i < progress.eventIndex
                            ? "bg-emerald-400"
                            : i === progress.eventIndex
                              ? "bg-gradient-to-r from-[#dc2626] to-[#f87171]"
                              : "bg-white/15"
                        } ${i === progress.eventIndex ? "animate-[bar-shimmer_2s_ease-in-out_infinite]" : ""}`}
                      />
                      <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/30">
                        {i + 1}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Game Area */}
          {dayJustCompleted ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#e8e4de] bg-white py-16 text-center shadow-sm">
              <ConfettiBurst count={32} />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span className="text-5xl">🏁</span>
                <h3 className="font-serif text-3xl font-medium text-[#0f172a]">{location.title} complete!</h3>
                <p className="max-w-md text-sm leading-relaxed text-[#666]">
                  Captain 21 is ready for the next stop on the trail. The six locations keep looping — new day, same crew.
                </p>
                <button
                  type="button"
                  onClick={startNextDay}
                  className="mt-2 rounded-full bg-gradient-to-r from-[#991b1b] to-[#dc2626] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Head to Day {progress.dayNumber}
                </button>
              </div>
            </div>
          ) : location.theme === "harbour" ? (
            <div className="overflow-hidden rounded-2xl border border-[#e8e4de] bg-white p-5 shadow-sm sm:p-8">
              <DragonBoatStage
                events={location.events}
                legIndex={progress.eventIndex}
                progressAtLegStart={dayProgressFraction}
                onLegComplete={handleEventComplete}
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#e8e4de] bg-white shadow-sm">
              <EventAnimationStage
                key={currentEvent.id}
                event={currentEvent}
                locationTheme={location.theme}
                onEventComplete={handleEventComplete}
              />
            </div>
          )}
        </div>
      </section>

      {/* Extra keyframe animations injected here for the trail nodes */}
      <style jsx global>{`
        @keyframes node-pulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(15, 23, 42, 0.1); }
          50% { box-shadow: 0 0 0 12px rgba(15, 23, 42, 0.04); }
        }
        @keyframes bar-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .origin-center {
          transform-origin: center;
        }
      `}</style>
    </SiteLayout>
  );
}