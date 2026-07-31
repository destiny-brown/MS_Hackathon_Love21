"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, HeartHandshake } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useImpactUi, useTranslatedImpactPillars } from "@/lib/i18n/translated-data";
import { cn } from "@/lib/utils";
import type { ImpactPillar } from "@/lib/impact-data";

const viewport = { once: false, amount: 0.15 } as const;

const pillarImages: Record<ImpactPillar["id"], string> = {
  nutrition: "/images/nutrition.png",
  fitness: "/images/fitness.png",
  sports: "/images/sports.png",
  family: "/images/family.png",
  community: "/images/csr.png",
};

const stageImages = [
  "/images/egg.png",
  "/images/catepillar.png",
  "/images/pupa.png",
  "/images/emerging butterfly.png",
  "/images/butterfly.png",
] as const;

export function ImpactPillars() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewport);
  const [index, setIndex] = useState(0);
  const impactPillars = useTranslatedImpactPillars();
  const ui = useImpactUi();
  const active = impactPillars[index];
  const ActiveIcon = active.icon;

  const go = (direction: -1 | 1) => {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) return impactPillars.length - 1;
      if (next >= impactPillars.length) return 0;
      return next;
    });
  };

  return (
    <section
      ref={ref}
      className="border-b border-brand-sand bg-brand-cream px-4 py-8 sm:px-6 lg:max-h-[100dvh] lg:overflow-hidden lg:px-8 lg:py-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col lg:h-[calc(100dvh-5.5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-4 shrink-0"
        >
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">
            <HeartHandshake className="h-3.5 w-3.5" />
            {ui("butterflyMetamorphosis", "The Butterfly Metamorphosis")}
          </p>
          <h2 className="mt-1.5 font-serif-display text-2xl text-brand-ink sm:text-3xl">
            {ui("fivePillars", "The 5 Pillars of Impact")}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-brand-ink/70">
            {ui(
              "pillarsIntro",
              "From nourishment to taking flight — each pillar marks a stage of growth for members and families.",
            )}
          </p>
        </motion.div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12 lg:items-stretch lg:gap-6">
          <nav
            aria-label={ui("metamorphosisStages", "Metamorphosis stages")}
            className="min-h-0 lg:col-span-3"
          >
            <div className="relative flex h-full flex-row items-center justify-between gap-2 overflow-x-auto pb-1 lg:flex-col lg:justify-between lg:gap-1 lg:overflow-visible lg:pb-0">
              {impactPillars.map((pillar, i) => {
                const selected = i === index;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    aria-label={ui("stageLabel", `Stage ${i + 1}: ${pillar.title}`)}
                    aria-current={selected ? "step" : undefined}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "relative z-10 w-16 shrink-0 bg-brand-cream px-1 transition duration-300 sm:w-20 lg:w-full lg:max-h-[18%]",
                      selected
                        ? "scale-105 opacity-100"
                        : "opacity-45 grayscale hover:opacity-100 hover:grayscale-0",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stageImages[i]}
                      alt=""
                      className="mx-auto h-full max-h-16 w-auto object-contain lg:max-h-full"
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="relative flex min-h-[320px] lg:col-span-9 lg:min-h-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={ui("prevPillar", "Previous pillar")}
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full border-white/20 bg-white/35 p-0 text-brand-ink/70 shadow-none backdrop-blur-[2px] hover:bg-white/55 hover:text-brand-ink sm:left-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={ui("nextPillar", "Next pillar")}
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full border-white/20 bg-white/35 p-0 text-brand-ink/70 shadow-none backdrop-blur-[2px] hover:bg-white/55 hover:text-brand-ink sm:right-3"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="h-full w-full overflow-hidden rounded-2xl border border-brand-sand shadow-sm">
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.id}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-full min-h-[320px] overflow-hidden lg:min-h-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillarImages[active.id]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-[#1A2B3D]/55"
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between p-4 sm:p-6 lg:min-h-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                        <ActiveIcon className="h-4 w-4" />
                      </span>
                      <Badge className="bg-white/90 text-brand-ink hover:bg-white">
                        {active.sessions}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-serif-display text-2xl text-white sm:text-3xl">
                        {active.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-white/75">{active.stage}</p>
                      <blockquote className="mt-2 max-w-2xl font-serif-display text-base leading-snug text-white sm:text-lg">
                        &ldquo;{active.quote}&rdquo;
                      </blockquote>
                      <ul className="mt-2 max-w-2xl space-y-1">
                        {active.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex gap-2 text-xs text-white/90 sm:text-sm"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E86A45]" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex justify-end">
                        <Button
                          asChild
                          size="sm"
                          className="shrink-0 border border-white/35 bg-white/15 text-white shadow-none backdrop-blur-md hover:bg-white/25 hover:text-white"
                        >
                          <Link href="/our-volunteer">{active.ctaLabel}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
