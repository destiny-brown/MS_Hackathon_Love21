"use client";

import { useEffect, useState } from "react";

import { ConfettiBurst } from "@/components/learn/trail-map/confetti-burst";
import { QuestionCard } from "@/components/learn/trail-map/question-card";
import { sceneGridStyle } from "@/components/learn/trail-map/scene-theme";
import type { DayEvent } from "@/lib/day-locations-data";

type Phase = "paddling" | "question" | "revealed" | "advancing" | "stalled";

interface DragonBoatStageProps {
  events: DayEvent[]; // the 5 legs of the race, in order
  legIndex: number; // which leg (0-4) is currently being raced
  progressAtLegStart: number; // 0..1, how far along the river the boat already is
  /** First name entered on the welcome screen — used to personalize the crew's banter. */
  crewName?: string | null;
  onLegComplete: (correct: boolean) => void;
}

const PADDLER_X = [22, 46, 70, 94, 118];

/** paddlers stroke in a slightly staggered wave, front-to-back, the way a real crew does.
 *  Left exactly as-is — only the scene around the boat gets the new dressing. */
function DragonBoat({ paddling, drifting }: { paddling: boolean; drifting: boolean }) {
  return (
    <svg viewBox="0 0 150 60" width="150" height="60" className={drifting ? "" : "anim-boat-bob"} aria-hidden>
      {/* wake trail behind the stern */}
      <path d="M-14 42 Q0 46 14 42" stroke="rgba(15,118,158,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M-22 46 Q-4 51 10 46" stroke="rgba(15,118,158,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* hull */}
      <path d="M8 40 Q75 60 140 40 L132 30 Q75 42 16 30 Z" fill="#e8543e" />
      {/* dragon head */}
      <path d="M8 40 Q-2 34 4 24 Q10 18 20 24 L18 34 Z" fill="#c73f2c" />
      <circle cx="8" cy="27" r="1.6" fill="#f5c34d" />

      {/* paddlers, stroking in a front-to-back wave */}
      {PADDLER_X.map((x, i) => (
        <g
          key={x}
          className={paddling ? "anim-paddle" : ""}
          style={{ transformOrigin: `${x}px 26px`, animationDelay: paddling ? `${i * 90}ms` : undefined }}
        >
          <circle cx={x} cy="20" r="6" fill="#1f2933" />
          <rect x={x - 3} y="25" width="6" height="12" rx="3" fill="#f5c34d" />
        </g>
      ))}
    </svg>
  );
}

/** Comic-style speech bubble, anchored above the boat, for the idle paddling beat. */
function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="anim-bubble-in absolute -top-3 left-6 max-w-[13rem] -translate-y-full rounded-2xl rounded-bl-sm bg-white/95 px-3 py-2 text-xs font-medium leading-snug text-brand-ink shadow-md sm:max-w-[16rem] sm:text-sm">
      {children}
      <span className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 bg-white/95" aria-hidden />
    </div>
  );
}

/** Same reaction language as the field-event stage, so the crew "feels" like
 *  the same expedition no matter which location the trail is currently at. */
function ReactionBurst({ correct }: { correct: boolean }) {
  const sparkles = [
    { sx: "18px", sy: "-26px", delay: "0ms" },
    { sx: "-4px", sy: "-30px", delay: "90ms" },
    { sx: "10px", sy: "-16px", delay: "160ms" },
  ];
  return (
    <div className="pointer-events-none absolute -right-3 -top-6" aria-hidden>
      <span className="anim-reaction-pop block text-2xl drop-shadow-sm">{correct ? "👍" : "🤔"}</span>
      {correct &&
        sparkles.map((s, i) => (
          <span
            key={i}
            className="anim-sparkle absolute left-1 top-1 text-sm"
            style={{ "--sx": s.sx, "--sy": s.sy, animationDelay: s.delay } as React.CSSProperties}
          >
            ✨
          </span>
        ))}
    </div>
  );
}

