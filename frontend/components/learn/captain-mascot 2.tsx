import { useId } from "react";

import type { CaptainMood, CaptainOutfit } from "@/lib/captain-character";
import type { StreakCosmetic } from "@/lib/trail-map-storage";

type CaptainMascotProps = {
  mood?: CaptainMood;
  outfit?: CaptainOutfit;
  cosmetic?: StreakCosmetic | null;
  size?: number;
  className?: string;
  pulse?: boolean;
  label?: string;
};

const CORAL = "#900000";
const CORAL_LIGHT = "#C6534C";
const SEA = "#307582";
const SEA_LIGHT = "#73B4B6";
const INK = "#1A1A1A";
const CREAM = "#F8F4EB";
const SKIN = "#F5D0A8";
const GOLD = "#D7A92E";

export function CaptainMascot({
  mood = "idle",
  outfit = "default",
  cosmetic = null,
  size = 120,
  className = "",
  pulse = false,
  label = "Captain 21 mascot",
}: CaptainMascotProps) {
  const id = useId().replace(/:/g, "");
  const skinGradient = `${id}-skin`;
  const shirtGradient = `${id}-shirt`;
  const coralGradient = `${id}-coral`;
  const seaGradient = `${id}-sea`;
  const goldGradient = `${id}-gold`;
  const softShadow = `${id}-shadow`;
  const eyeY = mood === "happy" || mood === "cheering" ? 47 : 48;
  const mouth =
    mood === "cheering"
      ? "M43 59 Q50 67 57 59 Q50 64 43 59"
      : mood === "happy"
        ? "M43 58 Q50 64 57 58"
        : mood === "thinking"
          ? "M46 59 Q50 57 54 59"
          : "M44 58 Q50 62 56 58";
  const bandanaFill = cosmetic === "harbour-glow" || cosmetic === "trail-legend" ? `url(#${goldGradient})` : `url(#${coralGradient})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
      className={`overflow-visible drop-shadow-[0_8px_12px_rgba(26,26,26,0.16)] ${pulse ? "animate-[captain-bounce_0.5s_ease-in-out_infinite]" : ""} ${className}`}
    >
      <defs>
        <linearGradient id={skinGradient} x1="34" y1="26" x2="66" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE4C4" />
          <stop offset="1" stopColor={SKIN} />
        </linearGradient>
        <linearGradient id={shirtGradient} x1="36" y1="51" x2="62" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E8E1D4" />
        </linearGradient>
        <linearGradient id={coralGradient} x1="32" y1="26" x2="68" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor={CORAL_LIGHT} />
          <stop offset="0.55" stopColor={CORAL} />
          <stop offset="1" stopColor="#640000" />
        </linearGradient>
        <linearGradient id={seaGradient} x1="30" y1="46" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor={SEA_LIGHT} />
          <stop offset="1" stopColor={SEA} />
        </linearGradient>
        <linearGradient id={goldGradient} x1="32" y1="26" x2="68" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4D66F" />
          <stop offset="0.55" stopColor={GOLD} />
          <stop offset="1" stopColor="#9A6811" />
        </linearGradient>
        <filter id={softShadow} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor={INK} floodOpacity="0.2" />
        </filter>
      </defs>

      <ellipse cx="50" cy="93" rx="24" ry="4.5" fill={INK} opacity="0.14" />

      {(cosmetic === "warmup-cape" || cosmetic === "trail-legend") && (
        <path
          d="M35 49 C26 56 24 72 28 84 C36 79 43 72 50 62 C57 72 64 79 72 84 C76 72 74 56 65 49 Z"
          fill={cosmetic === "trail-legend" ? `url(#${coralGradient})` : `url(#${seaGradient})`}
          stroke={INK}
          strokeWidth="1"
          opacity="0.95"
        />
      )}

      <path d="M38 73 H49 L48 86 H39 Z" fill={SEA} stroke={INK} strokeWidth="1.2" />
      <path d="M51 73 H62 L61 86 H52 Z" fill={SEA} stroke={INK} strokeWidth="1.2" />
      <path d="M36 84 H49 V90 H35 C34 88 34.5 86 36 84 Z" fill={INK} />
      <path d="M51 84 H64 C65.5 86 66 88 65 90 H51 Z" fill={INK} />
      <path d="M36 84 H48" stroke={CREAM} strokeWidth="1.2" opacity="0.75" />
      <path d="M52 84 H64" stroke={CREAM} strokeWidth="1.2" opacity="0.75" />

      <path
        d="M34 51 C38 47 43 45 50 45 C57 45 62 47 66 51 L62 76 C55 79 45 79 38 76 Z"
        fill={`url(#${shirtGradient})`}
        stroke={INK}
        strokeWidth="1.4"
        filter={`url(#${softShadow})`}
      />
      <path d="M38 52 C44 58 56 58 62 52" fill="none" stroke={SEA} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="50" cy="64" r="7" fill={CORAL} />
      <path d="M46 63.5 L49 66.5 L55 60.5" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {outfit === "athlete" && (
        <>
          <path d="M35 74 H65 L62 80 H38 Z" fill={`url(#${seaGradient})`} stroke={INK} strokeWidth="1" />
          <text x="50" y="73" textAnchor="middle" fontSize="5" fontWeight="800" fill={SEA}>TEAM 21</text>
        </>
      )}
      {outfit === "dancer" && (
        <path d="M62 49 C72 52 77 60 72 69 C67 63 64 57 62 49 Z" fill={`url(#${seaGradient})`} stroke={INK} strokeWidth="1" />
      )}
      {outfit === "coach" && (
        <>
          <path d="M61 50 Q69 57 68 66" fill="none" stroke={INK} strokeWidth="1.5" />
          <rect x="65" y="63" width="8" height="5" rx="2" fill={`url(#${coralGradient})`} stroke={INK} strokeWidth="1" />
        </>
      )}
      {outfit === "leader" && (
        <path d="M59 53 H68 V68 H59 Z" fill={`url(#${coralGradient})`} stroke={INK} strokeWidth="1" />
      )}
      {outfit === "teammate" && (
        <path d="M36 57 H64 V61 H36 Z" fill={`url(#${coralGradient})`} opacity="0.9" />
      )}
      {outfit === "buddy" && (
        <path d="M35 53 C31 48 25 54 35 62 C45 54 39 48 35 53 Z" fill={SEA} stroke={CREAM} strokeWidth="1" />
      )}

      <path
        d={mood === "cheering" ? "M35 53 Q29 48 24 39" : mood === "thinking" ? "M35 55 Q28 60 31 68" : "M35 55 Q28 59 25 66"}
        stroke={SKIN}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d={mood === "cheering" ? "M65 53 Q71 48 76 39" : mood === "thinking" ? "M65 55 Q72 58 68 44" : "M65 55 Q72 59 75 66"}
        stroke={SKIN}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <circle cx="32" cy="44" r="4" fill={SKIN} stroke={INK} strokeWidth="1" />
      <circle cx="68" cy="44" r="4" fill={SKIN} stroke={INK} strokeWidth="1" />
      <circle cx="50" cy="39" r="19" fill={`url(#${skinGradient})`} stroke={INK} strokeWidth="1.4" filter={`url(#${softShadow})`} />
      <path d="M34 37 C35 24 43 19 53 20 C62 21 67 28 67 38 C60 31 43 29 34 37 Z" fill={INK} />

      <path
        d="M32 33 C39 25 61 25 68 33 L66 40 C57 37 43 37 34 40 Z"
        fill={bandanaFill}
        stroke={INK}
        strokeWidth="1"
      />
      <path d="M67 34 L77 29 L72 40 Z" fill={bandanaFill} stroke={INK} strokeWidth="1" />
      <circle cx="50" cy="34" r="6.5" fill={CREAM} opacity="0.95" />
      <text x="50" y="36.5" textAnchor="middle" fontSize="7" fontWeight="900" fill={CORAL} fontFamily="sans-serif">
        21
      </text>

      {cosmetic === "harbour-glow" && (
        <>
          <circle cx="50" cy="40" r="25" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.65" />
          <circle cx="27" cy="28" r="2" fill={GOLD} />
          <circle cx="73" cy="23" r="1.5" fill={GOLD} />
        </>
      )}

      {mood === "happy" || mood === "cheering" ? (
        <>
          <path d="M39 47 Q43 43 47 47" stroke={INK} strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <path d="M53 47 Q57 43 61 47" stroke={INK} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="43" cy={eyeY} rx="2.4" ry="3" fill={INK} />
          <ellipse cx="57" cy={eyeY} rx="2.4" ry="3" fill={INK} />
          <circle cx="42.2" cy={eyeY - 1} r="0.7" fill="white" />
          <circle cx="56.2" cy={eyeY - 1} r="0.7" fill="white" />
        </>
      )}
      {mood === "thinking" && <path d="M54 42 Q59 40 62 43" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />}
      <path d={mouth} stroke={INK} strokeWidth="1.7" fill={mood === "cheering" ? CORAL : "none"} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="37" cy="55" r="2.5" fill={CORAL_LIGHT} opacity="0.22" />
      <circle cx="63" cy="55" r="2.5" fill={CORAL_LIGHT} opacity="0.22" />

      {mood === "cheering" && (
        <g transform="rotate(25 78 44)" filter={`url(#${softShadow})`}>
          <rect x="76" y="34" width="5" height="20" rx="2.5" fill={`url(#${seaGradient})`} stroke={INK} strokeWidth="1" />
          <path d="M77 39 H80 M77 49 H80" stroke={CREAM} strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}
