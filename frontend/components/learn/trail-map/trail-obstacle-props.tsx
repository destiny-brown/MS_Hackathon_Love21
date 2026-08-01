import type { EventKind } from "@/lib/day-locations-data";

type ObstacleProps = {
  kind: EventKind;
  accent?: string;
};

export function TrailObstacle({ kind, accent = "#E8543E" }: ObstacleProps) {
  switch (kind) {
    case "hurdle":
    case "hurdle-final":
      return (
        <svg viewBox="0 0 80 72" width="80" height="72" aria-hidden className="drop-shadow-md">
          <rect x="8" y="48" width="64" height="6" rx="2" fill={accent} opacity="0.35" />
          <rect x="14" y="22" width="6" height="32" rx="2" fill="#1A1A1A" />
          <rect x="60" y="22" width="6" height="32" rx="2" fill="#1A1A1A" />
          <rect x="12" y="18" width="56" height="5" rx="2" fill={accent} />
          {kind === "hurdle-final" && (
            <text x="40" y="14" textAnchor="middle" fontSize="8" fontWeight="800" fill={accent}>
              FINAL
            </text>
          )}
        </svg>
      );
    case "javelin":
      return (
        <svg viewBox="0 0 72 72" width="72" height="72" aria-hidden className="drop-shadow-md">
          <line x1="10" y1="58" x2="62" y2="58" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="58" x2="36" y2="18" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <polygon points="36,12 32,22 40,22" fill={accent} />
          <circle cx="36" cy="58" r="4" fill="#307582" opacity="0.5" />
        </svg>
      );
    case "longjump":
      return (
        <svg viewBox="0 0 88 64" width="88" height="64" aria-hidden className="drop-shadow-md">
          <rect x="4" y="36" width="80" height="22" rx="4" fill="#D4A574" stroke="#B8895A" strokeWidth="1.5" />
          <path d="M8 42 Q24 34 44 38 T80 40" fill="none" stroke="#C49A6C" strokeWidth="2" />
          <line x1="4" y1="36" x2="84" y2="36" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="6 4" />
        </svg>
      );
    case "polevault":
      return (
        <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden className="drop-shadow-md">
          <rect x="10" y="62" width="60" height="4" rx="2" fill="#B8B0A8" />
          <rect x="18" y="28" width="4" height="36" rx="1" fill="#1A1A1A" />
          <rect x="58" y="28" width="4" height="36" rx="1" fill="#1A1A1A" />
          <rect x="16" y="24" width="48" height="4" rx="2" fill={accent} />
          <ellipse cx="40" cy="26" rx="20" ry="3" fill={accent} opacity="0.2" />
        </svg>
      );
    case "dragonboat":
      return (
        <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden className="drop-shadow-md">
          <circle cx="32" cy="32" r="22" fill="none" stroke="#307582" strokeWidth="3" strokeDasharray="8 6" />
          <path d="M32 14 L36 22 L28 22 Z" fill="#E8543E" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 72" width="64" height="72" aria-hidden className="drop-shadow-md">
          <rect x="8" y="8" width="48" height="32" rx="4" fill="#fff" stroke="#1A1A1A" strokeWidth="1.5" />
          <rect x="8" y="8" width="48" height="10" fill={accent} rx="4" />
          <text x="32" y="28" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1A1A1A">
            FINISH
          </text>
          <rect x="28" y="40" width="8" height="24" fill="#1A1A1A" />
        </svg>
      );
  }
}
