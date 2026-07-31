import type { EventKind, LocationTheme } from "@/lib/day-locations-data";

export type ScenePalette = {
  gradient: string;
  ground: string;
  accent: string;
  glow: string;
  ambientEmoji: string;
};

export const LOCATION_SCENES: Record<LocationTheme, ScenePalette> = {
  stadium: {
    gradient: "from-[#FFE4D6] via-[#FFF8F0] to-[#DDF2E8]",
    ground: "#E7D2C3",
    accent: "#E8543E",
    glow: "rgba(232,84,62,0.18)",
    ambientEmoji: "🏟️",
  },
  harbour: {
    gradient: "from-[#CFE7EE] via-[#EAF6F2] to-[#B8D9E8]",
    ground: "#7EB8C9",
    accent: "#307582",
    glow: "rgba(48,117,130,0.22)",
    ambientEmoji: "🌊",
  },
  court: {
    gradient: "from-[#F7E8BC] via-[#FFF8E8] to-[#F4D6C8]",
    ground: "#D4A574",
    accent: "#C6534C",
    glow: "rgba(198,83,76,0.16)",
    ambientEmoji: "🏀",
  },
  wall: {
    gradient: "from-[#E6E0F2] via-[#F8F4EB] to-[#DDEEEE]",
    ground: "#B8B0A8",
    accent: "#307582",
    glow: "rgba(48,117,130,0.15)",
    ambientEmoji: "🧗",
  },
  track: {
    gradient: "from-[#D8EEF5] via-[#EAF6F2] to-[#DCEFD8]",
    ground: "#C4C4C4",
    accent: "#307582",
    glow: "rgba(48,117,130,0.18)",
    ambientEmoji: "🚴",
  },
  festival: {
    gradient: "from-[#F9DCCF] via-[#FFF4D8] to-[#E1EFD9]",
    ground: "#E8C9A8",
    accent: "#E8543E",
    glow: "rgba(232,84,62,0.2)",
    ambientEmoji: "🎉",
  },
};

export const EVENT_OBSTACLE_LABEL: Record<EventKind, string> = {
  hurdle: "Hurdle lane",
  "hurdle-final": "Final hurdle",
  javelin: "Throw line",
  longjump: "Sand pit",
  polevault: "Vault bar",
  dragonboat: "Checkpoint",
  generic: "Finish line",
};
