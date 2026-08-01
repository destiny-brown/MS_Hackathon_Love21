"use client";

import type { LocationTheme } from "@/lib/day-locations-data";

const CORAL = "#991b1b";
const CORAL_LIGHT = "#C6534C";
const SEA = "#1e3a5f";
const SEA_LIGHT = "#3b82f6";
const INK = "#1A1A1A";
const CREAM = "#F8F4EB";
const SKIN = "#F5D0A8";

type LocationMascotProps = {
  theme: LocationTheme;
  size?: number;
  className?: string;
};

export function LocationMascot({ theme, size = 200, className = "" }: LocationMascotProps) {
  const commonDefs = (
    <defs>
      <linearGradient id="m-skin" x1="30" y1="20" x2="70" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE4C4" />
        <stop offset="1" stopColor={SKIN} />
      </linearGradient>
      <linearGradient id="m-shirt" x1="35" y1="50" x2="65" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E8E1D4" />
      </linearGradient>
      <linearGradient id="m-coral" x1="30" y1="25" x2="70" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor={CORAL_LIGHT} />
        <stop offset="0.55" stopColor={CORAL} />
        <stop offset="1" stopColor="#640000" />
      </linearGradient>
      <linearGradient id="m-sea" x1="30" y1="45" x2="70" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor={SEA_LIGHT} />
        <stop offset="1" stopColor={SEA} />
      </linearGradient>
    </defs>
  );

  // Shared head group (positioned at 0,0 relative to its transform)
  const headGroup = (x: number, y: number, scale = 1, bandana = true, helmet = false) => (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Neck */}
      <rect x="-6" y="14" width="12" height="10" fill={SKIN} />
      {/* Head */}
      <circle cx="0" cy="0" r="18" fill="url(#m-skin)" stroke={INK} strokeWidth="1.4" />
      {/* Hair */}
      <path d="M-16 -6 C-14 -18 -6 -22 0 -22 C8 -22 16 -16 16 -6 C10 -12 -10 -12 -16 -6 Z" fill={INK} />
      {/* Eyes */}
      <ellipse cx="-6" cy="2" rx="2.4" ry="3" fill={INK} />
      <ellipse cx="6" cy="2" rx="2.4" ry="3" fill={INK} />
      <circle cx="-6.8" cy="0.8" r="0.8" fill="#fff" />
      <circle cx="5.2" cy="0.8" r="0.8" fill="#fff" />
      {/* Mouth */}
      <path d="M-5 10 Q0 14 5 10" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="-11" cy="7" r="2.5" fill={CORAL_LIGHT} opacity="0.22" />
      <circle cx="11" cy="7" r="2.5" fill={CORAL_LIGHT} opacity="0.22" />
      {/* Bandana or Helmet */}
      {bandana && (
        <>
          <path d="M-16 -4 C-10 -14 10 -14 16 -4 L14 2 C6 -2 -6 -2 -14 2 Z" fill="url(#m-coral)" stroke={INK} strokeWidth="1" />
          <path d="M15 -3 L22 -7 L18 2 Z" fill="url(#m-coral)" stroke={INK} strokeWidth="1" />
          <circle cx="0" cy="-6" r="6" fill={CREAM} opacity="0.95" />
          <text x="0" y="-3.5" textAnchor="middle" fontSize="7" fontWeight="900" fill={CORAL} fontFamily="sans-serif">21</text>
        </>
      )}
      {helmet && (
        <>
          <path d="M-18 -6 C-14 -20 14 -20 18 -6 L16 0 C8 -4 -8 -4 -16 0 Z" fill={CORAL} stroke={INK} strokeWidth="1.2" />
          <path d="M17 -5 L24 -9 L20 0 Z" fill={CORAL} stroke={INK} strokeWidth="1" />
          <circle cx="0" cy="-10" r="5.5" fill={CREAM} stroke={INK} strokeWidth="0.8" />
          <text x="0" y="-7.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill={CORAL} fontFamily="sans-serif">21</text>
        </>
      )}
    </g>
  );

  // Torso with Team 21 logo
  const torsoGroup = (x: number, y: number, angle = 0) => (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <path d="M-16 0 C-10 -6 10 -6 16 0 L12 28 C6 32 -6 32 -12 28 Z" fill="url(#m-shirt)" stroke={INK} strokeWidth="1.4" />
      <path d="M-10 6 C-4 10 4 10 10 6" fill="none" stroke={SEA} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="0" cy="16" r="7" fill={CORAL} />
      <path d="M-3 15.5 L0 18.5 L5 13.5" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );

  switch (theme) {
    case "track": // Cycling
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          {/* Ground shadow */}
          <ellipse cx="100" cy="175" rx="60" ry="5" fill={INK} opacity="0.1" />
          {/* Speed lines */}
          <g opacity="0.15">
            <line x1="20" y1="130" x2="5" y2="130" stroke={CORAL} strokeWidth="2" strokeLinecap="round" />
            <line x1="25" y1="145" x2="8" y2="145" stroke={CORAL} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="115" x2="2" y2="115" stroke={SEA} strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Back wheel */}
          <g transform="translate(60, 150)">
            <circle cx="0" cy="0" r="24" fill="none" stroke={INK} strokeWidth="3" />
            <g className="origin-center" style={{ animation: "spin 0.8s linear infinite" }}>
              <line x1="0" y1="-24" x2="0" y2="24" stroke="#ddd" strokeWidth="1.5" />
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#ddd" strokeWidth="1.5" />
              <line x1="-17" y1="-17" x2="17" y2="17" stroke="#ddd" strokeWidth="1.5" />
              <line x1="-17" y1="17" x2="17" y2="-17" stroke="#ddd" strokeWidth="1.5" />
            </g>
          </g>
          {/* Front wheel */}
          <g transform="translate(145, 150)">
            <circle cx="0" cy="0" r="24" fill="none" stroke={INK} strokeWidth="3" />
            <g className="origin-center" style={{ animation: "spin 0.8s linear infinite" }}>
              <line x1="0" y1="-24" x2="0" y2="24" stroke="#ddd" strokeWidth="1.5" />
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#ddd" strokeWidth="1.5" />
              <line x1="-17" y1="-17" x2="17" y2="17" stroke="#ddd" strokeWidth="1.5" />
              <line x1="-17" y1="17" x2="17" y2="-17" stroke="#ddd" strokeWidth="1.5" />
            </g>
          </g>
          {/* Bike frame */}
          <path d="M60 150 L90 110 L135 110 L145 150" fill="none" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M90 110 L78 150" fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" />
          <path d="M90 110 L125 132 L145 150" fill="none" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Handlebars */}
          <path d="M130 110 L130 95 L148 92" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          {/* Seat */}
          <path d="M82 110 L80 100 L96 100" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Legs pedaling */}
          <path d="M88 125 L96 142 L82 150" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="80" cy="152" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <path d="M95 125 L102 140 L118 142" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="120" cy="143" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Torso leaning forward */}
          {torsoGroup(100, 95, 15)}
          {/* Arms to handlebars */}
          <path d="M92 90 L110 86 L140 80" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="142" cy="79" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {/* Head with helmet */}
          {headGroup(95, 68, 1, false, true)}
        </svg>
      );

    case "wall": // Climbing
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          {/* Wall */}
          <rect x="60" y="20" width="80" height="170" rx="4" fill="#e8e4de" stroke={INK} strokeWidth="2" />
          {/* Wall texture / holds */}
          <circle cx="85" cy="55" r="8" fill={CORAL} stroke={INK} strokeWidth="1.5" />
          <circle cx="120" cy="80" r="7" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <circle cx="90" cy="110" r="9" fill="#d4a843" stroke={INK} strokeWidth="1.5" />
          <circle cx="125" cy="140" r="7" fill={CORAL} stroke={INK} strokeWidth="1.5" />
          <circle cx="80" cy="165" r="8" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Climbing rope */}
          <line x1="100" y1="10" x2="100" y2="60" stroke="#8B7355" strokeWidth="2.5" strokeDasharray="4 2" />
          {/* Harness */}
          <path d="M88 95 L112 95 L110 108 L90 108 Z" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <line x1="100" y1="95" x2="100" y2="60" stroke="#8B7355" strokeWidth="2" />
          {/* Legs */}
          <path d="M92 108 L85 130 L88 150" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="90" cy="152" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <path d="M108 108 L118 128 L128 142" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="130" cy="144" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Torso angled */}
          {torsoGroup(100, 80, -5)}
          {/* Arms reaching up */}
          <path d="M92 72 L82 58 L85 48" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="86" cy="46" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          <path d="M108 72 L120 82 L125 78" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="127" cy="76" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {/* Head looking up */}
          {headGroup(100, 48, 1, true, false)}
          {/* Sweat drop */}
          <path d="M115 42 Q117 38 115 35 Q113 38 115 42" fill="#60a5fa" opacity="0.6" />
        </svg>
      );

    case "stadium": // Running
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          {/* Track lines */}
          <ellipse cx="100" cy="170" rx="70" ry="10" fill="none" stroke="#e8e4de" strokeWidth="2" />
          <ellipse cx="100" cy="170" rx="50" ry="7" fill="none" stroke="#e8e4de" strokeWidth="1.5" />
          {/* Shadow */}
          <ellipse cx="95" cy="168" rx="25" ry="4" fill={INK} opacity="0.12" />
          {/* Back leg (running) */}
          <path d="M88 125 L72 140 L58 135" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="55" cy="134" rx="8" ry="4" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Front leg */}
          <path d="M92 125 L108 138 L125 128" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="128" cy="127" rx="8" ry="4" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Torso */}
          {torsoGroup(90, 95, -8)}
          {/* Arms */}
          <path d="M82 88 L65 82 L55 92" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="53" cy="94" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          <path d="M98 88 L118 78 L130 68" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="132" cy="66" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {/* Head */}
          {headGroup(88, 68, 1, true, false)}
          {/* Motion lines */}
          <line x1="30" y1="100" x2="10" y2="100" stroke={CORAL} strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
          <line x1="35" y1="115" x2="18" y2="115" stroke={CORAL} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
        </svg>
      );

    case "court": // Basketball
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          {/* Court floor */}
          <path d="M20 170 L180 170 L160 150 L40 150 Z" fill="#e8e4de" stroke={INK} strokeWidth="1.5" />
          <line x1="50" y1="150" x2="60" y2="170" stroke="#d4c4b0" strokeWidth="1" />
          <line x1="150" y1="150" x2="140" y2="170" stroke="#d4c4b0" strokeWidth="1" />
          {/* Shadow */}
          <ellipse cx="95" cy="168" rx="22" ry="4" fill={INK} opacity="0.1" />
          {/* Legs */}
          <path d="M88 128 L82 148 L78 162" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="76" cy="164" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <path d="M96 128 L108 146 L118 158" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="120" cy="160" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Torso jumping */}
          {torsoGroup(92, 98, -12)}
          {/* Arms with ball */}
          <path d="M84 92 L68 82 L58 72" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="56" cy="70" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          <path d="M100 90 L118 78 L128 62" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="130" cy="60" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {/* Basketball */}
          <circle cx="128" cy="55" r="14" fill="#d97706" stroke={INK} strokeWidth="1.5" />
          <path d="M118 48 Q128 55 138 48" fill="none" stroke={INK} strokeWidth="1" />
          <line x1="128" y1="41" x2="128" y2="69" stroke={INK} strokeWidth="1" />
          {/* Head */}
          {headGroup(90, 72, 1, true, false)}
        </svg>
      );

    case "harbour": // Dragon boat / rowing
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          {/* Water */}
          <path d="M10 165 Q50 155 100 165 Q150 175 190 165" fill="none" stroke={SEA} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          <path d="M15 172 Q55 162 105 172 Q155 182 195 172" fill="none" stroke={SEA} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
          {/* Boat */}
          <path d="M50 155 Q100 148 150 155 L145 162 Q100 168 55 162 Z" fill={CORAL} stroke={INK} strokeWidth="1.5" />
          <path d="M60 158 L140 158" stroke={CREAM} strokeWidth="1.5" opacity="0.5" />
          {/* Shadow */}
          <ellipse cx="95" cy="162" rx="30" ry="3" fill={INK} opacity="0.1" />
          {/* Legs */}
          <path d="M88 125 L85 145 L82 155" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="80" cy="157" rx="7" ry="3" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <path d="M96 125 L100 145 L108 155" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="110" cy="157" rx="7" ry="3" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Torso */}
          {torsoGroup(92, 100, 5)}
          {/* Arms with paddle */}
          <path d="M84 94 L70 100 L60 108" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="58" cy="110" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          <path d="M100 92 L115 86 L125 78" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="127" cy="76" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {/* Paddle */}
          <line x1="58" y1="110" x2="45" y2="140" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="42" cy="148" rx="6" ry="10" fill={CORAL} stroke={INK} strokeWidth="1.5" transform="rotate(-20 42 148)" />
          {/* Head */}
          {headGroup(92, 74, 1, true, false)}
          {/* Water splash */}
          <circle cx="40" cy="152" r="3" fill="#60a5fa" opacity="0.4" />
          <circle cx="35" cy="148" r="2" fill="#60a5fa" opacity="0.3" />
        </svg>
      );

    case "festival": // Celebrating
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          {/* Ground */}
          <ellipse cx="100" cy="175" rx="55" ry="5" fill={INK} opacity="0.08" />
          {/* Confetti */}
          <rect x="50" y="40" width="5" height="5" fill={CORAL} transform="rotate(15 52 42)" opacity="0.8" />
          <rect x="140" y="35" width="4" height="6" fill={SEA} transform="rotate(-20 142 38)" opacity="0.7" />
          <rect x="70" y="25" width="3" height="4" fill="#d4a843" transform="rotate(45 71 27)" opacity="0.8" />
          <rect x="160" y="55" width="5" height="3" fill={CORAL} transform="rotate(-10 162 56)" opacity="0.6" />
          <circle cx="45" cy="60" r="2.5" fill={SEA} opacity="0.6" />
          <circle cx="155" cy="45" r="2" fill="#d4a843" opacity="0.7" />
          {/* Legs (jumping) */}
          <path d="M85 128 L75 148 L68 158" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="66" cy="160" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <path d="M95 128 L108 146 L120 152" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="122" cy="154" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {/* Torso */}
          {torsoGroup(90, 100, -3)}
          {/* Arms up */}
          <path d="M82 92 L65 72 L55 58" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="53" cy="56" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          <path d="M98 92 L118 70 L132 55" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="134" cy="53" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {/* Head (happy) */}
          {headGroup(90, 72, 1, true, false)}
          {/* Happy eyes */}
          <path d="M82 70 Q86 66 90 70" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M94 70 Q98 66 102 70" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
          {/* Trophy / medal */}
          <line x1="132" y1="55" x2="132" y2="75" stroke="#d4a843" strokeWidth="2" />
          <circle cx="132" cy="82" r="6" fill="#d4a843" stroke={INK} strokeWidth="1" />
          <text x="132" y="84.5" textAnchor="middle" fontSize="6" fontWeight="900" fill="#fff" fontFamily="sans-serif\">1</text>
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className={`overflow-visible ${className}`}>
          {commonDefs}
          <ellipse cx="100" cy="175" rx="25" ry="5" fill={INK} opacity="0.12" />
          <path d="M85 130 L85 155 L78 168" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="76" cy="170" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          <path d="M95 130 L100 155 L112 168" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="114" cy="170" rx="7" ry="3.5" fill={SEA} stroke={INK} strokeWidth="1.5" />
          {torsoGroup(90, 100)}
          <path d="M82 92 L68 100 L58 110" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="56" cy="112" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          <path d="M98 92 L112 100 L122 110" fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
          <circle cx="124" cy="112" r="4.5" fill={SKIN} stroke={INK} strokeWidth="1" />
          {headGroup(90, 72, 1, true, false)}
        </svg>
      );
  }
}