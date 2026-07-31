export type DonorBadge = {
  id: string;
  title: string;
  description: string;
  status: "unlocked" | "locked";
  icon: "trophy" | "flame" | "apple" | "lock";
};

export type PillarAllocation = {
  name: string;
  value: number;
  color: string;
};

export type ImpactFeedItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
};

export const donorProfile = {
  name: "Alex Chen",
  welcomeQuote: "Your generosity has given wings to 3 families this year.",
};

export const donorImpactStats = {
  totalDonated: 1250,
  sessionsUnlocked: 42,
  mealsFunded: 120,
};

export const donorMetamorphosis = {
  level: 3,
  title: "Chrysalis Guardian",
  nextTier: "Winged Sponsor",
  progressPercent: 75,
  badgeImage: "/images/pupa.png",
};

export const pillarAllocation: PillarAllocation[] = [
  { name: "Nutrition", value: 28, color: "#2A7A7B" },
  { name: "Fitness", value: 22, color: "#E86A45" },
  { name: "Community", value: 20, color: "#4C6B8A" },
  { name: "Empowerment", value: 18, color: "#C4A35A" },
  { name: "Flight", value: 12, color: "#8FA3A8" },
];

export const donorBadges: DonorBadge[] = [
  {
    id: "first-gift",
    title: "First Gift",
    description: "Made your first contribution to Love 21.",
    status: "unlocked",
    icon: "trophy",
  },
  {
    id: "six-month-streak",
    title: "6-Month Streak",
    description: "Supported the community for six months in a row.",
    status: "unlocked",
    icon: "flame",
  },
  {
    id: "nutrition-angel",
    title: "Nutrition Angel",
    description: "Helped fund healthy meals and cooking workshops.",
    status: "unlocked",
    icon: "apple",
  },
  {
    id: "master-coach",
    title: "Master Coach Sponsor",
    description: "Unlock by funding 10 coaching sessions.",
    status: "locked",
    icon: "lock",
  },
];

export const impactFeed: ImpactFeedItem[] = [
  {
    id: "1",
    date: "May 20, 2026",
    title: "Cooking class in session",
    detail:
      "12 members attended the cooking class funded by your contribution.",
  },
  {
    id: "2",
    date: "April 8, 2026",
    title: "Fitness breakthrough",
    detail:
      "A family you sponsored completed their first full mobility assessment.",
  },
  {
    id: "3",
    date: "March 2, 2026",
    title: "Sports day energy",
    detail:
      "Your gift helped kit 8 athletes for an inclusive community sports day.",
  },
];
