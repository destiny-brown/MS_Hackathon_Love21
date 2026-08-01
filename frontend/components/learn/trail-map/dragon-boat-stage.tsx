"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { QuestionCard } from "@/components/learn/trail-map/question-card";
import type { DayEvent } from "@/lib/day-locations-data";

type Phase = "paddling" | "question" | "revealed" | "advancing" | "stalled";

interface DragonBoatStageProps {
  events: DayEvent[];
  legIndex: number;
  progressAtLegStart: number;
  onLegComplete: (correct: boolean) => void;
}

function HarbourWaves({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]" aria-hidden>
      {[0, 1, 2].map((layer) => (
        <motion.div
          key={layer}
          className="absolute inset-x-0 bottom-0 h-full opacity-80"
          style={{
            backgroundImage: `repeating-linear-gradient(100deg, rgba(15,118,158,${0.22 - layer * 0.05}) 0 14px, rgba(255,255,255,${0.12 - layer * 0.03}) 14px 30px)`,
            backgroundSize: `${140 + layer * 30}px 100%`,
          }}
          animate={active ? { backgroundPositionX: ["0px", `${-140 - layer * 30}px`] } : undefined}
          transition={active ? { duration: 2.4 + layer * 0.4, repeat: Infinity, ease: "linear" } : undefined}
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
    </div>
  );
}

function DragonBoatHull({ paddling }: { paddling: boolean }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 180 72" width="180" height="72" className="drop-shadow-lg" aria-hidden>
        <defs>
          <linearGradient id="hull-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8543E" />
            <stop offset="100%" stopColor="#9E2F22" />
          </linearGradient>
        </defs>
        <path d="M10 46 Q90 68 170 46 L160 34 Q90 48 20 34 Z" fill="url(#hull-grad)" stroke="#1A1A1A" strokeWidth="1.2" />
        <path d="M10 46 Q-4 38 6 24 Q14 16 26 24 L22 36 Z" fill="#C73F2C" stroke="#1A1A1A" strokeWidth="1" />
        <path d="M26 24 Q34 18 42 24" fill="none" stroke="#F8F4EB" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="90" cy="40" rx="52" ry="5" fill="#1A1A1A" opacity="0.12" />
        {[44, 72, 100, 128].map((x, index) => (
          <g key={x}>
            <motion.line
              x1={x}
              y1={28}
              x2={x}
              y2={48}
              stroke="#307582"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={paddling ? { rotate: [0, -24, 0] } : { rotate: 0 }}
              transition={paddling ? { duration: 0.55, repeat: Infinity, delay: index * 0.08, ease: "easeInOut" } : undefined}
              style={{ transformOrigin: `${x}px 28px` }}
            />
          </g>
        ))}
      </svg>
      <div className="absolute left-[38%] top-[-18px] -translate-x-1/2">
        <CaptainMascot mood={paddling ? "happy" : "thinking"} outfit="athlete" size={72} label="Captain 21 paddling" />
      </div>
    </div>
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
    const t = setTimeout(() => setPhase("question"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  function handleSelect(optionId: string) {
    if (phase !== "question") return;
    const correct = optionId === event.question.correctOptionId;
    setSelectedOptionId(optionId);
    setWasCorrect(correct);
    setPhase("revealed");

    setTimeout(() => setPhase(correct ? "advancing" : "stalled"), 1700);
    setTimeout(() => onLegComplete(correct), 1700 + 1200);
  }

  const legShare = 1 / events.length;
  const targetProgress = wasCorrect
    ? Math.min(1, progressAtLegStart + legShare)
    : progressAtLegStart + legShare * 0.18;
  const displayProgress = phase === "advancing" || phase === "stalled" ? targetProgress : progressAtLegStart;
  const isFinished = phase === "advancing" && targetProgress >= 1;
  const isMoving = phase === "paddling" || phase === "advancing";

  const statusBadge =
    phase !== "paddling" && phase !== "question" && wasCorrect !== null ? (
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-full px-3 py-1 text-xs font-bold shadow-md ${
          wasCorrect ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
        }`}
      >
        {wasCorrect ? "Full stroke ahead!" : "The crew loses rhythm…"}
      </motion.span>
    ) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.12fr_1fr] lg:items-center">
      <div className="relative h-64 overflow-hidden rounded-2xl border border-brand-sand/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:h-72">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-[#EAF6F2] to-[#7EB8C9]" />

        <motion.div
          className="pointer-events-none absolute left-8 top-8 h-16 w-16 rounded-full bg-amber-200/70 blur-xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.65, 0.85, 0.65] }}
          transition={{ duration: 4, repeat: Infinity }}
          aria-hidden
        />

        <HarbourWaves active={isMoving} />

        <div
          className="absolute right-5 top-0 h-full w-2 bg-[repeating-linear-gradient(0deg,#1f2933_0_10px,#ffffff_10px_20px)] shadow-sm"
          aria-hidden
        />
        <div className="absolute right-7 top-3 rounded-full border border-white/60 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-ink shadow-sm">
          FINISH
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink shadow-sm backdrop-blur-sm">
          {event.label} · Leg {legIndex + 1} of {events.length}
        </div>

        {statusBadge ? <div className="absolute right-4 top-4 z-20">{statusBadge}</div> : null}

        <motion.div
          className="absolute bottom-10 z-10"
          animate={{ left: `calc(4% + ${displayProgress * 74}%)` }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <motion.div
            animate={isMoving ? { y: [0, -5, 0], rotate: [0, -1.5, 0] } : { y: 0, rotate: 0 }}
            transition={isMoving ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
          >
            <DragonBoatHull paddling={isMoving} />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isFinished &&
            ["🎊", "✨", "🎉", "✦", "★"].map((particle, index) => (
              <motion.span
                key={particle}
                className="pointer-events-none absolute text-xl"
                style={{ right: `${10 + index * 4}%`, top: "18%" }}
                initial={{ opacity: 0, y: -8, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], y: [0, 70], rotate: [0, 180], scale: [0.5, 1.1, 0.7] }}
                transition={{ duration: 1.2, delay: index * 0.08 }}
                aria-hidden
              >
                {particle}
              </motion.span>
            ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        {phase === "paddling" ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl text-center text-sm text-brand-ink/55"
          >
            Captain 21 leads the crew toward the next checkpoint…
          </motion.p>
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
              revealed={phase !== "question"}
              showHint={phase === "question"}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
