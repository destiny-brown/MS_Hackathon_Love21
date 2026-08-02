import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Dumbbell,
  Trophy,
  Users,
  Handshake,
} from "lucide-react";

export const growingForestQuote =
  "What started as a small spark of hope has grown into a thriving community where every individual has the space to flourish.";

export const financialRootsQuote =
  "Every dollar given is a vote of confidence in a member's strength, and we honor that trust by directing it straight to where it matters most.";

export type GrowthSeriesPoint = {
  year: string;
  value: number;
};

export type GrowthCategory = {
  title: string;
  unit: string;
  series: GrowthSeriesPoint[];
};

export type GrowthCategoryKey = "families" | "sessions" | "activities";

export const growthData: Record<GrowthCategoryKey, GrowthCategory> = {
  families: {
    title: "Expanding Our Community Family",
    unit: "Families",
    series: [
      { year: "21-22", value: 230 },
      { year: "22-23", value: 300 },
      { year: "Current", value: 490 },
    ],
  },
  sessions: {
    title: "Scaling Active Engagement",
    unit: "Sessions",
    series: [
      { year: "21-22", value: 2205 },
      { year: "22-23", value: 2800 },
      { year: "Current", value: 6859 },
    ],
  },
  activities: {
    title: "Diversifying Holistic Care",
    unit: "Activity Types",
    series: [
      { year: "21-22", value: 40 },
      { year: "22-23", value: 50 },
      { year: "Current", value: 84 },
    ],
  },
};

export const growthCategoryOrder: GrowthCategoryKey[] = [
  "families",
  "sessions",
  "activities",
];

export const financialBreakdown = [
  {
    name: "Core Programs & Services",
    value: 86,
    amount: "HKD $9.94M",
    color: "#2A7A7B",
  },
  {
    name: "Fundraising Events & Growth",
    value: 8,
    amount: "HKD $0.92M",
    color: "#E86A45",
  },
  {
    name: "Governance & Administration",
    value: 6,
    amount: "HKD $0.69M",
    color: "#8FA3A8",
  },
];

export const auditedReports = [
  { label: "FY 2024/25 Audited Report", href: "/our-finance" },
  { label: "FY 2023/24 Audited Report", href: "/our-finance" },
];

export type ImpactPillar = {
  id: string;
  title: string;
  stage: string;
  sessions: string;
  quote: string;
  details: string[];
  ctaLabel: string;
  icon: LucideIcon;
};

export const impactPillars: ImpactPillar[] = [
  {
    id: "nutrition",
    title: "Nutrition",
    stage: "Stage 1: Nourishment & Foundation",
    sessions: "1,489 Sessions Offered",
    quote:
      "Proper health and nutrition aren't just about food—they are the essential foundation that allows strength and confidence to take root.",
    details: [
      "Facilitate healthy cooking classes",
      "Assist with nutrition material preparation",
      "Support meal preparation workshops",
    ],
    ctaLabel: "Nourish Our Butterfly",
    icon: Apple,
  },
  {
    id: "fitness",
    title: "Fitness",
    stage: "Stage 2: Building Core Strength",
    sessions: "1,504 Sessions Offered",
    quote:
      "We don't lower the bar—we train our members to break right through it.",
    details: [
      "Assist trainers during group workouts",
      "Provide one-on-one encouragement",
      "Guide exercises",
    ],
    ctaLabel: "Strengthen Our Butterfly",
    icon: Dumbbell,
  },
  {
    id: "sports",
    title: "Sports",
    stage: "Stage 3: Spreading Wings",
    sessions: "2,792 Sessions Offered",
    quote:
      "Sports gave our athletes a stage to shine, showing everyone that passion and grit beat expectations every time.",
    details: [
      "Co-coach sports teams",
      "Assist with equipment setup",
      "Support sports workshops and competitive event trips",
    ],
    ctaLabel: "Protect Our Butterfly",
    icon: Trophy,
  },
  {
    id: "family",
    title: "Family Support",
    stage: "Stage 4: The Protective Cocoon",
    sessions: "930 Sessions Offered",
    quote:
      "Love 21 didn't just give my child a place to train—they gave our entire household a sanctuary of unconditional support.",
    details: [
      "Support parent wellness events",
      "Assist with childcare during caregiver workshops",
      "Host community gatherings",
    ],
    ctaLabel: "Spread Wings",
    icon: Users,
  },
  {
    id: "community",
    title: "Community & Education",
    stage: "Stage 5: Taking Flight into Society",
    sessions: "Ongoing",
    quote:
      "Inclusion isn't about fitting into society—it's about building a world where everyone's unique talents are recognized and celebrated.",
    details: [
      "Corporate team volunteering and event logistics support",
      "Social skills buddying",
      "Career mentoring for member-employees",
    ],
    ctaLabel: "Soar with Us",
    icon: Handshake,
  },
];

export type ImpactStory = {
  role: string;
  name: string;
  quote: string;
  highlight: string;
  image: string;
  alt: string;
  href?: string;
};

/** Member stories mirrored from /stories-media (same source as homepage Featured Stories). */
export const impactStories: ImpactStory[] = [
  {
    role: "Yuk Lam's Story",
    name: "Yuk Lam",
    quote:
      "I would use the word 'home' to describe Love 21,\" said Yuk Lam's mother, \"Every coach and staff member at Love 21 treats Yuk Lam like a sibling.",
    highlight: "Sports · Fitness · Family Support",
    image: "/images/yuklam.png",
    alt: "Yuk Lam",
    href: "/stories/yuk-lam",
  },
  {
    role: "Siu Kei's Story (By Siu Kei's Mother)",
    name: "Siu Kei",
    quote:
      "He took on assistant roles across multiple departments, which significantly enhanced his social interaction skills, sense of responsibility, and ability to adapt knowledge to real-world scenarios.",
    highlight: "Employment Programs · Community and Education",
    image: "/images/siukei.png",
    alt: "Siu Kei",
    href: "/stories/siu-kei",
  },
  {
    role: "Brian Ngan's Story (By Brian's Father)",
    name: "Brian Ngan",
    quote:
      "Since childhood Brian was quite protected and did not think he had any strengths and abilities. Fortunately after joining Love 21 we have quickly learnt how capable and talented he truly is.",
    highlight: "Employment Programs · Family Support",
    image: "/images/brianngan.png",
    alt: "Brian Ngan",
    href: "/stories/brian-ngan",
  },
  {
    role: "Marissa's Story (By Marissa's Mom)",
    name: "Marissa",
    quote:
      "Sports development programme. Staff offered invaluable guidance, specialised fitness training and bocce classes.",
    highlight: "Sports · Fitness · Family Support",
    image: "/images/marissa.png",
    alt: "Marissa",
    href: "/stories/marissa",
  },
];
