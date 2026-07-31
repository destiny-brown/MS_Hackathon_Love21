"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, HeartHandshake } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { impactPillars } from "@/lib/impact-data";

const viewport = { once: false, amount: 0.15 } as const;

const pillarImages: Record<(typeof impactPillars)[number]["id"], string> = {
  nutrition: "/images/nutrition.png",
  fitness: "/images/fitness.png",
  sports: "/images/sports.png",
  family: "/images/family.png",
  community: "/images/csr.png",
};

export function ImpactPillars() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewport);
  const [index, setIndex] = useState(0);
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
      className="border-b border-brand-sand bg-brand-cream px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-coral">
            <HeartHandshake className="h-4 w-4" />
            The Butterfly Metamorphosis
          </p>
          <h2 className="mt-3 font-serif-display text-3xl text-brand-ink sm:text-4xl">
            The 5 Pillars of Impact
          </h2>
          <p className="mt-3 max-w-2xl text-brand-ink/70">
            From nourishment to taking flight — each pillar marks a stage of
            growth for members and families.
          </p>
        </motion.div>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Previous pillar"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border-white/40 bg-white/90 p-0 text-brand-ink shadow-sm hover:bg-white sm:left-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Next pillar"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border-white/40 bg-white/90 p-0 text-brand-ink shadow-sm hover:bg-white sm:right-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="overflow-hidden rounded-2xl border border-brand-sand shadow-sm">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.35 }}
                className="relative min-h-[420px] overflow-hidden"
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

                <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                      <ActiveIcon className="h-5 w-5" />
                    </span>
                    <Badge className="bg-white/90 text-brand-ink hover:bg-white">
                      {active.sessions}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-serif-display text-3xl text-white sm:text-4xl">
                    {active.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/75">{active.stage}</p>
                  <blockquote className="mt-5 max-w-2xl font-serif-display text-lg leading-snug text-white sm:text-xl">
                    &ldquo;{active.quote}&rdquo;
                  </blockquote>
                  <ul className="mt-5 max-w-2xl space-y-2">
                    {active.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex gap-3 text-sm text-white/90"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E86A45]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                        Volunteer Action
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/90">
                        {active.volunteerAction}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="shrink-0 self-end bg-brand-coral text-white hover:bg-brand-coral/90"
                    >
                      <Link href="/our-volunteer">Join as a Volunteer</Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {impactPillars.map((pillar, i) => (
            <button
              key={pillar.id}
              type="button"
              aria-label={`Go to ${pillar.title}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index
                  ? "bg-brand-coral"
                  : "bg-brand-sand hover:bg-brand-ink/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
