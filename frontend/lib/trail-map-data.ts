export type TrailBadge = "athlete" | "dancer" | "coach" | "leader" | "teammate" | "buddy";

export type TrailStop = {
  id: string;
  order: number;
  name: string;
  area: string;
  emoji: string;
  abilityLine: string;
  modeLabel: string;
  badge: TrailBadge;
  badgeLabel: string;
  storySlug?: string;
  storyHref?: string;
  programmeHref: string;
  /** Shown on section complete / game over handoff */
  handoffTitle: string;
  handoffQuote: string;
};

export const trailBadges: Record<
  TrailBadge,
  { label: string; description: string }
> = {
  athlete: { label: "Athlete", description: "We can move, compete, and grow stronger together." },
  dancer: { label: "Dancer", description: "We can express joy and rhythm in our own way." },
  coach: { label: "Coach", description: "We can guide, encourage, and show up for each other." },
  leader: { label: "Leader", description: "We can take the mic, the stage, and the room." },
  teammate: { label: "Teammate", description: "We can pass the ball and finish as a team." },
  buddy: { label: "Buddy", description: "We can walk side by side at the same pace." },
};

/** Hong Kong trail — San Po Kong outward through Love 21 programme pillars */
export const trailStops: TrailStop[] = [
  {
    id: "san-po-kong-sport",
    order: 0,
    name: "San Po Kong Centre",
    area: "Kowloon",
    emoji: "⚽",
    abilityLine: "Athletes build stamina and teamwork on the court.",
    modeLabel: "Sport relay",
    badge: "athlete",
    badgeLabel: "Athlete",
    storySlug: "dragon-boating-inclusion",
    storyHref:
      "https://www.scmp.com/video/scmp-originals/3150667/hong-kong-yacht-club-and-charity-team-help-mentally-disabled-teens",
    programmeHref: "/get-involved",
    handoffTitle: "From fear of water to open-water racing",
    handoffQuote: "Inclusion through sport — real members, real progress.",
  },
  {
    id: "victoria-park-pool",
    order: 1,
    name: "Victoria Park Pool",
    area: "Causeway Bay",
    emoji: "🏊",
    abilityLine: "Swimmers and dragon-boat crews find confidence in the water.",
    modeLabel: "Pool rhythm",
    badge: "teammate",
    badgeLabel: "Teammate",
    storySlug: "dragon-boating-inclusion",
    programmeHref: "/our-volunteer?category=sport",
    handoffTitle: "Dragon boat crew in action",
    handoffQuote: "A splash of confidence — one paddle at a time.",
  },
  {
    id: "san-po-kong-kitchen",
    order: 2,
    name: "San Po Kong Kitchen",
    area: "Kowloon",
    emoji: "🥗",
    abilityLine: "Families cook, learn, and share nutritious meals together.",
    modeLabel: "Kitchen beat",
    badge: "dancer",
    badgeLabel: "Dancer",
    storySlug: "purposeful-employment",
    programmeHref: "/get-involved",
    handoffTitle: "Nutrition that families can own",
    handoffQuote: "Healthy choices made together — not alone.",
  },
  {
    id: "family-lounge",
    order: 3,
    name: "Family Lounge",
    area: "San Po Kong",
    emoji: "💬",
    abilityLine: "Parents and peers connect with patience and care.",
    modeLabel: "Buddy walk",
    badge: "buddy",
    badgeLabel: "Buddy",
    storySlug: "rthk-health-interview",
    storyHref: "https://www.rthk.hk/tv/dtt31/programme/healthpedia_tv/episode/783569",
    programmeHref: "/get-involved",
    handoffTitle: "Love is simple",
    handoffQuote: "Family support that lifts the whole community.",
  },
  {
    id: "community-dinner",
    order: 4,
    name: "Community Dinner",
    area: "Hong Kong",
    emoji: "🎉",
    abilityLine: "Hosts bring people together for outings and celebrations.",
    modeLabel: "Event crew",
    badge: "coach",
    badgeLabel: "Coach",
    storySlug: "beyond-limits-banquet",
    programmeHref: "/get-involved",
    handoffTitle: "Beyond Limits — tables and seats open",
    handoffQuote: "Celebrating ability on stage and at the table.",
  },
  {
    id: "harbour-team-day",
    order: 5,
    name: "Harbour Team Day",
    area: "Victoria Harbour",
    emoji: "🏢",
    abilityLine: "Corporate teams and volunteers show up side by side.",
    modeLabel: "Team relay",
    badge: "leader",
    badgeLabel: "Leader",
    storySlug: "purposeful-employment",
    storyHref:
      "https://www.scmp.com/news/hong-kong/society/article/3155167/hong-kongs-love-21-foundation-aims-prove-those-downs",
    programmeHref: "/our-volunteer?category=csr",
    handoffTitle: "Purposeful employment milestones",
    handoffQuote: "Those with Down syndrome and autism are ready for meaningful work.",
  },
];

export const SECTION_DURATION_MS = 21_000;
export const HITS_PER_SECTION = 5;
export const MAX_MISSES = 3;

export function getStopByOrder(order: number): TrailStop {
  return trailStops[Math.min(order, trailStops.length - 1)];
}

export function getStopById(id: string): TrailStop | undefined {
  return trailStops.find((stop) => stop.id === id);
}
