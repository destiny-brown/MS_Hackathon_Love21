"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useImpactUi, useTranslatedImpactStories } from "@/lib/i18n/translated-data";

const viewport = { once: false, amount: 0.2 } as const;

export function ImpactStories() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewport);
  const [index, setIndex] = useState(0);
  const impactStories = useTranslatedImpactStories();
  const ui = useImpactUi();
  const story = impactStories[index];

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % impactStories.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [inView, impactStories.length]);

  const go = (direction: -1 | 1) => {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) return impactStories.length - 1;
      if (next >= impactStories.length) return 0;
      return next;
    });
  };

  return (
    <section
      ref={ref}
      className="border-b border-brand-sand bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-coral">
              <Sparkles className="h-4 w-4" />
              {ui("strengthSpotlights", "Strength-Based Spotlights")}
            </p>
            <h2 className="mt-3 font-serif-display text-3xl text-brand-ink sm:text-4xl">
              {ui("impactStories", "Impact Stories")}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={ui("prevStory", "Previous story")}
              onClick={() => go(-1)}
              className="border-brand-sand"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={ui("nextStory", "Next story")}
              onClick={() => go(1)}
              className="border-brand-sand"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="overflow-hidden rounded-2xl border border-brand-sand bg-brand-cream/40">
          <AnimatePresence mode="wait">
            <motion.article
              key={story.name}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2"
            >
              <div className="relative min-h-[240px] lg:min-h-[360px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.image}
                  alt={story.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <Badge variant="outline" className="w-fit">
                  {story.role}
                </Badge>
                <h3 className="mt-4 font-serif-display text-3xl text-brand-ink">
                  {story.name}
                </h3>
                <blockquote className="mt-4 text-lg leading-relaxed text-brand-ink/85">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand-sea">
                  {story.highlight}
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {impactStories.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={ui("goToStory", `Go to story ${i + 1}`)}
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
