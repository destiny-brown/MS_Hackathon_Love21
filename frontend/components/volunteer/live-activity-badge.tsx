"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

export function LiveActivityBadge() {
  const volunteers = useCountUp(214, 1400);
  const shiftsToday = useCountUp(6, 1000);

  return (
    <div className="mt-8 inline-flex w-full items-center gap-4 rounded-2xl border border-brand-light bg-white p-4 shadow-sm shadow-black/5 sm:w-auto">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-red" />
      </span>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif-display text-2xl leading-none text-brand-dark">{volunteers}</span>
          <span className="text-xs text-brand-dark/60">volunteers active this month</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5 border-t border-dashed border-brand-dark/15 pt-1.5">
          <span className="font-serif-display text-lg leading-none text-brand-dark">{shiftsToday}</span>
          <span className="text-xs text-brand-dark/50">shifts running today</span>
        </div>
      </div>
    </div>
  );
}
