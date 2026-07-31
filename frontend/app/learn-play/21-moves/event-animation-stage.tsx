"use client";

import { useEffect, useState } from "react";

import { QuestionCard } from "@/components/learn/trail-map/question-card";
import type { DayEvent, EventKind } from "@/lib/day-locations-data";

type Phase = "approach" | "question" | "revealed" | "result" | "done";

interface EventAnimationStageProps {
  event: DayEvent;
  /** called once, after the result animation finishes, with whether the answer was correct */
  onEventComplete: (correct: boolean) => void;
}

const PROP_ICON: Record<EventKind, string> = {
  hurdle: "🚧",
  "hurdle-final": "🚧",
  javelin: "🎯",
  longjump: "⛱️",
  polevault: "🪝",
  dragonboat: "🐉",
  generic: "🏁",
};

const SUCCESS_CLASS: Record<EventKind, string> = {
  hurdle: "anim-event-success-hop",
  "hurdle-final": "anim-event-success-hop",
  javelin: "anim-event-success-throw",
  longjump: "anim-event-success-hop",
  polevault: "anim-event-success-vault",
  dragonboat: "anim-event-success-hop",
  generic: "anim-event-success-hop",
};

const FAIL_CLASS: Record<EventKind, string> = {
  hurdle: "anim-event-fail-stumble",
  "hurdle-final": "anim-event-fail-stumble",
  javelin: "anim-event-fail-short",
  longjump: "anim-event-fail-short",
  polevault: "anim-event-fail-stumble",
  dragonboat: "anim-event-fail-stumble",
  generic: "anim-event-fail-stumble",
};

/** A small stylised athlete rig — one shared SVG reused across every event, re-posed via CSS. */
function AthleteFigure({ frozen }: { frozen: boolean }) {
  return (
    <svg viewBox="0 0 60 90" width="60" height="90" className={frozen ? "" : "anim-runner-idle"} aria-hidden>
      <circle cx="30" cy="14" r="10" fill="#1f2933" />
      <rect x="24" y="24" width="12" height="30" rx="6" fill="#e8543e" />
      {/* front leg */}
      <rect x="18" y="50" width="8" height="28" rx="4" fill="#1f2933" transform={frozen ? "rotate(-35 22 50)" : undefined} />
      {/* back leg */}
      <rect x="32" y="50" width="8" height="28" rx="4" fill="#1f2933" transform={frozen ? "rotate(50 36 50)" : undefined} />
      {/* arms */}
      <rect x="10" y="26" width="8" height="22" rx="4" fill="#e8543e" transform={frozen ? "rotate(-70 14 26)" : "rotate(20 14 26)"} />
      <rect x="42" y="26" width="8" height="22" rx="4" fill="#e8543e" transform={frozen ? "rotate(80 46 26)" : "rotate(-20 46 26)"} />
    </svg>
  );
}

function ObstacleProp({ kind }: { kind: EventKind }) {
  return (
    <div className="flex h-16 w-10 items-end justify-center text-3xl sm:h-20 sm:w-14 sm:text-4xl" aria-hidden>
      {PROP_ICON[kind]}
    </div>
  );
}

export function EventAnimationStage({ event, onEventComplete }: EventAnimationStageProps) {
  const [phase, setPhase] = useState<Phase>("approach");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // reset whenever a new event is mounted
  useEffect(() => {
    setPhase("approach");
    setSelectedOptionId(null);
    setWasCorrect(null);
  }, [event.id]);

  // the runner approaches, then freezes mid-motion and the question appears
  useEffect(() => {
    if (phase !== "approach") return;
    const t = setTimeout(() => setPhase("question"), 1100);
    return () => clearTimeout(t);
  }, [phase]);

  function handleSelect(optionId: string) {
    if (phase !== "question") return;
    const correct = optionId === event.question.correctOptionId;
    setSelectedOptionId(optionId);
    setWasCorrect(correct);
    setPhase("revealed");

    // pause on the explanation, then play the success/fail motion, then hand back to parent
    setTimeout(() => setPhase("result"), 1600);
    setTimeout(() => {
      setPhase("done");
      onEventComplete(correct);
    }, 1600 + 1200);
  }

  const isFrozen = phase === "question" || phase === "revealed";
  const isFlying = phase === "result";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      {/* animation scene */}
      <div
        className={`relative flex h-56 items-end overflow-hidden rounded-2xl border border-brand-sand bg-gradient-to-b from-white to-brand-cream/60 px-6 pb-6 sm:h-64`}
      >
        <div className="absolute bottom-6 left-0 right-0 h-1 bg-brand-sand" aria-hidden />
        <div className="relative flex w-full items-end justify-between">
          <div
            className={
              phase === "approach"
                ? "anim-runner-approach"
                : isFlying
                  ? wasCorrect
                    ? SUCCESS_CLASS[event.kind]
                    : FAIL_CLASS[event.kind]
                  : ""
            }
          >
            <AthleteFigure frozen={isFrozen} />
          </div>
          <ObstacleProp kind={event.kind} />
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink shadow-sm">
          {event.label}
        </div>

        {phase === "result" && wasCorrect !== null && (
          <div
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
              wasCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {wasCorrect ? "Cleared it! 🎉" : "So close — try the next one!"}
          </div>
        )}
      </div>

      {/* question, always rendered below/beside the animation */}
      <div className="flex justify-center">
        {phase === "approach" ? (
          <div className="max-w-xl text-center text-sm text-brand-ink/50">
            Captain 21 is lining up for <span className="font-semibold text-brand-coral">{event.label}</span>…
          </div>
        ) : (
          <QuestionCard
            question={event.question}
            selectedOptionId={selectedOptionId}
            revealed={phase === "revealed" || phase === "result" || phase === "done"}
            showHint={phase === "question"}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
}
