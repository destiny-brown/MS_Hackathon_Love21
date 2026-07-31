"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lightbulb, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { TrailHandoff } from "@/components/learn/trail-map/trail-handoff";
import { getCaptainOutfit } from "@/lib/captain-character";
import { getSkillMission, learnerRoles, type LearnerRole } from "@/lib/skill-missions";
import { getStopByOrder, trailStops, type TrailBadge, type TrailStop } from "@/lib/trail-map-data";
import { getActiveCosmetic, getTrailProgress, recordTrailRun, type TrailProgress } from "@/lib/trail-map-storage";

type GamePhase = "idle" | "playing" | "handoff";

type CaptainRelayProps = {
  learnerRole: LearnerRole;
  mythCompletedToday: boolean;
  mythWonToday: boolean;
  mythStatement?: string;
  onProgressUpdate: (progress: TrailProgress) => void;
  onActiveStopChange: (order: number) => void;
};

const sceneThemes = [
  "from-[#DDF2E8] via-[#F8F4EB] to-[#F4D6C8]",
  "from-[#D8EEF5] via-[#EAF6F2] to-[#F8F4EB]",
  "from-[#F7E8BC] via-[#FFF8E8] to-[#DCEFD8]",
  "from-[#E6E0F2] via-[#F8F4EB] to-[#DDEEEE]",
  "from-[#F9DCCF] via-[#FFF4D8] to-[#E1EFD9]",
  "from-[#CFE7EE] via-[#EAF6F2] to-[#F4D6C8]",
];

