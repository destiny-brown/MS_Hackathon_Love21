import Link from "next/link";

type MythFactPlayMoreProps = {
  variant: "daily-to-quiz" | "quiz-to-daily";
};

export function MythFactPlayMore({ variant }: MythFactPlayMoreProps) {
  if (variant === "daily-to-quiz") {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-brand-coral/40 bg-brand-coral/5 p-4 text-center">
        <p className="text-sm font-medium text-brand-ink">Want to play a longer version?</p>
        <p className="mt-1 text-xs text-brand-ink/60">Fact-check 10 claims in the full Myth vs Fact Quiz.</p>
        <Link
          href="/learn-play/quiz"
          className="mt-3 inline-block text-sm font-semibold text-brand-coral hover:underline"
        >
          Play the full quiz →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-dashed border-brand-sea/40 bg-brand-sea/5 p-4 text-center">
      <p className="text-sm font-medium text-brand-ink">Put what you learned into action</p>
      <p className="mt-1 text-xs text-brand-ink/60">Take today&apos;s myth into a practical Love 21 skill mission.</p>
      <Link
        href="/learn-play/21-moves"
        className="mt-3 inline-block text-sm font-semibold text-brand-sea hover:underline"
      >
        Start 21 Moves →
      </Link>
    </div>
  );
}
