// lib/day-locations-data.ts
//
// Data model for the "21 Moves" trail. The trail is six locations that
// repeat in a loop (Day 7 == Day 1's location again, with new questions
// swapped in if you want variety — see `buildLoopedDay`).
//
// Each location/day has:
//  - 5 "events" (the animated stations, e.g. hurdles / javelin / dragon boat leg)
//  - each event carries exactly one question
//  - questions are a MIX of three types: "myth" (myth vs fact), "fact"
//    (a "what is ___" multiple choice), and "situation" (a role/scenario
//    multiple choice) — so every day has 5 questions of mixed type.

export type QuestionType = "myth" | "fact" | "situation";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface DayQuestion {
  id: string;
  type: QuestionType;
  /** The claim (myth type) or the question stem (fact/situation types) */
  prompt: string;
  /** Small framing label shown above the prompt, e.g. "Situation" */
  kicker: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  hint: string;
}

/** The kind of animated station. Drives which SVG rig + motion plays. */
export type EventKind =
  | "hurdle"
  | "javelin"
  | "longjump"
  | "polevault"
  | "hurdle-final"
  | "dragonboat"
  | "generic";

export interface DayEvent {
  id: string;
  kind: EventKind;
  label: string;
  question: DayQuestion;
}

export type LocationTheme = "stadium" | "harbour" | "court" | "wall" | "track" | "festival";

export interface LocationDay {
  id: string;
  order: number; // 1-6, then loops
  theme: LocationTheme;
  title: string;
  subtitle: string;
  /** tailwind-ish accent used for the map pin + backdrop */
  accent: string;
  events: DayEvent[]; // always length 5
}

const q = (
  id: string,
  type: QuestionType,
  kicker: string,
  prompt: string,
  options: QuestionOption[],
  correctOptionId: string,
  explanation: string,
  hint: string,
): DayQuestion => ({ id, type, kicker, prompt, options, correctOptionId, explanation, hint });

const MF: QuestionOption[] = [
  { id: "myth", label: "Myth" },
  { id: "fact", label: "Fact" },
];

/* ------------------------------------------------------------------ */
/* Day 1 — Stadium (Athletics)                                         */
/* ------------------------------------------------------------------ */

