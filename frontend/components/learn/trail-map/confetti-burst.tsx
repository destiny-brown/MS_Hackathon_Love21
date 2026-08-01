"use client";

import { useMemo } from "react";

const CONFETTI_COLORS = ["#e8543e", "#f5c34d", "#0f769e", "#1f2933", "#e8543e"];

/** A radiating confetti burst used for the "big celebration" on a correct answer. Shared by every stage. */
export function ConfettiBurst({ count = 14 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 60 + Math.random() * 50;
        return {
          id: i,
          tx: `${Math.cos(angle) * dist}px`,
          ty: `${Math.sin(angle) * dist - 20}px`,
          rot: `${Math.round(Math.random() * 360)}deg`,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: `${Math.random() * 80}ms`,
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/3" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="anim-confetti-burst absolute block h-2 w-2 rounded-sm"
          style={{ background: p.color, ["--tx" as string]: p.tx, ["--ty" as string]: p.ty, ["--rot" as string]: p.rot, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
}
