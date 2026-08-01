"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import type { LocationTheme } from "@/lib/day-locations-data";

import { LOCATION_SCENES } from "./trail-scene-config";

type TrailSceneShellProps = {
  theme: LocationTheme;
  eventLabel: string;
  statusBadge?: ReactNode;
  heightClass?: string;
  children: ReactNode;
};

export function TrailSceneShell({
  theme,
  eventLabel,
  statusBadge,
  heightClass = "h-64 sm:h-72",
  children,
}: TrailSceneShellProps) {
  const scene = LOCATION_SCENES[theme];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-brand-sand/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ${heightClass}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient}`} />

      {/* soft ambient glow */}
      <div
        className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full blur-3xl"
        style={{ background: scene.glow }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 bottom-16 h-32 w-32 rounded-full blur-3xl"
        style={{ background: scene.glow }}
        aria-hidden
      />

      {/* parallax backdrop icon */}
      <motion.div
        className="pointer-events-none absolute right-6 top-5 select-none text-6xl opacity-[0.12] sm:text-7xl"
        animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        {scene.ambientEmoji}
      </motion.div>

      {/* ground plane */}
      <div className="absolute inset-x-0 bottom-0 h-[28%]" aria-hidden>
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${scene.ground}, transparent)` }} />
        <div className="absolute inset-x-0 top-0 h-px bg-brand-ink/10" />
        <div className="trail-scene-grid absolute inset-x-0 top-2 h-full opacity-[0.14]" />
      </div>

      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink shadow-sm backdrop-blur-sm">
        {eventLabel}
      </div>

      {statusBadge ? <div className="absolute right-4 top-4 z-20">{statusBadge}</div> : null}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