export function DragonBoatStage({ events, legIndex, progressAtLegStart, crewName, onLegComplete }: DragonBoatStageProps) {
  const event = events[legIndex];
  const [phase, setPhase] = useState<Phase>("paddling");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setPhase("paddling");
    setSelectedOptionId(null);
    setWasCorrect(null);
  }, [event.id]);

  useEffect(() => {
    if (phase !== "paddling") return;
    const t = setTimeout(() => setPhase("question"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  function handleSelect(optionId: string) {
    if (phase !== "question") return;
    const correct = optionId === event.question.correctOptionId;
    setSelectedOptionId(optionId);
    setWasCorrect(correct);
    setPhase("revealed");

    setTimeout(() => setPhase(correct ? "advancing" : "stalled"), 1600);
    setTimeout(() => onLegComplete(correct), 1600 + 1100);
  }

  const legShare = 1 / events.length;
  const targetProgress = wasCorrect
    ? Math.min(1, progressAtLegStart + legShare)
    : progressAtLegStart + legShare * 0.15; // a small stall-forward so it never looks fully stuck
  const displayProgress = phase === "advancing" || phase === "stalled" ? targetProgress : progressAtLegStart;
  const isFinished = phase === "advancing" && targetProgress >= 1;
  const showWrongCue = phase === "stalled";
  const showReaction = (phase === "advancing" || phase === "stalled") && wasCorrect !== null;
  const partnerTag = crewName ? `and ${crewName} ` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div
        className={`anim-scene-settle relative h-56 overflow-hidden rounded-2xl border border-brand-sand bg-gradient-to-b from-sky-100 to-brand-sea/20 sm:h-64 ${
          showWrongCue ? "anim-wrong-shake" : ""
        }`}
        style={sceneGridStyle("harbour")}
      >
        <div className="trail-scene-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        {isFinished && <div className="anim-correct-flash pointer-events-none absolute inset-0 bg-emerald-300" aria-hidden />}

        {/* water */}
        <div
          className="anim-water-scroll absolute bottom-0 left-0 right-0 h-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg, rgba(15,118,158,0.25) 0 10px, rgba(15,118,158,0.08) 10px 24px)",
            backgroundSize: "120px 100%",
          }}
          aria-hidden
        />

        {/* finish line */}
        <div className="absolute right-6 top-0 h-full w-1.5 bg-[repeating-linear-gradient(0deg,#1f2933_0_8px,#ffffff_8px_16px)]" aria-hidden />
        <div className="absolute right-8 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-ink shadow-sm">
          FINISH
        </div>

        {/* boat, positioned by progress */}
        <div
          className="absolute bottom-8 transition-all duration-[1100ms] ease-out"
          style={{ left: `calc(6% + ${displayProgress * 76}%)` }}
        >
          <div className="relative">
            {phase === "paddling" && (
              <SpeechBubble>
                The crew {partnerTag}paddle toward the next checkpoint…
              </SpeechBubble>
            )}
            <DragonBoat paddling={phase === "paddling" || phase === "advancing"} drifting={phase === "stalled"} />
            {showReaction && <ReactionBurst correct={wasCorrect === true} />}
          </div>
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink shadow-sm">
          {event.label} · Leg {legIndex + 1} of {events.length}
        </div>

        {phase !== "paddling" && phase !== "question" && wasCorrect !== null && (
          <div
            className={`anim-badge-pop absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
              wasCorrect ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
            }`}
          >
            {wasCorrect ? "Full stroke ahead! 🐉" : "The crew loses rhythm…"}
          </div>
        )}

        {(phase === "advancing" || phase === "stalled") && wasCorrect === true && <ConfettiBurst count={isFinished ? 20 : 8} />}
      </div>

      <div className="flex justify-center">
        {phase === "paddling" ? (
          <div className="anim-bubble-in flex max-w-xl items-center gap-2 rounded-2xl border border-dashed border-brand-sand/80 bg-white/50 px-4 py-3 text-center text-sm text-brand-ink/50">
            <span className="anim-runner-idle inline-block">🧭</span>
            A challenge is surfacing on the water…
          </div>
        ) : (
          // keyed by leg so the "materializing panel" entrance replays on every leg,
          // not just the first time this component mounts
          <QuestionCard
            key={event.id}
            question={event.question}
            selectedOptionId={selectedOptionId}
            revealed={phase !== "question"}
            showHint={phase === "question"}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
}