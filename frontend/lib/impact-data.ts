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
  volunteerAction: string;
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
      "Comprehensive dietary guidance and healthy cooking workshops",
      "Data-driven health monitoring with pre- and post-program blood tests",
      "Practical education on meal planning and gut health",
    ],
    volunteerAction:
      "Facilitate healthy cooking classes, assist with nutrition material preparation, and support meal preparation workshops.",
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
      "Tailored physical training to improve strength, mobility, and cardiovascular health",
      "Objective progress tracking through regular body composition analysis",
      "Structured group workouts that build lasting confidence",
    ],
    volunteerAction:
      "Assist trainers during group workouts, provide one-on-one encouragement, and guide exercises.",
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
      "Diverse athletic offerings across 84 activity types — trampoline, Latin dance, basketball, outdoor sports",
      "Training pipelines for open athletic events and the Special Olympics",
      "Emphasis on teamwork, grit, and self-belief",
    ],
    volunteerAction:
      "Co-coach sports teams, assist with equipment setup, participate in sports workshops, and support competitive event trips.",
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
      "Dedicated Family Support Team providing targeted 1:1 counseling and mental wellness assistance",
      "Caregiver empowerment through parent fitness, stress-relief, and peer support",
      '"Family Living Room" community space for connection and rest',
    ],
    volunteerAction:
      "Support parent wellness events, assist with childcare during caregiver workshops, and host community gatherings.",
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
      "Employment & Development Programme — training and employing members as assistant coaches, receptionists, and administrative assistants",
      "Social inclusion events including Disco Diverso and Celebration of Ability",
      "Corporate CSR workshops that celebrate neurodiverse talent",
    ],
    volunteerAction:
      "Corporate team volunteering, event logistics support, social skills buddying, and career mentoring for member-employees.",
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
};

export const impactStories: ImpactStory[] = [
  {
    role: "Member Athlete",
    name: "Alex",
    quote:
      "On the trampoline I found rhythm, courage, and a team that cheers every landing. Sport taught me I can lead — not just follow.",
    highlight: "Special Olympics pathway · Team captain energy",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80",
    alt: "Member athlete training with focus and joy",
  },
  {
    role: "Parent / Caregiver",
    name: "Helen",
    quote:
      "Love 21 gave our whole household a sanctuary. While my child builds strength, I finally have peers who understand — and space to breathe.",
    highlight: "Family Living Room · Caregiver wellness",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    alt: "Parent and caregiver finding community support",
  },
  {
    role: "Assistant Coach",
    name: "Chris",
    quote:
      "From member to assistant coach — I now teach the skills that changed my life. Employment here means purpose, pay, and belonging.",
    highlight: "Employment & Development Programme",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1000&q=80",
    alt: "Assistant coach mentoring peers at Love 21",
  },
];