export function CaptainRelay({
  learnerRole,
  mythCompletedToday,
  mythWonToday,
  mythStatement,
  onProgressUpdate,
  onActiveStopChange,
}: CaptainRelayProps) {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [activeOrder, setActiveOrder] = useState(0);
  const [sectionsCompleted, setSectionsCompleted] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [handoffStop, setHandoffStop] = useState<TrailStop>(trailStops[0]);
  const [earnedBadges, setEarnedBadges] = useState<TrailBadge[]>([]);
  const [unlockedStopIds, setUnlockedStopIds] = useState<string[]>([trailStops[0].id]);

  const progress = getTrailProgress();
  const currentStop = getStopByOrder(activeOrder);
  const mission = getSkillMission(currentStop, learnerRole);
  const selectedOption = mission.options.find((option) => option.id === selectedOptionId) ?? null;

  function startJourney() {
    setActiveOrder(0);
    setSectionsCompleted(0);
    setSelectedOptionId(null);
    setShowSuccess(false);
    setEarnedBadges([]);
    setUnlockedStopIds([trailStops[0].id]);
    setPhase("playing");
    onActiveStopChange(0);
  }

  function chooseAction(optionId: string) {
    if (showSuccess) return;
    const option = mission.options.find((item) => item.id === optionId);
    if (!option) return;
    setSelectedOptionId(optionId);
    if (option.correct) setShowSuccess(true);
  }

  function continueJourney() {
    const completedCount = activeOrder + 1;
    const nextBadges = earnedBadges.includes(currentStop.badge)
      ? earnedBadges
      : [...earnedBadges, currentStop.badge];
    const nextStop = getStopByOrder(activeOrder + 1);
    const nextUnlocked = unlockedStopIds.includes(nextStop.id)
      ? unlockedStopIds
      : [...unlockedStopIds, nextStop.id];

    setSectionsCompleted(completedCount);
    setEarnedBadges(nextBadges);
    setUnlockedStopIds(nextUnlocked);

    if (completedCount >= trailStops.length) {
      const updated = recordTrailRun(completedCount, nextUnlocked, nextBadges);
      setHandoffStop(currentStop);
      onProgressUpdate(updated);
      setPhase("handoff");
      return;
    }

    const nextOrder = activeOrder + 1;
    setActiveOrder(nextOrder);
    setSelectedOptionId(null);
    setShowSuccess(false);
    onActiveStopChange(nextOrder);
  }

  if (phase === "handoff") {
    return (
      <TrailHandoff
        stop={handoffStop}
        sectionsCompleted={sectionsCompleted}
        progress={getTrailProgress()}
        learnerRole={learnerRole}
        mythCompletedToday={mythCompletedToday}
        mythWonToday={mythWonToday}
        mythStatement={mythStatement}
        onPlayAgain={startJourney}
      />
    );
  }

  return (
    <div className="overflow-hidden border border-brand-ink bg-brand-ink text-white shadow-xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Practical inclusion mission</p>
          <h2 className="mt-1 font-serif-display text-2xl sm:text-3xl">
            {phase === "idle" ? "Make one move that matters" : mission.title}
          </h2>
        </div>
        <span className="border border-white/15 px-3 py-1 text-xs font-semibold text-white/70">
          {learnerRoles[learnerRole].label}
        </span>
      </div>

      {phase === "idle" ? (
        <div className="grid gap-6 px-5 py-7 sm:grid-cols-[1fr_9rem] sm:items-center sm:px-7">
          <div>
            <p className="max-w-xl leading-relaxed text-white/75">
              Travel through six Love 21 programme settings. At each stop, notice what a person needs and choose
              an action that supports ability, autonomy, and belonging.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/60">
              <span className="border border-white/15 px-3 py-1.5">No timer</span>
              <span className="border border-white/15 px-3 py-1.5">Learn by adapting</span>
              <span className="border border-white/15 px-3 py-1.5">6 ability stops</span>
            </div>
            <button
              type="button"
              onClick={startJourney}
              className="mt-6 inline-flex items-center gap-2 bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-ink"
            >
              Begin at San Po Kong
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <CaptainMascot
            mood="cheering"
            outfit={getCaptainOutfit(progress.badges)}
            cosmetic={getActiveCosmetic(progress)}
            size={140}
            label={`${progress.captainName} ready for the journey`}
          />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStop.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
          >
            <div className={`relative min-h-[17rem] overflow-hidden bg-gradient-to-br ${sceneThemes[activeOrder]}`}>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-brand-ink/10" />
              <motion.div
                className="absolute left-[7%] top-7 text-7xl opacity-20"
                animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
                aria-hidden="true"
              >
                {currentStop.emoji}
              </motion.div>
              <div className="absolute right-6 top-6 text-right text-brand-ink/55">
                <p className="text-xs font-bold uppercase tracking-wide">Stop {activeOrder + 1} of {trailStops.length}</p>
                <p className="mt-1 text-sm font-semibold text-brand-ink">{currentStop.name}</p>
                <p className="text-xs">{currentStop.area}</p>
              </div>

              <motion.div
                className="absolute bottom-8 left-[12%] z-10"
                animate={showSuccess ? { x: [0, 70, 145], y: [0, -55, 0], rotate: [0, 8, 0] } : { y: [0, -4, 0] }}
                transition={showSuccess ? { duration: 0.9, ease: "easeInOut" } : { duration: 2, repeat: Infinity }}
              >
                <CaptainMascot
                  mood={showSuccess ? "cheering" : selectedOption ? "thinking" : "idle"}
                  outfit={getCaptainOutfit([...progress.badges, ...earnedBadges])}
                  cosmetic={getActiveCosmetic(progress)}
                  size={124}
                  label={`${progress.captainName} at ${currentStop.name}`}
                />
              </motion.div>

              <motion.div
                className="absolute bottom-10 right-[10%] w-36 border border-brand-ink/10 bg-white/85 p-3 text-brand-ink shadow-lg backdrop-blur-sm sm:w-48"
                animate={showSuccess ? { scale: [1, 1.06, 1], boxShadow: "0 16px 35px rgba(48,117,130,0.24)" } : {}}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-brand-sea">Skill focus</p>
                <p className="mt-1 font-semibold">{mission.skill}</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-ink/60">
                  {showSuccess ? selectedOption?.sceneChange : currentStop.abilityLine}
                </p>
              </motion.div>
            </div>

            <div className="px-5 py-6 sm:px-7">
              <p className="text-sm leading-relaxed text-white/75">{mission.scenario}</p>
              <div className="mt-4 flex items-start gap-2 text-white">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral" aria-hidden="true" />
                <p className="font-semibold">{mission.instruction}</p>
              </div>

              <div className="mt-5 grid gap-3">
                {mission.options.map((option, index) => {
                  const selected = selectedOptionId === option.id;
                  const revealCorrect = showSuccess && option.correct;
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => chooseAction(option.id)}
                      disabled={showSuccess}
                      whileHover={showSuccess ? undefined : { x: 4 }}
                      whileTap={showSuccess ? undefined : { scale: 0.99 }}
                      className={`flex min-h-[4.5rem] items-center gap-4 border px-4 py-3 text-left transition sm:px-5 ${
                        revealCorrect
                          ? "border-brand-sea bg-brand-sea/20"
                          : selected && !option.correct
                            ? "border-brand-coral bg-brand-coral/15"
                            : "border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                        {revealCorrect ? <CheckCircle2 className="h-5 w-5 text-[#8BD0C8]" /> : index + 1}
                      </span>
                      <span className="text-sm font-medium leading-relaxed text-white/90">{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {selectedOption && (
                  <motion.div
                    key={selectedOption.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    role="status"
                    className={`mt-4 border-l-4 p-4 ${
                      selectedOption.correct
                        ? "border-brand-sea bg-brand-sea/10"
                        : "border-brand-coral bg-brand-coral/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {selectedOption.correct ? (
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#8BD0C8]" aria-hidden="true" />
                      ) : (
                        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-brand-coral" aria-hidden="true" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {selectedOption.correct ? mission.successMessage : "Try another way"}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-white/70">{selectedOption.feedback}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {showSuccess && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={continueJourney}
                  className="mt-5 inline-flex items-center gap-2 bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-ink"
                >
                  {activeOrder + 1 >= trailStops.length ? "Complete today's journey" : `Jump to ${getStopByOrder(activeOrder + 1).name}`}
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}