const stadiumDay: LocationDay = {
  id: "stadium",
  order: 1,
  theme: "stadium",
  title: "The Stadium",
  subtitle: "Five track & field events with Captain 21",
  accent: "brand-coral",
  events: [
    {
      id: "stadium-hurdles-1",
      kind: "hurdle",
      label: "Hurdles",
      question: q(
        "stadium-hurdles-1",
        "myth",
        "Myth or Fact",
        "People with Down syndrome can't take part in competitive sport.",
        MF,
        "myth",
        "Athletes with Down syndrome compete at every level, including the Special Olympics and mainstream local leagues — strength and coordination vary person to person, just like in the general population.",
        "Think about how many different athletes you've seen at the Special Olympics.",
      ),
    },
    {
      id: "stadium-javelin",
      kind: "javelin",
      label: "Javelin",
      question: q(
        "stadium-javelin",
        "fact",
        "What is it?",
        "What is 'inclusive education'?",
        [
          { id: "a", label: "Students with disabilities learning in separate schools only" },
          { id: "b", label: "Students of all abilities learning together in the same classroom, with support" },
          { id: "c", label: "A school policy that only applies to sports classes" },
        ],
        "b",
        "Inclusive education means students of all abilities learn in the same classrooms and school life, with the right supports in place — rather than being separated by default.",
        "It's about where and how students learn together.",
      ),
    },
    {
      id: "stadium-longjump",
      kind: "longjump",
      label: "Long Jump",
      question: q(
        "stadium-longjump",
        "situation",
        "Situation",
        "A new classmate uses a wheelchair and is joining your PE class today. What's the best first move?",
        [
          { id: "a", label: "Ask them what activities work for them and adapt the game together" },
          { id: "b", label: "Assume they should just watch from the side" },
          { id: "c", label: "Speak only to their aide instead of them" },
        ],
        "a",
        "The most inclusive move is to ask directly and adapt together — it respects the person's own knowledge of what works for them.",
        "Who knows best what a person needs? The person themselves.",
      ),
    },
    {
      id: "stadium-polevault",
      kind: "polevault",
      label: "Pole Vault",
      question: q(
        "stadium-polevault",
        "myth",
        "Myth or Fact",
        "Down syndrome is a disease that can be caught from someone.",
        MF,
        "myth",
        "Down syndrome is a genetic condition present from conception — caused by an extra copy of chromosome 21. It is not an illness and cannot be transmitted.",
        "Think about where in a person's body genes live.",
      ),
    },
    {
      id: "stadium-hurdles-final",
      kind: "hurdle-final",
      label: "Hurdles Final",
      question: q(
        "stadium-hurdles-final",
        "fact",
        "What is it?",
        "What does the number '21' refer to in Down syndrome / World Down Syndrome Day (3/21)?",
        [
          { id: "a", label: "The age most people are diagnosed" },
          { id: "b", label: "An extra copy of chromosome 21" },
          { id: "c", label: "The number of known related conditions" },
        ],
        "b",
        "Down syndrome is caused by an extra (third) copy of chromosome 21 — which is also why World Down Syndrome Day falls on 3/21 (the 3rd day of the 21st month... written 21/3 or 3/21).",
        "The date March 21st is a clue: 3/21.",
      ),
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Day 2 — Harbour (Dragon Boat Racing, replaces swimming)             */
/* ------------------------------------------------------------------ */

const harbourDay: LocationDay = {
  id: "harbour",
  order: 2,
  theme: "harbour",
  title: "The Harbour",
  subtitle: "Row the dragon boat to the finish line, one answer at a time",
  accent: "brand-sea",
  events: [
    {
      id: "harbour-leg-1",
      kind: "dragonboat",
      label: "Leg 1",
      question: q(
        "harbour-leg-1",
        "situation",
        "Situation",
        "Your dragon boat team needs a drummer to keep everyone's paddling in rhythm. A teammate who is Deaf wants the role. What do you do?",
        [
          { id: "a", label: "Give them the role and agree on a visual cue (like a flag) alongside the drum" },
          { id: "b", label: "Tell them drumming needs hearing, so they should paddle instead" },
          { id: "c", label: "Quietly give the role to someone else without saying why" },
        ],
        "a",
        "Small adaptations — like a visual cue in addition to the drumbeat — let everyone take on the role they want, without singling anyone out.",
        "What's a non-audio way to keep a beat visible to the whole boat?",
      ),
    },
    {
      id: "harbour-leg-2",
      kind: "dragonboat",
      label: "Leg 2",
      question: q(
        "harbour-leg-2",
        "myth",
        "Myth or Fact",
        "People with intellectual disabilities can't learn teamwork skills like paddling in sync.",
        MF,
        "myth",
        "Teamwork and timing are learnable skills for everyone — dragon boat teams around the world include paddlers with intellectual disabilities who train and compete just like any other crew member.",
        "Teamwork is a skill you build with practice, not something fixed at birth.",
      ),
    },
    {
      id: "harbour-leg-3",
      kind: "dragonboat",
      label: "Leg 3",
      question: q(
        "harbour-leg-3",
        "fact",
        "What is it?",
        "What is a 'reasonable accommodation' (合理便利)?",
        [
          { id: "a", label: "A free upgrade given to everyone regardless of need" },
          { id: "b", label: "A practical adjustment that removes a barrier for a person with a disability" },
          { id: "c", label: "A rule that disabled people must follow strictly" },
        ],
        "b",
        "A reasonable accommodation is a practical change — like a ramp, extra time, or a visual cue — that removes a barrier so someone can fully take part.",
        "Think 'adjustment that removes a barrier', not 'special favour'.",
      ),
    },
    {
      id: "harbour-leg-4",
      kind: "dragonboat",
      label: "Leg 4",
      question: q(
        "harbour-leg-4",
        "situation",
        "Situation",
        "One paddler is paddling on a slightly different tempo than the rest. Captain 21 slows the drumbeat to help everyone sync up. What value is this showing?",
        [
          { id: "a", label: "Patience and adapting the pace so the whole team succeeds together" },
          { id: "b", label: "Punishing the paddler for being different" },
          { id: "c", label: "Ignoring the issue and hoping it fixes itself" },
        ],
        "a",
        "Adjusting the pace so everyone can contribute is a simple, everyday act of inclusion — the whole team moves forward together.",
        "What helps a whole team finish together, not just the fastest member?",
      ),
    },
    {
      id: "harbour-finish",
      kind: "dragonboat",
      label: "Finish Line",
      question: q(
        "harbour-finish",
        "myth",
        "Myth or Fact",
        "Inclusive teams are slower and less successful than teams that exclude people with disabilities.",
        MF,
        "myth",
        "Research and real-world teams consistently show diverse, inclusive teams perform well — different strengths combine, and morale and cooperation often improve.",
        "Think about what a team gains, not just what it 'has to accommodate'.",
      ),
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Days 3–6 — reuse the same generic obstacle-course animation engine  */
/* with a different theme skin, so the loop has real visual variety.   */
/* ------------------------------------------------------------------ */

function genericDay(
  id: string,
  order: number,
  theme: LocationTheme,
  title: string,
  subtitle: string,
  accent: string,
  labels: [string, string, string, string, string],
  questions: DayQuestion[],
): LocationDay {
  const kinds: EventKind[] = ["generic", "generic", "generic", "generic", "generic"];
  return {
    id,
    order,
    theme,
    title,
    subtitle,
    accent,
    events: labels.map((label, i) => ({
      id: `${id}-${i + 1}`,
      kind: kinds[i],
      label,
      question: questions[i],
    })),
  };
}

const courtDay = genericDay(
  "court",
  3,
  "court",
  "The Court",
  "A basketball relay across five plays",
  "brand-ink",
  ["Dribble Sprint", "Free Throw", "Layup", "Three-Pointer", "Buzzer Beater"],
  [
    q(
      "court-1",
      "fact",
      "What is it?",
      "What is a 'sensory-friendly' event?",
      [
        { id: "a", label: "An event with dimmed lights, lower volume, and quiet spaces available" },
        { id: "b", label: "An event only for people who like loud music" },
        { id: "c", label: "An event with no seating" },
      ],
      "a",
      "Sensory-friendly events reduce overwhelming lights/sound and offer a quiet space, making the event accessible to people with sensory sensitivities.",
      "Think about what makes a space calmer, not louder.",
    ),
    q(
      "court-2",
      "myth",
      "Myth or Fact",
      "A person who uses a wheelchair can't play basketball.",
      MF,
      "myth",
      "Wheelchair basketball is a full competitive sport with its own leagues and Paralympic events — plenty of people who use wheelchairs play at a high level.",
      "There's an entire Paralympic sport built around this exact question.",
    ),
    q(
      "court-3",
      "situation",
      "Situation",
      "Your team captain always picks the same two people to explain new plays. A teammate with a learning disability says they learn better from a diagram than from spoken instructions. What should the captain do?",
      [
        { id: "a", label: "Add a simple diagram alongside the verbal explanation" },
        { id: "b", label: "Tell them to just try harder to listen" },
        { id: "c", label: "Bench them for practices" },
      ],
      "a",
      "Offering the same information in more than one format (visual + verbal) is a simple, low-cost way to include different learning styles.",
      "Different people process information differently — how could you say the same thing two ways?",
    ),
    q(
      "court-4",
      "fact",
      "What is it?",
      "What does 'person-first language' mean, e.g. saying 'a person with Down syndrome'?",
      [
        { id: "a", label: "Putting the person before the condition, so the person isn't defined by it" },
        { id: "b", label: "A rule that only doctors need to follow" },
        { id: "c", label: "A way to make conversations more formal" },
      ],
      "a",
      "Person-first language puts the person before any diagnosis or condition, recognising them as a whole person first.",
      "Which word comes first in the phrase — the person, or the condition?",
    ),
    q(
      "court-5",
      "myth",
      "Myth or Fact",
      "Most people with Down syndrome cannot hold a job.",
      MF,
      "myth",
      "Many adults with Down syndrome work across a wide range of jobs and industries, especially when workplaces offer clear training and reasonable accommodations.",
      "Think about the many kinds of jobs that exist, and what support makes them possible.",
    ),
  ],
);

const wallDay = genericDay(
  "wall",
  4,
  "wall",
  "The Climbing Wall",
  "Five holds, five questions, one summit",
  "brand-sea",
  ["First Hold", "Traverse", "Crux Move", "Overhang", "Summit"],
  [
    q(
      "wall-1",
      "situation",
      "Situation",
      "A climbing partner with low vision asks you to call out hand-hold positions using a clock-face system (e.g. 'hold at 2 o'clock'). What should you do?",
      [
        { id: "a", label: "Learn the system and use it so they can climb confidently" },
        { id: "b", label: "Say it's too much effort and pair them with someone else" },
        { id: "c", label: "Ignore the request and just point instead" },
      ],
      "a",
      "Learning a simple shared system, like clock positions, is a small effort that makes climbing fully accessible to a partner with low vision.",
      "Pointing doesn't work if your partner can't see it — what would work instead?",
    ),
    q(
      "wall-2",
      "myth",
      "Myth or Fact",
      "Physical disabilities always mean someone can't do adventurous or physical activities.",
      MF,
      "myth",
      "With the right adaptive equipment and technique, people with physical disabilities take part in climbing, skiing, surfing and many other adventure sports.",
      "Think about adaptive sports equipment you may have seen — like sit-skis or adaptive climbing harnesses.",
    ),
    q(
      "wall-3",
      "fact",
      "What is it?",
      "What is an 'IEP' (Individualized Education Plan)?",
      [
        { id: "a", label: "A personalised learning plan built around a student's specific needs" },
        { id: "b", label: "A punishment plan for students who misbehave" },
        { id: "c", label: "A generic timetable given to every student" },
      ],
      "a",
      "An IEP is a personalised plan that sets goals and supports tailored to one student's specific learning needs.",
      "The key word is 'individualized' — think 'tailored to one person'.",
    ),
    q(
      "wall-4",
      "situation",
      "Situation",
      "A friend keeps finishing your sentences for a classmate who has a stutter. What's the most respectful thing to do?",
      [
        { id: "a", label: "Gently ask your friend to let the classmate finish in their own time" },
        { id: "b", label: "Say nothing, it's not a big deal" },
        { id: "c", label: "Avoid talking to the classmate to skip the awkwardness" },
      ],
      "a",
      "Giving people who stutter the time to finish speaking, without interruption, is a simple and respectful form of patience.",
      "What does patience look like in a conversation?",
    ),
    q(
      "wall-5",
      "myth",
      "Myth or Fact",
      "Autistic people don't want friends or social connection.",
      MF,
      "myth",
      "Many autistic people deeply value friendship and connection — they may socialise differently, but the desire for connection is common, not absent.",
      "Different from 'not wanting' — think about *how* someone might prefer to connect.",
    ),
  ],
);

const trackDay = genericDay(
  "track",
  5,
  "track",
  "The Cycling Track",
  "Five laps around the velodrome",
  "brand-coral",
  ["Lap 1", "Lap 2", "Sprint Lane", "Draft Line", "Final Lap"],
  [
    q(
      "track-1",
      "fact",
      "What is it?",
      "What is a 'tandem bike' used for in para-cycling?",
      [
        { id: "a", label: "A two-person bike that lets a sighted pilot ride with a visually impaired athlete" },
        { id: "b", label: "A bike only used for racing against yourself" },
        { id: "c", label: "A bike with no pedals" },
      ],
      "a",
      "Tandem bikes pair a sighted 'pilot' at the front with a visually impaired athlete at the back, letting both compete together in para-cycling.",
      "Think about what 'two seats, one bike' could solve for a rider who can't see the track.",
    ),
    q(
      "track-2",
      "myth",
      "Myth or Fact",
      "Once someone is diagnosed with a disability, their abilities never change or improve.",
      MF,
      "myth",
      "Skills, strength, and independence can grow throughout life for people with disabilities, just as for anyone — through practice, therapy, and opportunity.",
      "Think about how any skill — for anyone — tends to change with practice.",
    ),
    q(
      "track-3",
      "situation",
      "Situation",
      "A new club member with ADHD says long team meetings are hard to sit through. What's a supportive first step?",
      [
        { id: "a", label: "Ask what would help — like shorter meetings or scheduled breaks — and try it" },
        { id: "b", label: "Assume they're not interested in the club" },
        { id: "c", label: "Tell them to just concentrate harder" },
      ],
      "a",
      "Asking and adjusting — shorter segments, breaks, or a written agenda — are simple, effective supports for many people with ADHD.",
      "What structural change to a meeting could make it easier to sit through?",
    ),
    q(
      "track-4",
      "fact",
      "What is it?",
      "What does 'accessibility' mean in the context of a building or website?",
      [
        { id: "a", label: "Design that can be used by people with a wide range of abilities" },
        { id: "b", label: "A feature that only wheelchair users need" },
        { id: "c", label: "An optional extra that's nice but not necessary" },
      ],
      "a",
      "Accessibility means designing spaces, products, or websites so people with a wide range of abilities can use them — it benefits far more people than any one group.",
      "Think broad: who benefits from a ramp, or captions, or clear signage?",
    ),
    q(
      "track-5",
      "myth",
      "Myth or Fact",
      "It's rude to ask someone how they'd like to be supported.",
      MF,
      "myth",
      "Asking directly and respectfully how someone prefers to be supported is usually welcomed — it's far better than guessing on their behalf.",
      "Which is more respectful: guessing what someone needs, or asking them?",
    ),
  ],
);

const festivalDay = genericDay(
  "festival",
  6,
  "festival",
  "Finish Line Festival",
  "Five closing challenges before the trail loops again",
  "brand-sea",
  ["Opening Parade", "Talent Stage", "Team Games", "Awards", "Closing Ceremony"],
  [
    q(
      "festival-1",
      "situation",
      "Situation",
      "The festival stage has stairs and no ramp, and a performer uses a wheelchair. What should the organisers do?",
      [
        { id: "a", label: "Add a ramp or alternative level access before the show" },
        { id: "b", label: "Ask the performer to be lifted up by volunteers" },
        { id: "c", label: "Move the performer's slot to backstage only" },
      ],
      "a",
      "Physical access — like a ramp — should be built into event planning from the start, so every performer can access the stage with dignity.",
      "What's the difference between a permanent fix and an improvised one?",
    ),
    q(
      "festival-2",
      "myth",
      "Myth or Fact",
      "Down syndrome affects everyone in exactly the same way.",
      MF,
      "myth",
      "Down syndrome affects each person differently — abilities, health, personality and interests vary widely from person to person, just like in anyone else.",
      "Think about how much people in general differ from one another.",
    ),
    q(
      "festival-3",
      "fact",
      "What is it?",
      "What is World Down Syndrome Day?",
      [
        { id: "a", label: "An annual day (March 21) raising awareness and celebrating people with Down syndrome" },
        { id: "b", label: "A medical exam given once a year" },
        { id: "c", label: "A holiday only observed in one country" },
      ],
      "a",
      "World Down Syndrome Day is an internationally recognised day on March 21st, chosen to reflect the extra copy of chromosome 21.",
      "The date itself (3/21) is a clue about what's being marked.",
    ),
    q(
      "festival-4",
      "situation",
      "Situation",
      "During awards, an emcee jokes that a team 'must have had help' because a teammate has a disability. How should a friend respond?",
      [
        { id: "a", label: "Speak up that the team earned it together, and the comment wasn't okay" },
        { id: "b", label: "Laugh along so it's not awkward" },
        { id: "c", label: "Say nothing and hope it isn't repeated" },
      ],
      "a",
      "Gently but clearly naming why a comment is unfair helps shift the moment and supports the teammate.",
      "What does standing up for a teammate sound like, kindly but clearly?",
    ),
    q(
      "festival-5",
      "myth",
      "Myth or Fact",
      "Inclusion only matters on special awareness days.",
      MF,
      "myth",
      "Inclusion is an everyday practice — in classrooms, teams, and workplaces — not something reserved for a single awareness day.",
      "Think about how often barriers show up versus how often awareness days happen.",
    ),
  ],
);

export const LOCATION_DAYS: LocationDay[] = [
  stadiumDay,
  harbourDay,
  courtDay,
  wallDay,
  trackDay,
  festivalDay,
];

/** The trail loops forever through the same 6 locations. */
export function getLocationForDayNumber(dayNumber: number): LocationDay {
  const index = (dayNumber - 1) % LOCATION_DAYS.length;
  return LOCATION_DAYS[index];
}

export function getDayNumberForLocationId(locationId: string): number {
  const idx = LOCATION_DAYS.findIndex((d) => d.id === locationId);
  return idx === -1 ? 1 : idx + 1;
}
