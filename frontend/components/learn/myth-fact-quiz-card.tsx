export type MythFactAnswer = "myth" | "fact";

export type MythFactClaim = {
  statement: string;
  answer: MythFactAnswer;
  explanation: string;
  topic?: string;
  imageUrl?: string;
  imageCredit?: string;
  source?: string;
};

const TOPIC_ACCENTS: Record<string, string> = {
  Autism: "bg-brand-sea/15 text-brand-sea",
  "Down Syndrome": "bg-brand-coral/15 text-brand-coral",
  ADHD: "bg-amber-100 text-amber-900",
  "Inclusive Language": "bg-violet-100 text-violet-900",
  Education: "bg-emerald-100 text-emerald-900",
  Sensory: "bg-sky-100 text-sky-900",
  Employment: "bg-teal-100 text-teal-900",
  Family: "bg-rose-100 text-rose-900",
  Daily: "bg-brand-coral/15 text-brand-coral",
};

type MythFactChoiceProps = {
  choice: MythFactAnswer;
  disabled: boolean;
  revealed: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  isWrongGuess: boolean;
  onSelect: (choice: MythFactAnswer) => void;
};

function MythFactChoice({
  choice,
  disabled,
  revealed,
  isCorrect,
  isSelected,
  isWrongGuess,
  onSelect,
}: MythFactChoiceProps) {
  const isMyth = choice === "myth";
  const base =
    "flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-lg font-semibold transition sm:min-h-[4rem]";

  let style =
    "border-brand-sand bg-white text-brand-ink hover:border-brand-coral hover:bg-brand-coral/5 active:scale-[0.98]";

  if (revealed && isCorrect) {
    style = isMyth
      ? "border-brand-coral bg-brand-coral text-white shadow-md"
      : "border-brand-sea bg-brand-sea text-white shadow-md";
  } else if ((revealed && isSelected && !isCorrect) || isWrongGuess) {
    style = "border-brand-sand bg-brand-sand/40 text-brand-ink/50 line-through";
  } else if (revealed) {
    style = "border-brand-sand bg-white text-brand-ink/40";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(choice)}
      className={`${base} ${style}`}
      aria-pressed={isSelected || isWrongGuess}
    >
      <span className="text-xl" aria-hidden="true">
        {isMyth ? "✗" : "✓"}
      </span>
      <span className="capitalize">{choice}</span>
    </button>
  );
}

type MythFactQuizCardProps = {
  claim: MythFactClaim;
  headerLabel: string;
  badgeLabel?: string;
  /** 0–100; omit to hide the progress bar */
  progressPercent?: number;
  selected: MythFactAnswer | null;
  revealed: boolean;
  onSelect: (choice: MythFactAnswer) => void;
  /** Wrong picks before the answer is revealed (daily mode) */
  wrongGuesses?: MythFactAnswer[];
  /** Highlight the correct answer when revealed (daily loss or completion) */
  revealCorrectAnswer?: boolean;
  /** Shown below the claim, before choices (hints, attempt counter) */
  inlineExtra?: React.ReactNode;
  /** Overrides the default reveal headline */
  resultHeadline?: string;
  children?: React.ReactNode;
};

