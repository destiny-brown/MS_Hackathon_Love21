"use client";

import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { QuestionCard } from "@/components/learn/trail-map/question-card";
import { TrailObstacle } from "@/components/learn/trail-map/trail-obstacle-props";
import { TrailSceneShell } from "@/components/learn/trail-map/trail-scene-shell";
import type { DayEvent, EventKind, LocationTheme } from "@/lib/day-locations-data";

type Phase = "approach" | "question" | "revealed" | "result" | "done";

interface EventAnimationStageProps {
  event: DayEvent;
  locationTheme: LocationTheme;
  onEventComplete: (correct: boolean) => void;
}

const SUCCESS_MOTION: Record<EventKind, TargetAndTransition> = {
  hurdle: { x: [0, 42, 88, 148], y: [0, -58, -62, 0], rotate: [0, -10, 8, 0] },
  "hurdle-final": { x: [0, 48, 96, 168], y: [0, -72, -76, 0], rotate: [0, -12, 10, 0] },
  javelin: { x: [0, 8, 18, 28], y: [0, -6, -8, -4], rotate: [0, -18, 22, 6] },
  longjump: { x: [0, 36, 92, 132], y: [0, -18, -52, 4], rotate: [0, -6, 14, 24] },
  polevault: { x: [0, 16, 58, 118, 156], y: [0, -12, -78, -34, 0], rotate: [0, -28, 36, 72, 90] },
  dragonboat: { x: [0, 40, 90], y: [0, -8, 0], rotate: [0, 4, 0] },
  generic: { x: [0, 55, 120], y: [0, -40, 0], rotate: [0, 6, 0] },
};

const FAIL_MOTION: Record<EventKind, TargetAndTransition> = {
  hurdle: { x: [0, 22, 28], y: [0, -12, 14], rotate: [0, -8, 22] },
  "hurdle-final": { x: [0, 24, 30], y: [0, -14, 16], rotate: [0, -10, 24] },
  javelin: { x: [0, 10, 14], y: [0, -4, 6], rotate: [0, -6, 12] },
  longjump: { x: [0, 12, 16], y: [0, -6, 8], rotate: [0, -4, 14] },
  polevault: { x: [0, 14, 20], y: [0, -8, 12], rotate: [0, -12, 20] },
  dragonboat: { x: [0, 8, 10], y: [0, 2, 4], rotate: [0, -4, 6] },
  generic: { x: [0, 16, 22], y: [0, -8, 10], rotate: [0, -6, 18] },
};

function SuccessBurst({ show }: { show: boolean }) {
  if (!show) return null;
  const sparks = ["✦", "★", "✨", "✦", "★"];
  return (
    <>
      {sparks.map((spark, index) => (
        <motion.span
          key={index}
          className="pointer-events-none absolute text-lg text-brand-coral"
          initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.1, 0.6],
            x: (index - 2) * 22,
            y: -30 - index * 8,
          }}
          transition={{ duration: 0.9, delay: index * 0.05, ease: "easeOut" }}
          style={{ left: "42%", top: "38%" }}
          aria-hidden
        >
          {spark}
        </motion.span>
      ))}
    </>
  );
}

export function EventAnimationStage({ event, locationTheme, onEventComplete }: EventAnimationStageProps) {
  const [phase, setPhase] = useState<Phase>("approach");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setPhase("approach");
    setSelectedOptionId(null);
    setWasCorrect(null);
  }, [event.id]);

  useEffect(() => {
    if (phase !== "approach") return;
    const t = setTimeout(() => setPhase("question"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  const captainMood = useMemo(() => {
    if (phase === "result" || phase === "done") return wasCorrect ? "cheering" : "thinking";
    if (phase === "revealed") return wasCorrect ? "happy" : "thinking";
    if (phase === "question") return "thinking";
    return "idle";
  }, [phase, wasCorrect]);

  function handleSelect(optionId: string) {
    if (phase !== "question") return;
    const correct = optionId === event.question.correctOptionId;
    setSelectedOptionId(optionId);
    setWasCorrect(correct);
    setPhase("revealed");

    setTimeout(() => setPhase("result"), 1700);
    setTimeout(() => {
      setPhase("done");
      onEventComplete(correct);
    }, 1700 + 1300);
  }

  const isResult = phase === "result" || phase === "done";
  const captainMotion: TargetAndTransition =
    isResult && wasCorrect !== null
      ? wasCorrect
        ? SUCCESS_MOTION[event.kind]
        : FAIL_MOTION[event.kind]
      : phase === "approach"
        ? { x: [-120, 0], y: [0, -6, 0] }
        : { y: [0, -5, 0] };

  const captainTransition: Transition =
    isResult && wasCorrect
      ? { duration: 1.15, ease: [0.22, 1, 0.36, 1] as const }
      : isResult && wasCorrect === false
        ? { duration: 0.85, ease: "easeIn" as const }
        : phase === "approach"
          ? { duration: 1.35, ease: [0.22, 1, 0.36, 1] as const }
          : { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const };

  const statusBadge =
    isResult && wasCorrect !== null ? (
      <motion.span
        initial={{ opacity: 0, y: -8, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`rounded-full px-3 py-1 text-xs font-bold shadow-md ${
          wasCorrect ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
        }`}
      >
        {wasCorrect ? "Captain clears it!" : "Regroup and retry"}
      </motion.span>
    ) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.12fr_1fr] lg:items-center">
      <TrailSceneShell theme={locationTheme} eventLabel={event.label} statusBadge={statusBadge}>
        <div className="flex h-full items-end justify-between px-6 pb-7 sm:px-10 sm:pb-8">
          <motion.div
            className="relative z-10"
            animate={captainMotion}
            transition={captainTransition}
          >
            <CaptainMascot
              mood={captainMood}
              outfit="athlete"
              size={128}
              pulse={phase === "approach"}
              label={`Captain 21 at ${event.label}`}
            />
            <SuccessBurst show={isResult && wasCorrect === true} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="relative z-10 mb-2"
          >
            <TrailObstacle kind={event.kind} />
            {event.kind === "javelin" && isResult && wasCorrect && (
              <motion.div
                className="absolute -right-8 top-2 h-1 w-24 origin-left rounded-full bg-brand-ink/70"
                initial={{ scaleX: 0, rotate: -12 }}
                animate={{ scaleX: 1, x: 80, y: -24, rotate: -8 }}
                transition={{ duration: 0.75, delay: 0.15 }}
                aria-hidden
              />
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {phase === "approach" && (
            <motion.p
              key="approach-copy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-brand-ink/55"
            >
              Captain 21 is warming up for {event.label}…
            </motion.p>
          )}
        </AnimatePresence>
      </TrailSceneShell>

      <div className="flex justify-center">
        {phase === "approach" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl text-center text-sm text-brand-ink/55"
          >
            Watch Captain 21 line up — then make your move.
          </motion.div>
        ) : (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="w-full max-w-xl"
          >
            <QuestionCard
              question={event.question}
              selectedOptionId={selectedOptionId}
              revealed={phase === "revealed" || phase === "result" || phase === "done"}
              showHint={phase === "question"}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
