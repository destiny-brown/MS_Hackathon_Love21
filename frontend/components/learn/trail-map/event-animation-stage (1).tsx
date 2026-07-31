"use client";

import { useEffect, useState } from "react";

import { ConfettiBurst } from "@/components/learn/trail-map/confetti-burst";
import { QuestionCard } from "@/components/learn/trail-map/question-card";
import { sceneGridStyle } from "@/components/learn/trail-map/scene-theme";
import type { DayEvent, EventKind, LocationTheme } from "@/lib/day-locations-data";

type Phase = "approach" | "question" | "revealed" | "result" | "done";

interface EventAnimationStageProps {
  event: DayEvent;
  locationTheme?: LocationTheme;
  /** First name entered on the welcome screen. Optional so the stage still
   *  reads fine for anyone who skipped the name gate. */
  crewName?: string | null;
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

const SHADOW_CLASS: Record<EventKind, string> = {
  hurdle: "anim-shadow-hop",
  "hurdle-final": "anim-shadow-hop",
  javelin: "anim-shadow-hop",
  longjump: "anim-shadow-hop",
  polevault: "anim-shadow-vault",
  dragonboat: "anim-shadow-hop",
  generic: "anim-shadow-hop",
};

/** Per-sport frozen pose, struck the instant the athlete stops for the question — this is what makes
 *  each event actually read as its own sport instead of one generic leap. */
const FROZEN_POSE: Record<EventKind, { frontLeg: string; backLeg: string; frontArm: string; backArm: string }> = {
  hurdle: {
    frontLeg: "rotate(-52deg)", // leading leg driven straight out over the bar
    backLeg: "rotate(70deg)", // trail leg tucked and rotated out
    frontArm: "rotate(-60deg)",
    backArm: "rotate(70deg)",
  },
  "hurdle-final": {
    frontLeg: "rotate(-52deg)",
    backLeg: "rotate(70deg)",
    frontArm: "rotate(-60deg)",
    backArm: "rotate(70deg)",
  },
  javelin: {
    frontLeg: "rotate(-18deg)", // planted front leg, blocking
    backLeg: "rotate(30deg)",
    frontArm: "rotate(-40deg)", // guide arm forward
    backArm: "rotate(-150deg)", // throwing arm cocked back behind the head
  },
  longjump: {
    frontLeg: "rotate(-40deg)", // hitch-kick, knees driven up
    backLeg: "rotate(-55deg)",
    frontArm: "rotate(-110deg)", // both arms up for lift/balance
    backArm: "rotate(110deg)",
  },
  polevault: {
    frontLeg: "rotate(20deg)",
    backLeg: "rotate(-10deg)",
    frontArm: "rotate(-95deg)", // pole planted, arms extended overhead
    backArm: "rotate(-70deg)",
  },
  dragonboat: { frontLeg: "rotate(0deg)", backLeg: "rotate(0deg)", frontArm: "rotate(0deg)", backArm: "rotate(0deg)" },
  generic: {
    frontLeg: "rotate(-35deg)",
    backLeg: "rotate(50deg)",
    frontArm: "rotate(-70deg)",
    backArm: "rotate(80deg)",
  },
};

/** One shared SVG rig reused across every event, re-posed per sport via CSS transforms.
 *  Left completely unchanged from the original — only the scene *around* it moves now. */
function AthleteFigure({ kind, running, frozen }: { kind: EventKind; running: boolean; frozen: boolean }) {
  const pose = FROZEN_POSE[kind];
  return (
    <svg viewBox="0 0 60 90" width="60" height="90" className={running ? "is-running" : ""} aria-hidden>
      <g className="torso-group">
        <circle cx="30" cy="14" r="10" fill="#1f2933" />
        <rect x="24" y="24" width="12" height="30" rx="6" fill="#e8543e" />

        <rect
          x="18"
          y="50"
          width="8"
          height="28"
          rx="4"
          fill="#1f2933"
          className="leg-front"
          transform={frozen ? pose.frontLeg : undefined}
          style={{ transformOrigin: "22px 50px" }}
        />
        <rect
          x="32"
          y="50"
          width="8"
          height="28"
          rx="4"
          fill="#1f2933"
          className="leg-back"
          transform={frozen ? pose.backLeg : undefined}
          style={{ transformOrigin: "36px 50px" }}
        />
        <rect
          x="10"
          y="26"
          width="8"
          height="22"
          rx="4"
          fill="#e8543e"
          className="arm-front"
          transform={frozen ? pose.frontArm : "rotate(20deg)"}
          style={{ transformOrigin: "14px 26px" }}
        />
        <rect
          x="42"
          y="26"
          width="8"
          height="22"
          rx="4"
          fill="#e8543e"
          className="arm-back"
          transform={frozen ? pose.backArm : "rotate(-20deg)"}
          style={{ transformOrigin: "46px 26px" }}
        />

        {kind === "javelin" && (
          <line
            x1="46"
            y1="14"
            x2="80"
            y2="4"
            stroke="#f5c34d"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="javelin-prop"
            style={{ transformOrigin: "46px 20px" }}
          />
        )}
        {kind === "polevault" && (
          <line x1="10" y1="60" x2="-14" y2="4" stroke="#8a5a2b" strokeWidth="3" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}

function ObstacleProp({ kind }: { kind: EventKind }) {
  if (kind === "javelin" || kind === "polevault") return null; // these are held, not a floor obstacle
  return (
    <div className="flex h-16 w-10 items-end justify-center text-3xl sm:h-20 sm:w-14 sm:text-4xl" aria-hidden>
      {PROP_ICON[kind]}
    </div>
  );
}

/** A comic-style speech bubble anchored above/beside the athlete, used for the
 *  idle "lining up" beat instead of a plain caption floating in empty space. */
function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="anim-bubble-in absolute -top-3 left-4 max-w-[13rem] -translate-y-full rounded-2xl rounded-bl-sm bg-white/95 px-3 py-2 text-xs font-medium leading-snug text-brand-ink shadow-md sm:max-w-[16rem] sm:text-sm">
      {children}
      <span
        className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 bg-white/95"
        aria-hidden
      />
    </div>
  );
}

/** Micro-interaction reaction that appears beside (never on top of) the
 *  avatar once a result lands — a nod/thumbs-up for a correct answer, a
 *  thinking pose glyph for a miss — plus a few drifting sparkles on success. */
function ReactionBurst({ correct }: { correct: boolean }) {
  const sparkles = [
    { sx: "18px", sy: "-26px", delay: "0ms" },
    { sx: "-4px", sy: "-30px", delay: "90ms" },
    { sx: "10px", sy: "-16px", delay: "160ms" },
  ];
  return (
    <div className="pointer-events-none absolute -right-2 -top-4" aria-hidden>
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

export function EventAnimationStage({ event, locationTheme, crewName, onEventComplete }: EventAnimationStageProps) {
  const [phase, setPhase] = useState<Phase>("approach");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // reset whenever a new event is mounted
  useEffect(() => {
    setPhase("approach");
    setSelectedOptionId(null);
    setWasCorrect(null);
  }, [event.id]);

  // the athlete approaches, then freezes mid-motion (in a sport-specific pose) and the question appears
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
  const isRunning = phase === "approach";
  const isFlying = phase === "result";
  const showCelebration = phase === "result" && wasCorrect === true;
  const showWrongCue = phase === "result" && wasCorrect === false;
  const partnerTag = crewName ? `& ${crewName} ` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      {/* animation scene */}
      <div
        key={`${event.id}-${phase === "approach" ? "approach" : "set"}`}
        className={`anim-scene-settle relative flex h-56 items-end overflow-hidden rounded-2xl border border-brand-sand bg-gradient-to-b from-white to-brand-cream/60 px-6 pb-6 sm:h-64 ${
          showWrongCue ? "anim-wrong-shake" : ""
        }`}
        style={sceneGridStyle(locationTheme)}
      >
        <div className="trail-scene-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        {showCelebration && <div className="anim-correct-flash pointer-events-none absolute inset-0 bg-emerald-300" aria-hidden />}

        <div className="absolute bottom-6 left-0 right-0 h-1 bg-brand-sand" aria-hidden />

        <div className="relative flex w-full items-end justify-between">
          <div className="relative">
            {phase === "approach" && (
              <SpeechBubble>
                Captain 21 {partnerTag}
                {partnerTag ? "are" : "is"} lining up for <strong>{event.label}</strong>…
              </SpeechBubble>
            )}

            {/* ground shadow, choreographed to the same beat as the figure */}
            <div
              className={`absolute -bottom-1 left-1 h-2 w-11 rounded-full bg-brand-ink/40 ${
                isFlying ? (wasCorrect ? SHADOW_CLASS[event.kind] : "anim-shadow-stumble") : "anim-shadow-idle"
              }`}
              aria-hidden
            />
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
              <AthleteFigure kind={event.kind} running={isRunning} frozen={isFrozen} />
            </div>
            {showWrongCue && <span className="anim-dust-puff absolute -bottom-1 left-6 text-lg">💨</span>}
            {phase === "result" && wasCorrect !== null && <ReactionBurst correct={wasCorrect} />}
          </div>
          <ObstacleProp kind={event.kind} />
        </div>

        {showCelebration && <ConfettiBurst />}

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink shadow-sm">
          {event.label}
        </div>

        {phase === "result" && wasCorrect !== null && (
          <div
            className={`anim-badge-pop absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
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
          <div className="anim-bubble-in flex max-w-xl items-center gap-2 rounded-2xl border border-dashed border-brand-sand/80 bg-white/50 px-4 py-3 text-center text-sm text-brand-ink/50">
            <span className="anim-runner-idle inline-block">🧭</span>
            A challenge is materializing…
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