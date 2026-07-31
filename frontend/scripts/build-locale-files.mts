/**
 * Build English locale JSON from TypeScript data modules.
 * Run: npx tsx scripts/build-locale-files.mts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { communityQuotes } from "../lib/community-quotes.ts";
import { LOCATION_DAYS } from "../lib/day-locations-data.ts";
import { impactPillars, impactStories, growthData, financialBreakdown, auditedReports, growingForestQuote, financialRootsQuote } from "../lib/impact-data.ts";
import { mythVsFactQuestions } from "../lib/learn-quiz-data.ts";
import { categoryMeta, rosterItems, interestOptions, availabilityOptions, commitmentOptions, groupSizeOptions } from "../lib/volunteer-roster.ts";
import { programmes, boardMembers, internshipRoles, internshipRequirements } from "../lib/site-data.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "locales");

function writeLocale(lang: string, ns: string, data: unknown) {
  const dir = path.join(localesDir, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${ns}.json`), JSON.stringify(data, null, 2) + "\n");
}

// --- learn ---
const trail: Record<string, unknown> = { locations: {}, events: {}, questions: {} };
for (const day of LOCATION_DAYS) {
  trail.locations[day.id] = { title: day.title, subtitle: day.subtitle };
  for (const event of day.events) {
    trail.events[event.id] = { label: event.label };
    const q = event.question;
    trail.questions[q.id] = {
      kicker: q.kicker,
      prompt: q.prompt,
      explanation: q.explanation,
      hint: q.hint,
      options: Object.fromEntries(q.options.map((o) => [o.id, o.label])),
    };
  }
}

const learnEn = {
  ui: {
    myth: "Myth",
    fact: "Fact",
    mythOrFact: "Myth or Fact",
    situation: "Situation",
    correct: "Correct!",
    notQuite: "Not quite",
    captainsClue: "Captain's clue",
    trailTitle: "The 21 Moves Trail",
    loop: "Loop {{n}}",
    day: "Day {{n}}",
    loading: "Loading today's trail…",
    backToLearn: "Back to Learn",
    startQuiz: "Start quiz",
    seeResults: "See results",
    tryAgain: "Try again",
    scorePerfect: "Perfect score!",
    scoreGreat: "Great job!",
    scoreGood: "Good effort!",
    scoreKeep: "Keep learning!",
    fromCommunity: "From the community",
    readFullStory: "Read the full story",
    play21Moves: "Play today's 21 Moves",
    howItWorks: "How it works",
    commonClaim: "Common claim",
    mythBusted: "MYTH BUSTED",
    correctFact: "CORRECT — THAT'S A FACT",
    relatedStories: "Related stories",
    relatedStoriesSubtitle: "Real Love 21 stories connected to what you just learned",
    searchVideos: "Search videos",
    searchPlaceholder: "Search neurodiversity topics…",
    recommended: "Recommended",
    curated: "Curated",
    all: "All",
    teachers: "Teachers",
    parents: "Parents",
    moreFromLove21: "More from Love 21",
    captainThinking: "Captain 21 is thinking…",
    chatOpen: "Ask Captain21",
    chatPlaceholder: "Ask about programmes, volunteering, or myths…",
    speak: "Speak",
    listening: "Listening…",
    send: "Send",
    closeChat: "Close chat",
    voiceNeedsChrome: "Voice input needs Chrome or Edge",
    sources: "Sources",
  },
  quiz: {
    questions: Object.fromEntries(
      mythVsFactQuestions.map((q) => [q.id, { statement: q.statement, explanation: q.explanation, topic: q.topic }]),
    ),
  },
  quotes: Object.fromEntries(
    communityQuotes.map((q) => [q.id, { quote: q.quote, programmeLabel: q.programmeLabel }]),
  ),
  trail,
};

writeLocale("en", "learn", learnEn);

// --- impact ---
const impactEn = {
  quotes: { growingForest: growingForestQuote, financialRoots: financialRootsQuote },
  growth: Object.fromEntries(
    Object.entries(growthData).map(([key, val]) => [key, { title: val.title, unit: val.unit }]),
  ),
  financial: financialBreakdown.map((item) => ({ name: item.name, amount: item.amount })),
  reports: auditedReports.map((r) => ({ label: r.label })),
  pillars: Object.fromEntries(
    impactPillars.map((p) => [
      p.id,
      { title: p.title, stage: p.stage, sessions: p.sessions, quote: p.quote, details: p.details, ctaLabel: p.ctaLabel },
    ]),
  ),
  stories: impactStories.map((s, i) => ({
    id: `story-${i}`,
    role: s.role,
    name: s.name,
    quote: s.quote,
    highlight: s.highlight,
    alt: s.alt,
  })),
  ui: {
    growingForest: "The Growing Forest",
    ourGrowth: "Our Growth",
    vsPriorYear: "+{{pct}}% vs prior year",
    toProgrammes: "86% To programmes",
    strengthSpotlights: "Strength-Based Spotlights",
    prevPillar: "Previous pillar",
    nextPillar: "Next pillar",
    prevStory: "Previous story",
    nextStory: "Next story",
    stickyEyebrow: "Every gift grows the forest",
    stickyTitle: "Back their potential today",
    stickyDonate: "Donate",
    stickyVolunteer: "Volunteer",
    modalDonateTitle: "Choose how to give",
    modalVolunteerTitle: "Find your volunteer fit",
    thankYou: "Thank you — we'll be in touch shortly.",
    funded: "{{pct}}% funded",
    of: "{{current}} of {{total}}",
  },
};

writeLocale("en", "impact", impactEn);

// --- volunteer ---
const volunteerEn = {
  categories: Object.fromEntries(
    Object.entries(categoryMeta).map(([k, v]) => [k, { label: v.label, blurb: v.blurb }]),
  ),
  roles: Object.fromEntries(
    rosterItems.map((r) => [r.id, { title: r.title, desc: r.desc, when: r.when, where: r.where, note: r.note ?? "", ctaLabel: r.ctaLabel }]),
  ),
  matcher: {
    interests: Object.fromEntries(interestOptions.map((o) => [o.key, { label: o.label, blurb: o.blurb }])),
    availability: Object.fromEntries(availabilityOptions.map((o) => [o.key, { label: o.label }])),
    commitment: Object.fromEntries(commitmentOptions.map((o) => [o.key, { label: o.label, blurb: o.blurb }])),
    groupSize: Object.fromEntries(groupSizeOptions.map((o) => [o.key, { label: o.label, blurb: o.blurb }])),
  },
};

writeLocale("en", "volunteer", volunteerEn);

// --- governance ---
const governanceEn = {
  programmes: Object.fromEntries(
    programmes.map((p, i) => [`p${i}`, { title: p.title, description: p.description }]),
  ),
  board: Object.fromEntries(boardMembers.map((m) => [m.slug, { name: m.name, bio: m.bio }])),
  internship: {
    roles: internshipRoles,
    requirements: internshipRequirements,
    requirementsTitle: "Requirements",
    rolesTitle: "Roles",
  },
};

writeLocale("en", "governance", governanceEn);

console.log("Built en locale files: learn, impact, volunteer, governance");
console.log("Trail questions:", Object.keys(trail.questions as object).length);
