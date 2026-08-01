"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { TestimonialCard } from "@/components/TestimonialCard";
import { useTranslatedMemberStories } from "@/lib/i18n/translated-data";
import { tx } from "@/lib/i18n/translate";

const LOOP_COPIES = 3;

export function TestimonialCarousel() {
  const { t } = useTranslation("media");
  const stories = useTranslatedMemberStories();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isJumping = useRef(false);

  const getMetrics = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return null;
    const card = scroller.querySelector<HTMLElement>("[data-testimonial-card]");
    if (!card) return null;
    const styles = getComputedStyle(scroller);
    const gap = parseFloat(styles.columnGap || styles.gap || "24") || 24;
    const cardStep = card.offsetWidth + gap;
    const setWidth = cardStep * stories.length;
    return { scroller, cardStep, setWidth };
  }, [stories.length]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const metrics = getMetrics();
      if (!metrics) return;
      const previousBehavior = metrics.scroller.style.scrollBehavior;
      metrics.scroller.style.scrollBehavior = "auto";
      metrics.scroller.scrollLeft = metrics.setWidth;
      metrics.scroller.style.scrollBehavior = previousBehavior;
    });
    return () => cancelAnimationFrame(frame);
  }, [getMetrics]);

  function normalizeScroll() {
    const metrics = getMetrics();
    if (!metrics || isJumping.current) return;
    const { scroller, setWidth } = metrics;
    const { scrollLeft } = scroller;

    if (scrollLeft < setWidth * 0.5 || scrollLeft >= setWidth * 1.5) {
      isJumping.current = true;
      const next =
        scrollLeft < setWidth * 0.5 ? scrollLeft + setWidth : scrollLeft - setWidth;
      const previousBehavior = scroller.style.scrollBehavior;
      scroller.style.scrollBehavior = "auto";
      scroller.scrollLeft = next;
      scroller.style.scrollBehavior = previousBehavior;
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    }
  }

  function scrollByCard(direction: -1 | 1) {
    const metrics = getMetrics();
    if (!metrics) return;
    metrics.scroller.scrollBy({ left: direction * metrics.cardStep, behavior: "smooth" });
  }

  const looped = Array.from({ length: LOOP_COPIES }, (_, copyIndex) =>
    stories.map((story) => ({
      ...story,
      loopKey: `${copyIndex}-${story.slug}`,
    })),
  ).flat();

  const readLabel = tx(t, "memberStories.readStory", "Read Story →");
  const carouselLabel = tx(t, "memberStories.carouselLabel", "Member stories carousel");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label={tx(t, "memberStories.prev", "Previous member story")}
        className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-slate/60 bg-white/95 text-brand-dark shadow-sm transition hover:border-brand-red hover:text-brand-red sm:left-3"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label={tx(t, "memberStories.next", "Next member story")}
        className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-slate/60 bg-white/95 text-brand-dark shadow-sm transition hover:border-brand-red hover:text-brand-red sm:right-3"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        ref={scrollerRef}
        onScroll={normalizeScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={carouselLabel}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollByCard(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollByCard(1);
          }
        }}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 [&::-webkit-scrollbar]:hidden"
      >
        {looped.map((story) => (
          <div
            key={story.loopKey}
            data-testimonial-card
            className="flex w-[17rem] shrink-0 snap-start sm:w-80 lg:w-96"
          >
            <TestimonialCard
              name={story.name}
              quote={story.quote}
              bgImage={story.bgImage}
              categories={story.categories}
              storyUrl={`/stories/${story.slug}`}
              readLabel={readLabel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
