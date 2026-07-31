"use client";

import { useEffect, useState } from "react";

import { QuestionCard } from "@/components/learn/trail-map/question-card";
import type { DayEvent } from "@/lib/day-locations-data";

type Phase = "paddling" | "question" | "revealed" | "advancing" | "stalled";

interface DragonBoatStageProps {
  events: DayEvent[]; // the 5 legs of the race, in order
  legIndex: number; // which leg (0-4) is currently being raced
  progressAtLegStart: number; // 0..1, how far along the river the boat already is
  onLegComplete: (correct: boolean) => void;
}

const CONFETTI = ["🎊", "🎉", "✨", "🎊", "✨"];

function DragonBoat({ paddling }: { paddling: boolean }) {
  return (
    <svg viewBox="0 0 140 60" width="140" height="60" className="anim-boat-bob" aria-hidden>
      {/* hull */}
      <path d="M8 40 Q70 60 132 40 L124 30 Q70 42 16 30 Z" fill="#e8543e" />
      {/* dragon head */}
      <path d="M8 40 Q-2 34 4 24 Q10 18 20 24 L18 34 Z" fill="#c73f2c" />
      {/* paddlers */}
      {[28, 52, 76, 100].map((x, i) => (
        <g key={x} className={paddling ? "anim-paddle" : ""} style={{ transformOrigin: `${x}px 26px` }}>
          <circle cx={x} cy="20" r="6" fill="#1f2933" />
          <rect x={x - 3} y="25" width="6" height="12" rx="3" fill="#f5c34d" />
        </g>
      ))}
    </svg>
  );
}

export function DragonBoatStage({ events, legIndex, progressAtLegStart, onLegComplete }: DragonBoatStageProps) {
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="relative h-56 overflow-hidden rounded-2xl border border-brand-sand bg-gradient-to-b from-sky-100 to-brand-sea/20 sm:h-64">
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
          <DragonBoat paddling={phase === "paddling" || phase === "advancing"} />
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink shadow-sm">
          {event.label} · Leg {legIndex + 1} of {events.length}
        </div>

        {phase !== "paddling" && phase !== "question" && wasCorrect !== null && (
          <div
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
              wasCorrect ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
            }`}
          >
            {wasCorrect ? "Full stroke ahead! 🐉" : "The crew loses rhythm…"}
          </div>
        )}

        {isFinished &&
          CONFETTI.map((c, i) => (
            <span
              key={i}
              className="anim-confetti absolute right-10 top-6 text-lg"
              style={{ animationDelay: `${i * 0.08}s`, right: `${8 + i * 3}%` }}
            >
              {c}
            </span>
          ))}
      </div>

      <div className="flex justify-center">
        {phase === "paddling" ? (
          <div className="max-w-xl text-center text-sm text-brand-ink/50">
            The crew paddles toward the next checkpoint…
          </div>
        ) : (
          <QuestionCard
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
