export type Category = "sport" | "nutrition" | "family" | "csr";

export type RosterItem = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  when: string;
  where: string;
  category: Category;
  filled?: number;
  total?: number;
  note?: string;
  ctaLabel: string;
};

export type Interest = "hands-on" | "food" | "people" | "skills";
export type Availability = "weekday-am" | "weekday-pm" | "weekend-am" | "flexible";

export const categoryMeta: Record<Category, { label: string; blurb: string }> = {
  sport: { label: "Sport", blurb: "Football, swimming, karate & more" },
  nutrition: { label: "Nutrition", blurb: "Cooking, dietician days" },
  family: { label: "Family", blurb: "Counselling, mentorship, events" },
  csr: { label: "CSR", blurb: "Corporate volunteering" },
};

export const rosterItems: RosterItem[] = [
  {
    id: "football-basketball",
    icon: "⚽",
    title: "Football & basketball coach",
    desc: "Help run our weekly ball-game sessions — no coaching certificate needed, just energy and patience.",
    when: "Saturday mornings",
    where: "San Po Kong centre",
    category: "sport",
    filled: 3,
    total: 5,
    ctaLabel: "I'm interested",
  },
  {
    id: "swimming-dragonboat",
    icon: "🏊",
    title: "Swimming & dragon boat buddy",
    desc: "Support our water-based sessions — a splash of confidence, one paddle at a time.",
    when: "Sunday mornings",
    where: "Victoria Park pool",
    category: "sport",
    filled: 17,
    total: 20,
    ctaLabel: "I'm interested",
  },
  {
    id: "trampoline-karate",
    icon: "🥋",
    title: "Trampoline & karate class helper",
    desc: "Cheer on the same members who've gone on to win medals at Asian Para-Karate events.",
    when: "Wednesday evenings",
    where: "San Po Kong centre",
    category: "sport",
    filled: 2,
    total: 5,
    ctaLabel: "I'm interested",
  },
  {
    id: "cooking-workshop",
    icon: "🥗",
    title: "Cooking workshop helper",
    desc: "Assist our monthly healthy-cooking classes where members and parents learn recipes together.",
    when: "One Sunday a month",
    where: "San Po Kong kitchen",
    category: "nutrition",
    filled: 1,
    total: 6,
    ctaLabel: "I'm interested",
  },
  {
    id: "dietician-day",
    icon: "📋",
    title: "Dietician day & health points assistant",
    desc: "Welcome families to their monthly one-on-one nutrition check-ins and help track the health points they earn.",
    when: "Weekday afternoons",
    where: "San Po Kong centre",
    category: "nutrition",
    filled: 11,
    total: 20,
    ctaLabel: "I'm interested",
  },
  {
    id: "family-counselling",
    icon: "💬",
    title: "Family counselling support",
    desc: "Front-of-house support around our parent counselling sessions — greeting families, not delivering counselling.",
    when: "Weekday mornings",
    where: "San Po Kong centre",
    category: "family",
    filled: 3,
    total: 10,
    ctaLabel: "I'm interested",
  },
  {
    id: "mentorship-buddy",
    icon: "🤝",
    title: "Mentorship programme buddy",
    desc: "Get matched 1:1 with a member and work toward a shared weekly activity goal, side by side.",
    when: "Weekly, your schedule",
    where: "Varies by activity",
    category: "family",
    filled: 12,
    total: 20,
    ctaLabel: "I'm interested",
  },
  {
    id: "community-dinners",
    icon: "🎉",
    title: "Community dinners & trips crew",
    desc: "Help run the dinners, outings and away trips that keep the whole Love 21 family close.",
    when: "Occasional evenings/weekends",
    where: "Varies",
    category: "family",
    filled: 9,
    total: 20,
    ctaLabel: "I'm interested",
  },
  {
    id: "corporate-day",
    icon: "🏢",
    title: "Corporate volunteer day",
    desc: "Bring your team for a hands-on day at our San Po Kong centre — no experience needed, just show up together.",
    when: "Book a date for your team",
    where: "San Po Kong centre",
    category: "csr",
    note: "2 dates booked this quarter",
    ctaLabel: "Book a date",
  },
  {
    id: "skills-based",
    icon: "💡",
    title: "Skills-based placement",
    desc: "Offer your professional skills — design, marketing, legal — pro bono, on your own schedule.",
    when: "Flexible",
    where: "Remote or on-site",
    category: "csr",
    filled: 3,
    total: 12,
    ctaLabel: "I'm interested",
  },
];

export const interestOptions: { key: Interest; label: string; blurb: string; category: Category }[] = [
  { key: "hands-on", label: "Hands-on & active", blurb: "Sport, coaching, being on the move", category: "sport" },
  { key: "food", label: "Food & wellbeing", blurb: "Cooking, nutrition, health check-ins", category: "nutrition" },
  { key: "people", label: "People & connection", blurb: "Counselling support, mentorship, events", category: "family" },
  { key: "skills", label: "My professional skills", blurb: "Design, marketing, legal, corporate days", category: "csr" },
];

export const availabilityOptions: { key: Availability; label: string; matchWhen: string[] }[] = [
  { key: "weekday-am", label: "Weekday mornings", matchWhen: ["weekday mornings"] },
  { key: "weekday-pm", label: "Weekday afternoons/evenings", matchWhen: ["weekday afternoons", "wednesday evenings"] },
  { key: "weekend-am", label: "Weekend mornings", matchWhen: ["saturday mornings", "sunday mornings"] },
  {
    key: "flexible",
    label: "Flexible — it varies",
    matchWhen: ["flexible", "varies", "one sunday a month", "occasional", "weekly, your schedule"],
  },
];

export function scoreRosterItem(item: RosterItem, interest: Interest, availability: Availability) {
  let score = 52;
  const reasons: string[] = [];
  const interestMeta = interestOptions.find((o) => o.key === interest)!;
  const availMeta = availabilityOptions.find((o) => o.key === availability)!;

  if (item.category === interestMeta.category) {
    score += 26;
    reasons.push(`You're drawn to "${interestMeta.label.toLowerCase()}" — this role sits right in that pillar.`);
  }

  const whenLower = item.when.toLowerCase();
  if (availMeta.matchWhen.some((kw) => whenLower.includes(kw))) {
    score += 16;
    reasons.push(`The timing (${item.when}) lines up with when you said you're free.`);
  }

  if (item.total && item.filled !== undefined) {
    const openRatio = 1 - item.filled / item.total;
    if (openRatio > 0.4) {
      score += 6;
      reasons.push("Plenty of open spots — you'd start right away, no waitlist.");
    }
  }

  if (reasons.length === 0) {
    reasons.push("It's a role with open capacity right now across a pillar close to what you picked.");
  }

  return { score: Math.min(score, 98), reasons };
}