export function MythFactQuizCard({
  claim,
  headerLabel,
  badgeLabel,
  progressPercent,
  selected,
  revealed,
  onSelect,
  wrongGuesses = [],
  revealCorrectAnswer = false,
  inlineExtra,
  resultHeadline,
  children,
}: MythFactQuizCardProps) {
  const topicClass = TOPIC_ACCENTS[claim.topic ?? "Daily"] ?? "bg-brand-sand text-brand-ink";
  const userCorrect = selected === claim.answer;
  const stampCorrect = revealed && userCorrect;
  const stampWrong = revealed && !userCorrect && selected !== null;
  const stampRevealAnswer = revealed && revealCorrectAnswer && !userCorrect;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-sand bg-brand-cream/50 px-4 py-3 sm:px-6">
        <span className="text-sm font-medium text-brand-ink/70">{headerLabel}</span>
        {badgeLabel ? (
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${topicClass}`}>{badgeLabel}</span>
        ) : null}
      </div>

      {progressPercent !== undefined ? (
        <div className="h-1 bg-brand-sand">
          <div
            className="h-full bg-brand-coral transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      ) : null}

      <div className="p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-xl border border-brand-sand bg-brand-cream/30">
          {claim.imageUrl ? (
            <div className="border-b border-brand-sand">
              <img
                src={claim.imageUrl}
                alt=""
                className="aspect-[2/1] w-full object-cover sm:aspect-[21/9]"
              />
            </div>
          ) : null}

          <div className="relative p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-ink text-xs font-bold text-white">
                ?
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">Common claim</p>
                <p className="text-xs text-brand-ink/45">Is this a myth or a fact?</p>
              </div>
            </div>

            <p className="font-serif-display text-xl leading-snug text-brand-ink sm:text-2xl">
              &ldquo;{claim.statement}&rdquo;
            </p>

            {(stampCorrect || stampWrong || stampRevealAnswer) && (
              <div
                className={`pointer-events-none absolute right-3 top-3 rotate-[-12deg] rounded border-2 px-3 py-1 text-sm font-black tracking-wider motion-safe:animate-[stamp_0.35s_ease-out] ${
                  stampCorrect || stampRevealAnswer
                    ? "border-brand-sea bg-brand-sea/10 text-brand-sea"
                    : "border-brand-coral bg-brand-coral/10 text-brand-coral"
                }`}
                aria-hidden="true"
              >
                {stampCorrect
                  ? claim.answer === "myth"
                    ? "MYTH BUSTED"
                    : "CORRECT"
                  : stampRevealAnswer
                    ? claim.answer === "myth"
                      ? "MYTH"
                      : "FACT"
                    : "NOT QUITE"}
              </div>
            )}
          </div>
        </div>

        {inlineExtra && !revealed ? <div className="mt-4">{inlineExtra}</div> : null}

        <div
          className={`mt-5 grid gap-3 ${revealed ? "sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
          role="group"
          aria-label="Choose myth or fact"
        >
          <MythFactChoice
            choice="myth"
            disabled={revealed}
            revealed={revealed}
            isCorrect={claim.answer === "myth"}
            isSelected={selected === "myth" || (revealed && revealCorrectAnswer && claim.answer === "myth")}
            isWrongGuess={
              wrongGuesses.includes("myth") && claim.answer !== "myth"
            }
            onSelect={onSelect}
          />
          <MythFactChoice
            choice="fact"
            disabled={revealed}
            revealed={revealed}
            isCorrect={claim.answer === "fact"}
            isSelected={selected === "fact" || (revealed && revealCorrectAnswer && claim.answer === "fact")}
            isWrongGuess={
              wrongGuesses.includes("fact") && claim.answer !== "fact"
            }
            onSelect={onSelect}
          />
        </div>

        {revealed && (
          <div
            className="mt-5 rounded-xl border border-brand-sand bg-white p-4 motion-safe:animate-[fadeUp_0.3s_ease-out]"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-semibold text-brand-ink">
              {resultHeadline ??
                (userCorrect ? "That's right!" : `It's actually a ${claim.answer}.`)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">{claim.explanation}</p>
            {claim.source ? (
              <p className="mt-2 text-[11px] text-brand-ink/45">Source: {claim.source}</p>
            ) : null}
            {claim.imageCredit ? (
              <p className="mt-2 text-[11px] text-brand-ink/45">Photo: {claim.imageCredit}</p>
            ) : null}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizResultBadge({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  let title = "Still Learning";
  let stamp = "KEEP GOING";

  if (pct >= 90) {
    title = "Neurodiversity Champion";
    stamp = "CHAMPION";
  } else if (pct >= 70) {
    title = "Fact Finder";
    stamp = "FACT FINDER";
  } else if (pct >= 50) {
    title = "Myth Buster";
    stamp = "MYTH BUSTER";
  }

  return (
    <div className="relative inline-block">
      <p className="font-serif-display text-5xl text-brand-ink">
        {score} / {total}
      </p>
      <span className="absolute -right-2 -top-2 rotate-12 rounded border-2 border-brand-coral bg-brand-coral/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-brand-coral">
        {stamp}
      </span>
      <p className="mt-2 text-lg font-semibold text-brand-sea">{title}</p>
    </div>
  );
}
