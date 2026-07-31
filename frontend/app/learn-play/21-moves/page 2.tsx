"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CaptainRelay } from "@/components/learn/trail-map/captain-relay";
import { TrailMapBoard } from "@/components/learn/trail-map/trail-map-board";
import { TrailUnlocksPanel } from "@/components/learn/trail-map/trail-unlocks-panel";
import { CaptainMascot } from "@/components/learn/captain-mascot";
import { MythFactQuizCard } from "@/components/learn/myth-fact-quiz-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { captainMeta, captainOutfits, getCaptainOutfit } from "@/lib/captain-character";
import {
  dailyChallengeToClaim,
  getDailyChallenge,
  getDailyRelatedStories,
  MAX_DAILY_ATTEMPTS,
} from "@/lib/myth-buster-data";
import {
  getOrCreateTodayGame,
  getStreakData,
  submitGuess,
  type DailyGameState,
} from "@/lib/myth-buster-storage";
import type { QuizAnswer } from "@/lib/learn-quiz-data";
import { getStoryBySlug } from "@/lib/media-stories";
import { learnerRoles, type LearnerRole } from "@/lib/skill-missions";
import {
  getActiveCosmetic,
  getTrailProgress,
  setCaptainName,
  type TrailProgress,
} from "@/lib/trail-map-storage";

type JourneyStage = "discover" | "decide" | "understand" | "move" | "grow";

const journeyStages: { id: JourneyStage; label: string; description: string }[] = [
  { id: "discover", label: "Discover", description: "Meet today's claim" },
  { id: "decide", label: "Decide", description: "Choose myth or fact" },
  { id: "understand", label: "Understand", description: "Learn from evidence" },
  { id: "move", label: "Move", description: "Take on the mission" },
  { id: "grow", label: "Grow", description: "Unlock the trail" },
];

