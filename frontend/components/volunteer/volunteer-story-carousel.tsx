"use client";

import { useEffect, useState } from "react";

import { TriMark } from "@/components/brand/TriMark";
import { volunteerStories } from "@/components/volunteer/volunteer-data";

export function VolunteerStoryCarousel() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % volunteerStories.length);
        setFade(true);
      }, 200);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function go(next: number) {
    setFade(false);
    setTimeout(() => {
      setIndex((next + volunteerStories.length) % volunteerStories.length);
      setFade(true);
    }, 200);
  }

  const active = volunteerStories[index];

  return (
    <div>
      <div className={`transition-opacity duration-300 motion-reduce:transition-none ${fade ? "opacity-100" : "opacity-0"}`}>
        <blockquote className="font-serif-display text-3xl leading-snug text-brand-dark sm:text-4xl">&ldquo;{active.quote}&rdquo;</blockquote>
        <p className="mt-5 text-sm font-semibold text-brand-dark/60">{active.name}</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <TriMark className="h-2 w-7 text-brand-red/40" />
        <div className="flex gap-1.5">
          {volunteerStories.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Show story ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-red" : "w-1.5 bg-brand-dark/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
