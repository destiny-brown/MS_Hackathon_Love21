"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MythFactQuizCard, QuizResultBadge } from "@/components/learn/myth-fact-quiz-card";
import { MythFactPlayMore } from "@/components/learn/myth-fact-play-more";
import { RelatedStories } from "@/components/learn/related-stories";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { getQuizRelatedStories, type QuizAnswer } from "@/lib/learn-quiz-data";
import { useTranslatedQuizQuestions } from "@/lib/i18n/translated-data";
import type { MediaPost } from "@/lib/media-stories";
import { getStoriesBySlugs } from "@/lib/media-stories";
import { useTranslation } from "react-i18next";

type QuizPhase = "intro" | "playing" | "finished";

export default function MythVsFactQuizPage() {
  const { t } = useTranslation(["learn", "pages"]);
  const questions = useTranslatedQuizQuestions();
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<QuizAnswer | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedStorySlugs, setUsedStorySlugs] = useState<Set<string>>(new Set());
  const [relatedStory, setRelatedStory] = useState<MediaPost | null>(null);

  const question = questions[currentIndex];
  const total = questions.length;

  const questionStories = useMemo(
    () => (relatedStory ? [relatedStory] : []),
    [relatedStory],
  );

  const finishStories = useMemo(
    () =>
      getStoriesBySlugs([
        "purposeful-employment",
        "hbr-neurodiversity-competitive-advantage",
      ]),
    [],
  );

  function startQuiz() {
    setPhase("playing");
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setRevealed(false);
    setUsedStorySlugs(new Set());
    setRelatedStory(null);
  }

  function chooseAnswer(answer: QuizAnswer) {
    if (revealed || !question) return;
    setSelected(answer);
    setRevealed(true);
    if (answer === question.answer) {
      setScore((s) => s + 1);
    }
    const stories = getQuizRelatedStories(question, 1, usedStorySlugs);
    if (stories[0]) {
      setRelatedStory(stories[0]);
      setUsedStorySlugs((prev) => new Set(prev).add(stories[0].slug));
    }
  }

  function nextQuestion() {
    if (currentIndex + 1 >= total) {
      setPhase("finished");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    setRelatedStory(null);
  }

  function getScoreMessage(): string {
    const pct = Math.round((score / total) * 100);
    if (pct >= 90) return t("learn:ui.scoreOutstanding", { defaultValue: "Outstanding! You are challenging myths and spreading accurate understanding." });
    if (pct >= 70) return t("learn:ui.scoreGreatLong", { defaultValue: "Great work! You have a solid grasp of neurodiversity facts." });
    if (pct >= 50) return t("learn:ui.scoreGoodLong", { defaultValue: "Good effort — every question helps bust harmful myths." });
    return t("learn:ui.scoreKeepLong", { defaultValue: "Every question is a chance to learn. Try again to improve!" });
  }

  return (
    <SiteLayout>
      <PageHero
        title={t("pages:learnPlay.quiz.title")}
        subtitle={t("pages:learnPlay.quiz.description")}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← {t("learn:ui.backToLearn")}
            </Link>
          </div>

          {phase === "intro" && (
            <div className="overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm">
              <div className="border-b border-brand-sand bg-brand-cream/50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">{t("learn:ui.howItWorks")}</p>
                <p className="mt-1 font-serif-display text-2xl text-brand-ink">
                  {t("learn:ui.factCheckClaims", { count: total, defaultValue: `Fact-check ${total} common claims` })}
                </p>
              </div>
              <div className="space-y-3 p-5 sm:p-6">
                <p className="text-brand-ink/75">
                  Each card shows a <strong>common claim</strong> you might hear online or in conversation. Tap{" "}
                  <strong>Myth</strong> or <strong>Fact</strong>, then see whether you got it right.
                </p>
                <ul className="space-y-2 text-sm text-brand-ink/70">
                  <li className="flex gap-2">
                    <span className="text-brand-coral">✗</span> Myth — a common misconception
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-sea">✓</span> Fact — supported by evidence
                  </li>
                </ul>
                <Button className="mt-2 w-full sm:w-auto" onClick={startQuiz}>
                  {t("learn:ui.startFactChecking", { defaultValue: "Start fact-checking" })}
                </Button>
                <MythFactPlayMore variant="quiz-to-daily" />
              </div>
            </div>
          )}

          {phase === "playing" && question && (
            <MythFactQuizCard
              claim={question}
              headerLabel={`Question ${currentIndex + 1} of ${total}`}
              badgeLabel={question.topic}
              progressPercent={((currentIndex + 1) / total) * 100}
              selected={selected}
              revealed={revealed}
              onSelect={chooseAnswer}
            >
              {relatedStory && (
                <RelatedStories
                  stories={questionStories}
                  title="Go deeper"
                  subtitle="This article directly connects to the claim you just fact-checked."
                />
              )}
              <Button className="mt-4 w-full sm:w-auto" onClick={nextQuestion}>
                {currentIndex + 1 >= total ? t("learn:ui.seeResults") : t("learn:ui.nextClaim", { defaultValue: "Next claim" })}
              </Button>
            </MythFactQuizCard>
          )}

          {phase === "finished" && (
            <div className="rounded-2xl border border-brand-sand bg-white p-6 text-center shadow-sm sm:p-8">
              <QuizResultBadge score={score} total={total} />
              <p className="mt-4 text-brand-ink/75">{getScoreMessage()}</p>
              <RelatedStories stories={finishStories} />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <Button onClick={startQuiz}>{t("learn:ui.tryAgain")}</Button>
                <Button variant="outline" asChild>
                  <Link href="/learn-play/resources">{t("pages:learnPlay.resources.title")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/learn-play/21-moves">{t("pages:learnPlay.moves.title")}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