export default function TwentyOneMovesPage() {
  const [progress, setProgress] = useState<TrailProgress | null>(null);
  const [activeStopOrder, setActiveStopOrder] = useState(0);
  const [captainDraft, setCaptainDraft] = useState("");
  const [journeyStage, setJourneyStage] = useState<JourneyStage>("discover");
  const [mythGame, setMythGame] = useState<DailyGameState | null>(null);
  const [mythStreak, setMythStreak] = useState(0);
  const [learnerRole, setLearnerRole] = useState<LearnerRole>("volunteer");

  const challenge = getDailyChallenge();
  const claim = useMemo(() => dailyChallengeToClaim(challenge), [challenge]);
  const relatedStory = useMemo(
    () => getDailyRelatedStories(challenge, 1)[0] ?? getStoryBySlug("purposeful-employment") ?? null,
    [challenge],
  );
  const mythCompletedToday = mythGame?.completed ?? false;
  const mythWonToday = mythGame?.won ?? false;
  const attemptsLeft = mythGame ? MAX_DAILY_ATTEMPTS - mythGame.attempts : MAX_DAILY_ATTEMPTS;
  const wrongGuesses = useMemo(
    () => (mythGame?.guesses.filter((guess) => guess !== challenge.answer) ?? []) as QuizAnswer[],
    [challenge.answer, mythGame],
  );

  useEffect(() => {
    const trail = getTrailProgress();
    setProgress(trail);
    setCaptainDraft(trail.captainName);

    const streakData = getStreakData();
    setMythStreak(streakData.currentStreak);
    const game = getOrCreateTodayGame();
    setMythGame(game);
    if (game.completed) setJourneyStage("understand");

    const savedRole = window.localStorage.getItem("love21_learner_role");
    if (savedRole && savedRole in learnerRoles) setLearnerRole(savedRole as LearnerRole);
  }, []);

  function chooseLearnerRole(role: LearnerRole) {
    setLearnerRole(role);
    window.localStorage.setItem("love21_learner_role", role);
  }

  function saveCaptainName() {
    const updated = setCaptainName(captainDraft);
    setProgress(updated);
  }

  function handleGuess(guess: QuizAnswer) {
    if (!mythGame || mythGame.completed) return;
    const updated = submitGuess(guess, challenge.answer);
    setMythGame(updated);
    setMythStreak(getStreakData().currentStreak);
    if (updated.completed) setJourneyStage("understand");
  }

  if (!progress) {
    return (
      <SiteLayout>
        <PageHero title="21 Moves" subtitle="Loading your trail…" />
      </SiteLayout>
    );
  }

  const cosmetic = getActiveCosmetic(progress);
  const activeStageIndex = journeyStages.findIndex((stage) => stage.id === journeyStage);

  return (
    <SiteLayout>
      <PageHero
        title="21 Moves"
        subtitle="Bust one myth, understand one real story, and make one move for inclusion with Captain 21."
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← Back to Learn
            </Link>
            <div className="flex flex-wrap gap-3 text-sm text-brand-ink/65">
              {progress.currentStreak > 0 && (
                <span className="rounded-full bg-brand-cream px-3 py-1">
                  Trail streak: <strong className="text-brand-ink">{progress.currentStreak}</strong>
                </span>
              )}
              {mythStreak > 0 && (
                <span className="rounded-full bg-brand-cream px-3 py-1">
                  Learning streak: <strong className="text-brand-ink">{mythStreak}</strong>
                </span>
              )}
            </div>
          </div>

          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Today's 21 Moves journey">
            {journeyStages.map((stage, index) => {
              const isActive = stage.id === journeyStage;
              const isComplete = index < activeStageIndex;
              return (
                <li
                  key={stage.id}
                  className={`min-h-[5rem] border-l-4 px-3 py-2 ${
                    isActive
                      ? "border-brand-coral bg-brand-coral/5"
                      : isComplete
                        ? "border-brand-sea bg-brand-sea/5"
                        : "border-brand-sand bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-brand-ink/45">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-1 font-semibold text-brand-ink">{stage.label}</p>
                  <p className="mt-0.5 text-xs text-brand-ink/55">{stage.description}</p>
                </li>
              );
            })}
          </ol>

          <div className="overflow-hidden border border-brand-sand bg-white shadow-sm">
            <div className="grid items-center gap-6 bg-brand-ink px-5 py-6 text-white sm:grid-cols-[9rem_1fr] sm:px-8">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-brand-cream/10 ring-1 ring-white/15">
                <CaptainMascot
                  mood={journeyStage === "understand" || journeyStage === "grow" ? "happy" : journeyStage === "decide" ? "thinking" : "idle"}
                  outfit={getCaptainOutfit(progress.badges)}
                  cosmetic={cosmetic}
                  size={132}
                  label={captainMeta.fullName}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">
                  {journeyStage === "discover" && "Captain 21 has today's claim"}
                  {journeyStage === "decide" && "Captain 21 needs your call"}
                  {journeyStage === "understand" && "Captain 21 checks the evidence"}
                  {(journeyStage === "move" || journeyStage === "grow") && `${progress.captainName}'s mission`}
                </p>
                <h2 className="mt-2 font-serif-display text-3xl leading-tight sm:text-4xl">
                  {journeyStage === "discover" || journeyStage === "decide"
                    ? `“${challenge.statement}”`
                    : journeyStage === "understand"
                      ? mythWonToday
                        ? "Myth busted. Now make it matter."
                        : "The evidence gives us our next move."
                      : "Carry what you learned onto the trail."}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  {journeyStage === "discover" && "Pause, notice your first reaction, then decide whether this common claim is supported by evidence."}
                  {journeyStage === "decide" && "You have three attempts. A missed answer unlocks another chance to think it through."}
                  {journeyStage === "understand" && "Read the verified explanation and meet the people whose abilities challenge the myth."}
                  {(journeyStage === "move" || journeyStage === "grow") && "Make practical inclusion choices to transform each scene and help Captain 21 jump to the next Hong Kong stop."}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              {journeyStage === "discover" && (
                <div>
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-sea">Discover</p>
                    <p className="mt-2 text-brand-ink/70">
                      Today&apos;s move begins by questioning a claim that can shape how people are treated at school,
                      at work, and in the community.
                    </p>
                  </div>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold text-brand-ink">Make today&apos;s skill relevant to you</legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-5">
                      {(Object.entries(learnerRoles) as [LearnerRole, (typeof learnerRoles)[LearnerRole]][]).map(
                        ([role, meta]) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => chooseLearnerRole(role)}
                            aria-pressed={learnerRole === role}
                            className={`min-h-[3.5rem] border px-3 py-2 text-sm font-semibold transition ${
                              learnerRole === role
                                ? "border-brand-coral bg-brand-coral text-white"
                                : "border-brand-sand bg-white text-brand-ink hover:border-brand-coral"
                            }`}
                          >
                            {meta.label}
                          </button>
                        ),
                      )}
                    </div>
                  </fieldset>
                  <button
                    type="button"
                    onClick={() => setJourneyStage("decide")}
                    className="mt-6 bg-brand-coral px-6 py-3 text-sm font-semibold text-white hover:bg-brand-ink"
                  >
                    Make your call
                  </button>
                </div>
              )}

              {journeyStage === "decide" && mythGame && (
                <MythFactQuizCard
                  claim={claim}
                  headerLabel="Today's move · Decide"
                  badgeLabel={challenge.topic ?? "Daily"}
                  progressPercent={(mythGame.attempts / MAX_DAILY_ATTEMPTS) * 100}
                  selected={null}
                  revealed={false}
                  wrongGuesses={wrongGuesses}
                  onSelect={handleGuess}
                  inlineExtra={
                    <div className="space-y-3 text-center">
                      <p className="text-sm text-brand-ink/60">
                        {attemptsLeft} {attemptsLeft === 1 ? "attempt" : "attempts"} remaining
                      </p>
                      {mythGame.attempts > 0 && (
                        <div className="border-l-4 border-brand-sea bg-brand-sea/5 p-3 text-left">
                          <p className="text-xs font-semibold uppercase text-brand-sea">Captain&apos;s clue</p>
                          <p className="mt-1 text-sm text-brand-ink/70">{challenge.hint}</p>
                        </div>
                      )}
                    </div>
                  }
                />
              )}

              {journeyStage === "understand" && (
                <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-sea">Verified explanation</p>
                    <h3 className="mt-2 font-serif-display text-2xl text-brand-ink">
                      The claim is {challenge.answer === "myth" ? "a myth" : "a fact"}.
                    </h3>
                    <p className="mt-3 leading-relaxed text-brand-ink/75">{challenge.explanation}</p>
                    {challenge.source && <p className="mt-3 text-xs text-brand-ink/50">Source: {challenge.source}</p>}
                    <button
                      type="button"
                      onClick={() => setJourneyStage("move")}
                      className="mt-6 bg-brand-coral px-6 py-3 text-sm font-semibold text-white hover:bg-brand-ink"
                    >
                      Take this learning onto the trail
                    </button>
                  </div>

                  {relatedStory ? (
                    <a
                      href={relatedStory.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden border border-brand-sand bg-brand-cream/40"
                    >
                      <img src={relatedStory.coverImageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-coral">Real Love 21 story</p>
                        <p className="mt-2 font-semibold leading-snug text-brand-ink group-hover:text-brand-coral">
                          {relatedStory.title}
                        </p>
                        <p className="mt-2 text-sm text-brand-ink/65">{relatedStory.learningHook}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="border-l-4 border-brand-sea bg-brand-sea/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-sea">Ability in action</p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                        The trail mission turns today&apos;s learning into a practical act of teamwork and inclusion.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {(journeyStage === "move" || journeyStage === "grow") && (
            <>
              <div className="rounded-2xl border border-brand-sand bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <CaptainMascot
                mood="idle"
                outfit={getCaptainOutfit(progress.badges)}
                cosmetic={cosmetic}
                size={110}
                label={captainMeta.fullName}
              />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">
                  Meet {captainMeta.fullName} · {captainMeta.tagline}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-ink/45">Name your Team Captain</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <input
                    type="text"
                    value={captainDraft}
                    onChange={(event) => setCaptainDraft(event.target.value)}
                    maxLength={24}
                    placeholder="Captain"
                    className="rounded-full border border-brand-sand px-4 py-2 text-sm text-brand-ink focus:border-brand-coral focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={saveCaptainName}
                    className="rounded-full bg-brand-coral px-5 py-2 text-sm font-semibold text-white hover:bg-brand-ink"
                  >
                    Save
                  </button>
                </div>
                {progress.badges.length > 0 && (
                  <p className="mt-3 text-sm text-brand-ink/65">
                    Current outfit:{" "}
                    <span className="font-semibold">{captainOutfits[getCaptainOutfit(progress.badges)].label}</span>
                    {" — "}
                    {captainOutfits[getCaptainOutfit(progress.badges)].accessory}
                  </p>
                )}
                <p className="mt-2 text-sm text-brand-ink/65">
                  {mythWonToday
                    ? `Knowledge boost active — today’s scenarios are tailored for a ${learnerRoles[learnerRole].label.toLowerCase()}.`
                    : "Learning complete — each mission lets you adapt support and try again without a timer."}
                </p>
              </div>
            </div>
          </div>

              <TrailUnlocksPanel
                progress={progress}
                mythStreak={mythStreak}
                mythCompletedToday={mythCompletedToday}
                mythWonToday={mythWonToday}
              />

              <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
                <TrailMapBoard progress={progress} activeStopOrder={activeStopOrder} />
                <CaptainRelay
                  learnerRole={learnerRole}
                  mythCompletedToday={mythCompletedToday}
                  mythWonToday={mythWonToday}
                  mythStatement={challenge.statement}
                  onProgressUpdate={(updated) => {
                    setProgress(updated);
                    setJourneyStage("grow");
                  }}
                  onActiveStopChange={setActiveStopOrder}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
