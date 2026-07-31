"use client";

import { useTranslation } from "react-i18next";

import type { LocationDay } from "@/lib/day-locations-data";
import { useTranslatedTrailDays } from "@/lib/i18n/translated-data";

const THEME_ICON: Record<LocationDay["theme"], string> = {
  stadium: "🏟️",
  harbour: "🚣",
  court: "🏀",
  wall: "🧗",
  track: "🚴",
  festival: "🎉",
};

interface DayMapStripProps {
  /** 1-based day number the player is currently on (can exceed 6 — the trail loops) */
  currentDayNumber: number;
  /** 0..1 progress through the current day's 5 events, for the connecting line */
  currentDayProgress: number;
  completedLoops: number;
}

export function DayMapStrip({ currentDayNumber, currentDayProgress, completedLoops }: DayMapStripProps) {
  const { t } = useTranslation("learn");
  const translatedDays = useTranslatedTrailDays();
  const currentIndex = (currentDayNumber - 1) % translatedDays.length;

  return (
    <div className="rounded-2xl border border-brand-sand bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/45">
          {t("ui.trailTitle")}{" "}
          {completedLoops > 0 && (
            <span className="text-brand-coral">· {t("ui.loop", { n: completedLoops + 1 })}</span>
          )}
        </p>
        <p className="text-xs font-semibold text-brand-ink/45">{t("ui.day", { n: currentDayNumber })}</p>
      </div>

      <div className="relative mt-5">
        {/* connecting track line */}
        <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-brand-sand sm:top-7" aria-hidden />
        <div
          className="absolute left-0 top-6 h-1 rounded-full bg-brand-coral transition-all duration-700 ease-out sm:top-7"
          style={{
            width: `${((currentIndex + currentDayProgress) / (translatedDays.length - 1)) * 100}%`,
          }}
          aria-hidden
        />

        <ol className="relative grid grid-cols-3 gap-y-6 sm:grid-cols-6 sm:gap-y-0" aria-label="Trail locations">
          {translatedDays.map((location, index) => {
            const isPast = index < currentIndex;
            const isActive = index === currentIndex;
            return (
              <li key={location.id} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl transition sm:h-14 sm:w-14 ${
                    isActive
                      ? "border-brand-coral bg-brand-coral text-white shadow-md scale-110"
                      : isPast
                        ? "border-brand-sea bg-brand-sea/10 text-brand-sea"
                        : "border-brand-sand bg-brand-cream text-brand-ink/40"
                  }`}
                >
                  {THEME_ICON[location.theme]}
                </div>
                <p className={`mt-2 text-[11px] font-semibold leading-tight sm:text-xs ${isActive ? "text-brand-ink" : "text-brand-ink/50"}`}>
                  {location.title}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
