"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Trees } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  growingForestQuote,
  growthCategoryOrder,
  growthData,
  type GrowthCategoryKey,
} from "@/lib/impact-data";

const viewport = { once: false, amount: 0.25 } as const;

const CHART = {
  width: 640,
  height: 280,
  padX: 28,
  padY: 36,
} as const;

function GrowthLineChart({
  categoryKey,
  inView,
}: {
  categoryKey: GrowthCategoryKey;
  inView: boolean;
}) {
  const category = growthData[categoryKey];
  const series = category.series;
  const maxValue = Math.max(...series.map((point) => point.value)) * 1.12;
  const plotWidth = CHART.width - CHART.padX * 2;
  const plotHeight = CHART.height - CHART.padY * 2;

  const points = useMemo(
    () =>
      series.map((point, index) => {
        const x =
          CHART.padX +
          (series.length === 1
            ? plotWidth / 2
            : (index / (series.length - 1)) * plotWidth);
        const y = CHART.padY + plotHeight * (1 - point.value / maxValue);
        return { ...point, x, y };
      }),
    [series, maxValue, plotWidth, plotHeight],
  );

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART.height - CHART.padY} L ${points[0].x} ${CHART.height - CHART.padY} Z`;

  const current = series[series.length - 1];
  const previous = series[series.length - 2];
  const growthPct =
    previous && previous.value > 0
      ? Math.round(((current.value - previous.value) / previous.value) * 100)
      : null;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">
        {category.unit}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-md font-serif-display text-2xl leading-snug text-brand-ink sm:text-3xl">
          {category.title}
        </h2>
        <div className="text-right">
          <p className="font-serif-display text-3xl text-brand-coral sm:text-4xl">
            {current.value.toLocaleString()}
          </p>
          {growthPct !== null ? (
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              +{growthPct}% vs prior year
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-10 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          className="h-auto w-full min-w-[280px]"
          role="img"
          aria-label={`${category.title} growth from ${series[0].year} to ${current.year}`}
        >
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = CHART.padY + plotHeight * (1 - ratio);
            return (
              <line
                key={ratio}
                x1={CHART.padX}
                x2={CHART.width - CHART.padX}
                y1={y}
                y2={y}
                stroke="rgba(43, 45, 66, 0.06)"
                strokeWidth="1"
              />
            );
          })}

          <AnimatePresence mode="wait">
            <motion.path
              key={`${categoryKey}-area`}
              d={areaPath}
              fill="rgba(42, 122, 123, 0.1)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.path
              key={`${categoryKey}-line`}
              d={linePath}
              fill="none"
              stroke="#2A7A7B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                inView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          </AnimatePresence>

          {points.map((point, index) => (
            <g key={`${categoryKey}-${point.year}`}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={index === points.length - 1 ? 7 : 5}
                fill={index === points.length - 1 ? "#E86A45" : "#2A7A7B"}
                stroke="#fff"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.35, delay: 0.2 + index * 0.12 }}
              />
              <text
                x={point.x}
                y={CHART.height - 12}
                textAnchor="middle"
                className="fill-brand-ink/55"
                fontSize="12"
                fontWeight="600"
              >
                {point.year}
              </text>
              <text
                x={point.x}
                y={point.y - 14}
                textAnchor="middle"
                className="fill-brand-ink"
                fontSize="12"
                fontWeight="700"
              >
                {point.value.toLocaleString()}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function MetricBanner() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewport);
  const [activeCategory, setActiveCategory] =
    useState<GrowthCategoryKey>("families");

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.45 }}
          className="mb-16 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-coral">
              <Trees className="h-4 w-4" />
              The Growing Forest
            </p>
            <h1 className="mt-4 font-serif-display text-4xl text-brand-ink sm:text-5xl">
              Our Growth
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-brand-ink/60 sm:text-right">
            Seed to canopy — measuring how Love 21&apos;s community grows in
            reach, care, and capability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16"
        >
          <nav
            aria-label="Growth categories"
            className="flex flex-row gap-10 overflow-x-auto pb-2 lg:flex-col lg:gap-12 lg:overflow-visible lg:pb-0"
          >
            {growthCategoryOrder.map((key) => {
              const category = growthData[key];
              const selected = key === activeCategory;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveCategory(key)}
                  className="min-w-[7rem] text-left transition lg:min-w-0"
                >
                  <span
                    className={cn(
                      "block text-xs font-bold uppercase tracking-[0.2em]",
                      selected ? "text-brand-coral" : "text-brand-ink/35",
                    )}
                  >
                    {category.unit}
                  </span>
                  <span
                    className={cn(
                      "mt-2 block text-sm leading-snug",
                      selected
                        ? "font-medium text-brand-ink"
                        : "text-brand-ink/45",
                    )}
                  >
                    {category.title}
                  </span>
                </button>
              );
            })}
          </nav>

          <GrowthLineChart categoryKey={activeCategory} inView={inView} />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
          className="mt-20 max-w-3xl font-serif-display text-xl leading-snug text-brand-ink/80 sm:text-2xl"
        >
          &ldquo;{growingForestQuote}&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}
