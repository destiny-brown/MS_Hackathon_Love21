"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type PageSectionNavItem = {
  id: string;
  label: string;
};

export type PageSectionNavProps = {
  items: PageSectionNavItem[];
  /** CSS selector for the hero element that must leave the viewport before the nav appears. */
  heroSelector: string;
  ariaLabel?: string;
  className?: string;
};

export function PageSectionNav({
  items,
  heroSelector,
  ariaLabel = "On this page",
  className,
}: PageSectionNavProps) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    if (!hero) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroSelector]);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    setActiveId(id);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-brand-light bg-white/95 backdrop-blur-sm transition-[transform,opacity] duration-300 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
        className,
      )}
      aria-hidden={!visible}
      inert={visible ? undefined : true}
    >
      <nav aria-label={ariaLabel} className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-between gap-0.5 py-1.5 sm:justify-start sm:gap-1 sm:py-2">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="min-w-0 shrink">
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex min-h-9 items-center justify-center border-b-2 px-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 sm:min-h-11 sm:px-3 sm:text-sm",
                    isActive
                      ? "border-brand-red text-brand-dark"
                      : "border-transparent text-brand-slate hover:text-brand-dark",
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
