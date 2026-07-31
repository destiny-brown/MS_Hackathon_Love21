"use client";

import type { DayQuestion } from "@/lib/day-locations-data";

const KICKER_STYLES: Record<DayQuestion["type"], string> = {
  myth: "bg-brand-coral/10 text-brand-coral",
  fact: "bg-brand-sea/10 text-brand-sea",
  situation: "bg-brand-ink/10 text-brand-ink",
};

// Same accent family as KICKER_STYLES, used for the panel's outer glow ring so
// the "holographic panel" reads as belonging to the question type at a glance.
const GLOW_RING: Record<DayQuestion["type"], string> = {
  myth: "shadow-[0_0_0_1px_rgba(232,84,62,0.25),0_18px_40px_-12px_rgba(232,84,62,0.35)]",
  fact: "shadow-[0_0_0_1px_rgba(15,118,158,0.25),0_18px_40px_-12px_rgba(15,118,158,0.35)]",
  situation: "shadow-[0_0_0_1px_rgba(31,41,51,0.18),0_18px_40px_-12px_rgba(31,41,51,0.3)]",
};

interface QuestionCardProps {
  question: DayQuestion;
  /** null = not yet answered */
  selectedOptionId: string | null;
  /** true once the user has locked in an answer for this question */
  revealed: boolean;
  showHint: boolean;
  onSelect: (optionId: string) => void;
}

export function QuestionCard({ question, selectedOptionId, revealed, showHint, onSelect }: QuestionCardProps) {
  const isCorrectSelected = selectedOptionId === question.correctOptionId;
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);

  return (
    // The "floating holo panel" — glassy, glowing, and slides/bounces in on
    // mount rather than just appearing, so each new question feels like it's
    // being conjured into the scene rather than swapped in place.
    <div
      className={`anim-panel-in relative w-full max-w-xl overflow-hidden rounded-2xl border bg-white/80 p-5 backdrop-blur-md transition-colors sm:p-6 ${GLOW_RING[question.type]} ${
        revealed && isCorrectSelected
          ? "border-emerald-400"
          : revealed && !isCorrectSelected
            ? "border-rose-300"
            : "border-white/70"
      }`}
    >
      {/* faint shimmer sweep across the glass, like a hologram catching light */}
      <div className="anim-holo-shimmer pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${KICKER_STYLES[question.type]}`}>
          {question.kicker}
        </span>

        <p className="mt-3 text-lg font-semibold leading-snug text-brand-ink sm:text-xl">
          {question.type === "myth" ? `\u201C${question.prompt}\u201D` : question.prompt}
        </p>

        <div className={`mt-4 grid gap-2 ${question.options.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === question.correctOptionId;

            let stateClasses = "border-brand-sand bg-white/90 hover:border-brand-coral text-brand-ink";
            if (revealed && isCorrectOption) {
              stateClasses = "border-emerald-500 bg-emerald-50 text-emerald-800";
            } else if (revealed && isSelected && !isCorrectOption) {
              stateClasses = "border-rose-400 bg-rose-50 text-rose-700";
            } else if (isSelected) {
              stateClasses = "border-brand-coral bg-brand-coral/10 text-brand-ink";
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={revealed}
                onClick={() => onSelect(option.id)}
                className={`min-h-[2.75rem] rounded-xl border px-4 py-2 text-left text-sm font-semibold transition disabled:cursor-default ${stateClasses}`}
              >
                <span className="mr-1.5">
                  {revealed && isCorrectOption ? "✅" : revealed && isSelected && !isCorrectOption ? "❌" : ""}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>

        {showHint && !revealed && (
          <div className="anim-bubble-in mt-4 border-l-4 border-brand-sea bg-brand-sea/5 p-3 text-left">
            <p className="text-xs font-semibold uppercase text-brand-sea">Captain&apos;s clue</p>
            <p className="mt-1 text-sm text-brand-ink/70">{question.hint}</p>
          </div>
        )}

        {revealed && isCorrectSelected && (
          <div className="anim-badge-pop mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-3 text-left text-sm leading-relaxed text-emerald-900">
            <p className="text-xs font-semibold uppercase tracking-wide">Correct! 🎉</p>
            <p className="mt-1 text-brand-ink/80">{question.explanation}</p>
          </div>
        )}

        {revealed && !isCorrectSelected && (
          <div className="mt-4 space-y-2">
            <div className="anim-badge-pop rounded-xl border-l-4 border-rose-400 bg-rose-50 p-3 text-left text-sm leading-relaxed text-rose-900">
              <p className="text-xs font-semibold uppercase tracking-wide">Why &ldquo;{selectedOption?.label}&rdquo; isn&apos;t it</p>
              <p className="mt-1 text-brand-ink/80">
                {question.type === "myth"
                  ? question.explanation
                  : `That's a common assumption, but it misses the mark here — ${question.explanation.charAt(0).toLowerCase()}${question.explanation.slice(1)}`}
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-3 text-left text-sm leading-relaxed text-emerald-900">
              <p className="text-xs font-semibold uppercase tracking-wide">The right answer: {correctOption?.label}</p>
              <p className="mt-1 text-brand-ink/80">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}