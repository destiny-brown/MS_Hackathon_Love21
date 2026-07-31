"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DailyMythFooter } from "@/components/learn/daily-myth-footer";
import { DailyStoryIntro } from "@/components/learn/daily-story-intro";
import { MythFactQuizCard } from "@/components/learn/myth-fact-quiz-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import {
  dailyChallengeToClaim,
  getDailyChallenge,
  getDailyRelatedStories,
  getDateKey,
  MAX_DAILY_ATTEMPTS,
} from "@/lib/myth-buster-data";
import {
  getOrCreateTodayGame,
  getStreakData,
  submitGuess,
  type DailyGameState,
  type StreakData,
} from "@/lib/myth-buster-storage";
import type { QuizAnswer } from "@/lib/learn-quiz-data";

export default function DailyMythBusterPage() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [game, setGame] = useState<DailyGameState | null>(null);
  const [showHint, setShowHint] = useState(false);

  const challenge = getDailyChallenge();
  const dateKey = getDateKey();
  const attemptsLeft = game ? MAX_DAILY_ATTEMPTS - game.attempts : MAX_DAILY_ATTEMPTS;
  const completed = game?.completed ?? false;
  const wrongGuesses = useMemo(
    () => (game?.guesses.filter((g) => g !== challenge.answer) ?? []) as QuizAnswer[],
    [game, challenge.answer],
  );

  const storyIntro = useMemo(() => getDailyRelatedStories(challenge, 1)[0] ?? null, [challenge]);

  const claim = useMemo(() => {
    const base = dailyChallengeToClaim(challenge);
    if (storyIntro) {
      return { ...base, imageUrl: undefined, imageCredit: undefined };
    }
    return base;
  }, [challenge, storyIntro]);

  const relatedStory = useMemo(() => {
    if (!completed) return null;
    return storyIntro;
  }, [completed, storyIntro]);

  useEffect(() => {
    setStreak(getStreakData());
    setGame(getOrCreateTodayGame());
  }, []);

  function handleGuess(guess: QuizAnswer) {
    if (!game || game.completed) return;
    const updated = submitGuess(guess, challenge.answer);
    setGame(updated);
    setStreak(getStreakData());
    if (!updated.won && updated.attempts < MAX_DAILY_ATTEMPTS) {
      setShowHint(true);
    }
  }

  function formatDate(key: string): string {
    const date = new Date(`${key}T12:00:00`);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  const resultHeadline = completed
    ? game?.won
      ? "Correct! You busted today's myth."
      : `The answer was: ${challenge.answer === "myth" ? "Myth" : "Fact"}`
    : undefined;

  const inlineExtra =
    game && !completed ? (
      <div className="space-y-4">
        <p className="text-center text-sm text-brand-ink/60">
          {attemptsLeft} {attemptsLeft === 1 ? "attempt" : "attempts"} remaining
        </p>

        {showHint && game.attempts > 0 && (
          <div className="rounded-xl border border-brand-sea/30 bg-brand-sea/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-sea">Hint</p>
            <p className="mt-1 text-sm text-brand-ink/75">{challenge.hint}</p>
          </div>
        )}

        {game.guesses.length > 0 && (
          <div className="flex justify-center gap-2">
            {game.guesses.map((g, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full ${
                  g === challenge.answer ? "bg-brand-sea" : "bg-brand-coral"
                }`}
                title={g === challenge.answer ? "Correct" : "Incorrect"}
              />
            ))}
            {Array.from({ length: MAX_DAILY_ATTEMPTS - game.guesses.length }).map((_, i) => (
              <span key={`empty-${i}`} className="h-3 w-3 rounded-full bg-brand-sand" />
            ))}
          </div>
        )}
      </div>
    ) : null;

  return (
    <SiteLayout>
      <PageHero
        title="Daily Myth Buster"
        subtitle="Start with a real community story, then fact-check today's claim."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← Back to Learn
            </Link>
          </div>

          {streak && !completed && (
            <p className="mb-6 text-center text-sm text-brand-ink/65">
              <span className="font-semibold text-brand-coral">{streak.currentStreak}</span> day streak
              <span className="mx-2 text-brand-ink/25">·</span>
              Best{" "}
              <span className="font-semibold text-brand-sea">{streak.longestStreak}</span>
            </p>
          )}

          {storyIntro && !completed && <DailyStoryIntro story={storyIntro} />}

          {game && (
            <MythFactQuizCard
              claim={claim}
              headerLabel={`${formatDate(dateKey)} · Daily #${challenge.id.replace("d", "")}`}
              badgeLabel={challenge.topic ?? "Daily"}
              progressPercent={completed ? 100 : (game.attempts / MAX_DAILY_ATTEMPTS) * 100}
              selected={completed && game.won ? challenge.answer : null}
              revealed={completed}
              revealCorrectAnswer={completed}
              wrongGuesses={wrongGuesses}
              onSelect={handleGuess}
              inlineExtra={inlineExtra}
              resultHeadline={resultHeadline}
            />
          )}

          {streak && (
            <DailyMythFooter
              completed={completed}
              currentStreak={streak.currentStreak}
              longestStreak={streak.longestStreak}
              relatedStory={relatedStory}
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
