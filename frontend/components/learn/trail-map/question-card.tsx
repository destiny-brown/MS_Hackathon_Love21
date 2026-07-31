"use client";

import type { DayQuestion } from "@/lib/day-locations-data";

const KICKER_STYLES: Record<DayQuestion["type"], string> = {
  myth: "bg-brand-coral/10 text-brand-coral",
  fact: "bg-brand-sea/10 text-brand-sea",
  situation: "bg-brand-ink/10 text-brand-ink",
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

  return (
    <div className="w-full max-w-xl rounded-2xl border border-brand-sand bg-white/95 p-5 shadow-lg backdrop-blur sm:p-6">
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

          let stateClasses = "border-brand-sand bg-white hover:border-brand-coral text-brand-ink";
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
              {option.label}
            </button>
          );
        })}
      </div>

      {showHint && !revealed && (
        <div className="mt-4 border-l-4 border-brand-sea bg-brand-sea/5 p-3 text-left">
          <p className="text-xs font-semibold uppercase text-brand-sea">Captain&apos;s clue</p>
          <p className="mt-1 text-sm text-brand-ink/70">{question.hint}</p>
        </div>
      )}

      {revealed && (
        <div
          className={`mt-4 rounded-xl border-l-4 p-3 text-left text-sm leading-relaxed ${
            isCorrectSelected ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-rose-400 bg-rose-50 text-rose-900"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide">
            {isCorrectSelected ? "Correct!" : "Not quite"}
          </p>
          <p className="mt-1 text-brand-ink/80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
