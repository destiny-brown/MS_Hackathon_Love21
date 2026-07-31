"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { SiteLayout } from "@/components/site/site-layout";
import { api, type VolunteerActivity } from "@/lib/api";
import {
  useTranslatedCategoryMeta,
  useTranslatedMatcherOptions,
  useTranslatedRosterItems,
} from "@/lib/i18n/translated-data";
import {
  categoryMeta,
  rosterItems as fallbackRosterItems,
  type Availability,
  type Category,
  type Commitment,
  type GroupSize,
  type Interest,
  type RosterItem,
} from "@/lib/volunteer-roster";

// ---------------------------------------------------------------------------
// Shared visual language (mirrors get-involved/page.tsx).
// TODO: if both pages keep growing, pull TriMark / Eyebrow / Blob / Reveal /
// CtaButton / WaveDivider into components/site/story-kit.tsx so they're not
// duplicated across files.
// ---------------------------------------------------------------------------

function TriMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 14" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="7" cy="7" r="4.5" />
      <circle cx="22" cy="7" r="4.5" />
      <circle cx="37" cy="7" r="4.5" />
    </svg>
  );
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral ${className}`}>
      <TriMark className="h-2 w-7" />
      {children}
    </p>
  );
}

function DashedRule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`mt-2 block h-px w-16 border-t border-dashed border-brand-coral/40 ${className}`} />;
}

function Blob({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

function WaveDivider({ color = "#FFFFFF", flip = false, className = "" }: { color?: string; flip?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-14 w-full overflow-hidden sm:h-20 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="h-full w-full">
        <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,50 L1440,100 L0,100 Z" fill={color} />
      </svg>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms", filter: visible ? "blur(0px)" : "blur(6px)" }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:blur-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CtaButton({
  href,
  children,
  variant = "solid",
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
  onClick?: () => void;
}) {
  const styles = {
    solid:
      "bg-brand-coral text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] hover:bg-black",
    outline: "border border-black/15 text-brand-ink hover:border-black hover:bg-black hover:text-white",
    "outline-dark": "border border-white/30 text-white hover:border-white hover:bg-white hover:text-black",
  }[variant];

  const content = (
    <>
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </>
  );

  if (onClick && !href) {
    return (
      <button onClick={onClick} className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 ${styles}`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 ${styles}`}>
      {content}
    </Link>
  );
}

function IconHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 33S6 24 6 14.5C6 9.8 9.6 7 13.5 7c2.9 0 5.3 1.6 6.5 4 1.2-2.4 3.6-4 6.5-4C30.4 7 34 9.8 34 14.5 34 24 20 33 20 33Z" />
    </svg>
  );
}
function IconTrophy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 8h14v8c0 4-3 8-7 8s-7-4-7-8V8Z" />
      <path d="M13 10H8c0 4 2 7 5 7" />
      <path d="M27 10h5c0 4-2 7-5 7" />
      <path d="M20 24v5" />
      <path d="M14 33h12" />
      <path d="M16 29h8l1 4H15l1-4Z" />
    </svg>
  );
}
function IconSpark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 5c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z" />
      <path d="M31 27c.5 3 1.5 4 4.5 4.5-3 .5-4 1.5-4.5 4.5-.5-3-1.5-4-4.5-4.5 3-.5 4-1.5 4.5-4.5Z" />
    </svg>
  );
}
function IconFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 6v28" />
      <path d="M11 8c4-3 8 2 12-1 3-2 6 0 6 0v12s-3-2-6 0c-4 3-8-2-12 1V8Z" />
    </svg>
  );
}
function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page-only content (roster + matcher data lives in lib/volunteer-roster.ts)
// ---------------------------------------------------------------------------

function mapActivityToRosterItem(activity: VolunteerActivity, defaultCta: string): RosterItem {
  return {
    id: activity.role_id,
    icon: activity.icon,
    title: activity.title,
    desc: activity.desc,
    when: activity.when,
    where: activity.where,
    category: activity.category as Category,
    filled: activity.filled ?? undefined,
    total: activity.total ?? undefined,
    note: activity.note ?? undefined,
    ctaLabel: activity.cta_label ?? defaultCta,
  };
}

const GALLERY_SHAPES = [
  "rounded-[42%_58%_65%_35%/45%_40%_60%_55%]",
  "rounded-[60%_40%_35%_65%/55%_60%_40%_45%]",
  "rounded-[35%_65%_55%_45%/60%_35%_65%_40%]",
  "rounded-[55%_45%_40%_60%/40%_55%_45%_60%]",
];

const GALLERY_SRCS = [
  "/images/get-involved/gallery-1.jpeg",
  "/images/get-involved/gallery-2.jpeg",
  "/images/get-involved/gallery-3.jpg",
  "/images/get-involved/gallery-4.jpg",
];

// ---- One-pager generator -------------------------------------------------

function generateCsrOnePager(t: TFunction<"volunteer">) {
  const win = window.open("", "_blank");
  if (!win) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Love 21 Foundation — Corporate Volunteer Day</title>
      <style>
        body { font-family: Georgia, serif; color: #17181c; max-width: 720px; margin: 60px auto; line-height: 1.6; }
        h1 { font-size: 30px; margin-bottom: 4px; }
        .tag { color: #C0392B; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; }
        .stat-row { display: flex; gap: 24px; margin: 28px 0; }
        .stat { border: 1px solid #eee; border-radius: 12px; padding: 16px 20px; flex: 1; }
        .stat b { display: block; font-size: 24px; }
        .cta { margin-top: 36px; padding: 18px 22px; background: #111; color: #fff; border-radius: 12px; }
        footer { margin-top: 40px; font-size: 12px; color: #777; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="tag">${t("page.csrOnePager.tag")}</div>
      <h1>${t("page.csrOnePager.title")}</h1>
      <p>${t("page.csrOnePager.intro")}</p>

      <div class="stat-row">
        <div class="stat"><b>600+</b>${t("page.csrOnePager.statFamilies")}</div>
        <div class="stat"><b>~1,000</b>${t("page.csrOnePager.statClasses")}</div>
        <div class="stat"><b>21 yrs</b>${t("page.csrOnePager.statYears")}</div>
      </div>

      <p><b>${t("page.csrOnePager.whatIs")}</b> ${t("page.csrOnePager.whatIsBody")}</p>

      <p><b>${t("page.csrOnePager.whyMatters")}</b> ${t("page.csrOnePager.whyMattersBody")}</p>

      <p><b>${t("page.csrOnePager.nextStep")}</b> ${t("page.csrOnePager.nextStepBody")}</p>

      <div class="cta">${t("page.csrOnePager.cta")}</div>

      <footer>${t("page.csrOnePager.footer")}</footer>

      <p class="no-print"><button onclick="window.print()">${t("page.csrOnePager.print")}</button></p>
    </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
}

// ---------------------------------------------------------------------------
// Small components
// ---------------------------------------------------------------------------

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

// Live-stat card. Sits in normal page flow now (left column, under the hero
// buttons) rather than floating over the photo. Swap the two target numbers
// for a real Supabase count() query once that's wired up.
function LiveActivityBadge() {
  const { t } = useTranslation("volunteer");
  const volunteers = useCountUp(214, 1400);
  const shiftsToday = useCountUp(6, 1000);

  return (
    <div className="mt-8 inline-flex w-full items-center gap-4 rounded-2xl border border-brand-sand bg-white p-4 shadow-sm shadow-black/5 sm:w-auto">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-coral opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-coral" />
      </span>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif-display text-2xl leading-none text-brand-ink">{volunteers}</span>
          <span className="text-xs text-brand-ink/60">{t("page.hero.volunteersActive")}</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5 border-t border-dashed border-brand-ink/15 pt-1.5">
          <span className="font-serif-display text-lg leading-none text-brand-ink">{shiftsToday}</span>
          <span className="text-xs text-brand-ink/50">{t("page.hero.shiftsToday")}</span>
        </div>
      </div>
    </div>
  );
}

function VolunteerStoryCarousel() {
  const { t } = useTranslation("volunteer");
  const volunteerStories = useMemo(
    () =>
      ["1", "2", "3"].map((id) => ({
        quote: t(`page.stories.items.${id}.quote`),
        name: t(`page.stories.items.${id}.name`),
      })),
    [t],
  );
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
  }, [volunteerStories.length]);

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
        <blockquote className="font-serif-display text-3xl leading-snug text-brand-ink sm:text-4xl">"{active.quote}"</blockquote>
        <p className="mt-5 text-sm font-semibold text-brand-ink/60">{active.name}</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <TriMark className="h-2 w-7 text-brand-coral/40" />
        <div className="flex gap-1.5">
          {volunteerStories.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={t("page.stories.showLabel", { number: i + 1 })}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-coral" : "w-1.5 bg-brand-ink/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const { t } = useTranslation("volunteer");
  const faqKeys = ["experience", "cancel", "training", "group"] as const;
  const faqs = useMemo(
    () =>
      faqKeys.map((key) => ({
        q: t(`page.faq.items.${key}.q`),
        a: t(`page.faq.items.${key}.a`),
      })),
    [t],
  );
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-brand-sand">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="py-5">
            <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 text-left" aria-expanded={isOpen}>
              <span className="font-serif-display text-lg text-brand-ink sm:text-xl">{item.q}</span>
              <span className={`shrink-0 text-2xl text-brand-coral transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`} aria-hidden="true">+</span>
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <p className="overflow-hidden text-brand-ink/70">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- AI Volunteer Match — wired to backend /ai/volunteer/match ----------------

type MatchResult = {
  item: RosterItem;
  score: number;
  reasons: string[];
};

function AiVolunteerMatch({
  rosterItems,
  onSelectRole,
}: {
  rosterItems: RosterItem[];
  onSelectRole: (title: string) => void;
}) {
  const { t } = useTranslation("volunteer");
  const matcherOptions = useTranslatedMatcherOptions();
  const [interest, setInterest] = useState<Interest | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [groupSize, setGroupSize] = useState<GroupSize | null>(null);
  const [thinking, setThinking] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [resultIndex, setResultIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiEnhanced, setAiEnhanced] = useState(false);

  async function findMatch() {
    if (!interest || !availability || !commitment || !groupSize) return;
    setThinking(true);
    setResults(null);
    setError(null);
    setAiEnhanced(false);

    try {
      const response = await api.matchVolunteer({
        interest,
        availability,
        commitment,
        group_size: groupSize,
      });
      if (!response.enabled || response.matches.length === 0) {
        setError(response.message || t("page.matcher.unavailable"));
        return;
      }

      const mapped = response.matches
        .map((match) => {
          const item = rosterItems.find((role) => role.id === match.role_id);
          if (!item) return null;
          return { item, score: match.score, reasons: match.reasons };
        })
        .filter((match): match is MatchResult => match !== null)
        .sort((a, b) => b.score - a.score);

      if (mapped.length === 0) {
        setError(t("page.matcher.mapFailed"));
        return;
      }

      setResults(mapped);
      setAiEnhanced(response.ai_enhanced);
      setResultIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("page.matcher.backendError"));
    } finally {
      setThinking(false);
    }
  }

  function reset() {
    setInterest(null);
    setAvailability(null);
    setCommitment(null);
    setGroupSize(null);
    setResults(null);
    setThinking(false);
    setError(null);
    setAiEnhanced(false);
  }

  const active = results?.[resultIndex];

  return (
    <div className="relative mx-auto max-w-4xl rounded-[32px] border border-white/15 bg-white/[0.04] p-8 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
          <IconSpark className="h-4 w-4" />
          {t("page.matcher.eyebrow")}
        </p>
        {(interest || availability || commitment || groupSize || results || error) && !thinking && (
          <button onClick={reset} className="text-xs font-semibold text-white/50 hover:text-white">
            {t("page.matcher.startOver")}
          </button>
        )}
      </div>

      <h3 className="mt-3 font-serif-display text-3xl text-white sm:text-4xl">
        {t("page.matcher.title")}
      </h3>
      <p className="mt-3 max-w-xl text-sm text-white/65">
        {t("page.matcher.subtitle")}
      </p>

      {!results && !thinking && (
        <div className="mt-8 space-y-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{t("page.matcher.step1")}</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {matcherOptions.interests.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setInterest(opt.key)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    interest === opt.key ? "border-brand-coral bg-brand-coral/10" : "border-white/15 hover:border-white/30"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{opt.label}</div>
                  <div className="mt-0.5 text-xs text-white/50">{opt.blurb}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{t("page.matcher.step2")}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {matcherOptions.availability.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAvailability(opt.key)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    availability === opt.key ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{t("page.matcher.step3")}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {matcherOptions.commitment.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setCommitment(opt.key)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    commitment === opt.key ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{t("page.matcher.step4")}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {matcherOptions.groupSize.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setGroupSize(opt.key)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    groupSize === opt.key ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={findMatch}
            disabled={!interest || !availability || !commitment || !groupSize}
            className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-brand-coral disabled:hover:text-white"
          >
            {t("page.matcher.submit")}
          </button>
        </div>
      )}

      {thinking && (
        <div className="mt-10 flex items-center gap-3 text-sm text-white/60">
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-brand-coral [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-brand-coral [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-brand-coral" />
          </span>
          {t("page.matcher.thinking")}
        </div>
      )}

      {results && active && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/50">{t("page.matcher.bestMatch")}</span>
            <div className="flex items-center gap-2">
              {aiEnhanced && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">{t("page.matcher.aiMatched")}</span>
              )}
              <span className="rounded-full bg-brand-coral/15 px-3 py-1 text-xs font-semibold text-brand-coral">
                {t("page.matcher.matchPercent", { score: active.score })}
              </span>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-brand-coral transition-all duration-700" style={{ width: `${active.score}%` }} />
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
              {active.item.icon}
            </div>
            <div>
              <h4 className="font-serif-display text-2xl text-white">{active.item.title}</h4>
              <p className="mt-1 text-sm text-white/60">
                {active.item.when} · {active.item.where}
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-2">
            {active.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral" />
                {reason}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectRole(active.item.title)}
              className="rounded-full bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              {t("page.matcher.signUp")}
            </button>
            {results.length > 1 && (
              <button
                onClick={() => setResultIndex((resultIndex + 1) % results.length)}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40"
              >
                {t("page.matcher.anotherMatch")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VolunteerPage() {
  return (
    <SiteLayout>
      <Suspense fallback={null}>
        <VolunteerContent />
      </Suspense>
    </SiteLayout>
  );
}

const ROLES_PREVIEW_COUNT = 4;

function VolunteerContent() {
  const { t } = useTranslation("volunteer");
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const initialFilter: Category | "all" = requestedCategory && requestedCategory in categoryMeta ? (requestedCategory as Category) : "all";

  const [rosterItems, setRosterItems] = useState<RosterItem[]>(fallbackRosterItems);
  const translatedRosterItems = useTranslatedRosterItems(rosterItems);
  const translatedCategoryMeta = useTranslatedCategoryMeta();
  const [filter, setFilter] = useState<Category | "all">(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>(fallbackRosterItems[0].title);
  const [submitted, setSubmitted] = useState(false);

  const socialPosts = useMemo(
    () =>
      ["1", "2", "3"].map((id) => ({
        platform: t(`page.social.posts.${id}.platform`),
        caption: t(`page.social.posts.${id}.caption`),
        date: t(`page.social.posts.${id}.date`),
        href: "#",
      })),
    [t],
  );

  const galleryStrip = useMemo(
    () =>
      GALLERY_SRCS.map((src, i) => ({
        src,
        alt: t(`page.gallery.items.${i + 1}.alt`),
        shape: GALLERY_SHAPES[i],
      })),
    [t],
  );

  const recognitionTiers = useMemo(
    () =>
      ["1", "2", "3", "4"].map((tier) => ({
        tier,
        title: t(`page.recognition.tiers.${tier}.title`),
        body: t(`page.recognition.tiers.${tier}.body`),
      })),
    [t],
  );

  useEffect(() => {
    const defaultCta = t("page.defaultCta");
    api
      .listVolunteerActivities()
      .then((activities) => {
        if (activities.length === 0) return;
        const mapped = activities.map((activity) => mapActivityToRosterItem(activity, defaultCta));
        setRosterItems(mapped);
        setSelectedOpportunity((current) =>
          mapped.some((item) => item.title === current) ? current : mapped[0].title,
        );
      })
      .catch(() => {
        // Keep local fallback roster if backend is unavailable.
      });
  }, [t]);

  const visibleItems = useMemo(() => {
    let items = filter === "all" ? translatedRosterItems : translatedRosterItems.filter((item) => item.category === filter);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.when.toLowerCase().includes(q) ||
          item.where.toLowerCase().includes(q),
      );
    }
    return items;
  }, [filter, translatedRosterItems, searchQuery]);

  useEffect(() => {
    setShowAllRoles(false);
  }, [filter, searchQuery]);

  const displayedItems = showAllRoles ? visibleItems : visibleItems.slice(0, ROLES_PREVIEW_COUNT);
  const hiddenCount = visibleItems.length - ROLES_PREVIEW_COUNT;

  const urgentItems = useMemo(
    () =>
      translatedRosterItems
        .filter((item) => item.total && item.filled !== undefined && item.filled / item.total >= 0.6)
        .sort((a, b) => b.filled! / b.total! - a.filled! / a.total!)
        .slice(0, 2),
    [translatedRosterItems],
  );

  function selectRoleAndScroll(title: string) {
    setSelectedOpportunity(title);
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-white px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <Blob className="-top-10 -right-16 h-72 w-72 bg-[#F8DCDA] opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Eyebrow>{t("page.hero.eyebrow")}</Eyebrow>
            <h1 className="mt-3 max-w-2xl font-serif-display text-4xl leading-[1.08] text-brand-ink sm:text-5xl">
              {t("page.hero.titleBefore")}{" "}
              <span className="relative text-brand-coral">
                {t("page.hero.titleHighlight")}
                <svg
                  viewBox="0 0 200 14"
                  className="absolute -bottom-1 left-0 h-3 w-full text-brand-coral/50"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9c20-8 40-8 60 0s40 8 60 0 40-8 60 0 12 3 14 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="1 8"
                  />
                </svg>
              </span>{" "}
              {t("page.hero.titleAfter")}
            </h1>
            <p className="mt-5 max-w-lg text-brand-ink/75">
              {t("page.hero.body")}
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <a href="#opportunities" className="rounded-full bg-brand-coral px-7 py-3.5 text-sm font-semibold text-white hover:bg-black">
                {t("page.hero.ctaRoles")}
              </a>
              <a href="#match" className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold text-brand-ink hover:border-black">
                {t("page.hero.ctaMatcher")}
              </a>
            </div>
            <LiveActivityBadge />
          </div>
          <div className="relative">
            <Blob className="-bottom-8 -left-10 h-40 w-40 bg-[#EAF6F2] opacity-70" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[55%_45%_35%_65%/55%_35%_65%_45%] bg-brand-sand lg:aspect-[3/4]">
              {/* Swap for a real photo of a volunteer mid-shift — energetic, not posed. */}
              <Image src="/images/get-involved/hero-image.png" alt={t("page.hero.imageAlt")} fill priority className="object-cover" />
            </div>
          </div>
        </div>
{/* 
        <div className="relative mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { value: "600+", label: "Families supported every month" },
            { value: "1,000", label: "Classes run each month" },
            { value: String(rosterItems.length + 8), label: "Volunteer roles open now" },
            { value: "4", label: "Programme areas to join" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-brand-sand px-5 py-6">
              <div className="font-serif-display text-2xl text-brand-ink">{stat.value}</div>
              <div className="mt-1 text-xs leading-snug text-brand-ink/70">{stat.label}</div>
            </div>
          ))}
        </div> */}
      </section>

      {/* ---------- START YOUR OWN CAMPAIGN ---------- */}
      <section className="border-y border-brand-sand bg-[#F8F4EB] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-2xl border border-dashed border-brand-coral/40 bg-white p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-sand">
              <IconFlag className="h-5 w-5 text-brand-coral" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("page.campaign.eyebrow")}</p>
              <h3 className="mt-1 max-w-md font-serif-display text-xl text-brand-ink sm:text-2xl">
                {t("page.campaign.title")}
              </h3>
              <p className="mt-2 max-w-md text-sm text-brand-ink/70">
                {t("page.campaign.body")}
              </p>
            </div>
          </div>
          <CtaButton href="/campaigns/new">{t("page.campaign.cta")}</CtaButton>
        </div>
      </section>

      {/* ---------- URGENCY STRIP ---------- */}
      {urgentItems.length > 0 && (
        <section className="bg-black px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white">
            <span className="flex items-center gap-2 font-semibold text-brand-coral">
              <TriMark className="h-2 w-6" />
              {t("page.urgency.label")}
            </span>
            {urgentItems.map((item) => (
              <a key={item.id} href="#opportunities" className="text-white/80 hover:text-white">
                {item.title} — {t("page.urgency.filled", { filled: item.filled!, total: item.total! })}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ---------- OPPORTUNITIES BOARD ---------- */}
      <section id="opportunities" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>{t("page.board.eyebrow")}</Eyebrow>
              <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">{t("page.board.title")}</h2>
            </div>
            <p className="max-w-md text-sm text-brand-ink/70">
              {t("page.board.subtitle")}
            </p>
          </div>

          <div className="relative mb-8">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("page.board.searchPlaceholder")}
              className="w-full rounded-full border border-dashed border-brand-ink/20 bg-white py-3 pl-11 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/40 outline-none transition focus:border-solid focus:border-brand-coral"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label={t("page.board.clearSearch")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-ink/40 hover:text-brand-ink"
              >
                {t("page.board.clearSearch")}
              </button>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              <button
                onClick={() => setFilter("all")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-semibold transition lg:rounded-none lg:border-l-2 lg:px-0 lg:pl-4 ${
                  filter === "all"
                    ? "bg-black text-white lg:bg-transparent lg:border-solid lg:border-brand-coral lg:text-brand-ink"
                    : "bg-brand-sand text-brand-ink lg:bg-transparent lg:border-dashed lg:border-brand-ink/15 lg:text-brand-ink/60"
                }`}
              >
                {t("page.board.allRoles")}
              </button>
              {(Object.keys(translatedCategoryMeta) as Category[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-semibold transition lg:rounded-none lg:border-l-2 lg:px-0 lg:pl-4 ${
                    filter === key
                      ? "bg-black text-white lg:bg-transparent lg:border-solid lg:border-brand-coral lg:text-brand-ink"
                      : "bg-brand-sand text-brand-ink lg:bg-transparent lg:border-dashed lg:border-brand-ink/15 lg:text-brand-ink/60"
                  }`}
                >
                  {translatedCategoryMeta[key].label}
                  <span className="hidden text-xs font-normal text-brand-ink/50 lg:block">{translatedCategoryMeta[key].blurb}</span>
                </button>
              ))}
            </div>

            <div>
              {displayedItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-ink/20 p-10 text-center">
                  <p className="text-sm text-brand-ink/60">
                    {searchQuery
                      ? t("page.board.noMatchQuery", { query: searchQuery })
                      : t("page.board.noMatchFilter")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                    className="mt-3 text-sm font-semibold text-brand-coral hover:underline"
                  >
                    {t("page.board.clearFilters")}
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {displayedItems.map((item, i) => {
                    const pct = item.total && item.filled !== undefined ? Math.round((item.filled / item.total) * 100) : null;
                    return (
                      <Reveal key={item.id} delay={i * 60}>
                        <article className="h-full rounded-2xl border border-brand-sand p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-sand text-lg">{item.icon}</div>
                          <h3 className="text-xl text-brand-ink">{item.title}</h3>
                          <p className="mt-2 text-sm text-brand-ink/70">{item.desc}</p>
                          <div className="mt-4 flex flex-col gap-1 text-xs text-brand-ink/60">
                            <span><b className="font-semibold text-brand-ink">{t("page.board.when")}</b> {item.when}</span>
                            <span><b className="font-semibold text-brand-ink">{t("page.board.where")}</b> {item.where}</span>
                          </div>

                          {pct !== null ? (
                            <div className="mt-4 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-sand">
                                <div className="h-full rounded-full bg-brand-coral" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="whitespace-nowrap text-xs text-brand-ink/50">{t("page.board.filled", { filled: item.filled!, total: item.total! })}</span>
                            </div>
                          ) : (
                            <div className="mt-4 text-xs text-brand-ink/50">{item.note}</div>
                          )}

                          <button
                            onClick={() => selectRoleAndScroll(item.title)}
                            className="mt-5 w-full rounded-full bg-brand-sand py-3 text-sm font-semibold text-brand-ink hover:bg-black hover:text-white"
                          >
                            {item.ctaLabel}
                          </button>

                          {item.category === "csr" && item.id === "corporate-day" && (
                            <button
                              onClick={() => generateCsrOnePager(t)}
                              className="mt-2 w-full rounded-full border border-black/15 py-2.5 text-xs font-semibold text-brand-ink hover:border-black"
                            >
                              {t("page.board.csrOnePager")}
                            </button>
                          )}
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              )}

              {hiddenCount > 0 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowAllRoles((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-ink/25 px-6 py-3 text-sm font-semibold text-brand-ink transition hover:border-black hover:border-solid"
                  >
                    {showAllRoles ? t("page.board.showFewer") : t("page.board.viewMore", { count: hiddenCount })}
                    <span aria-hidden="true" className={`inline-block transition-transform duration-300 ${showAllRoles ? "rotate-180" : ""}`}>
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#F8F4EB" />

      {/* ---------- GALLERY ---------- */}
      <section className="bg-[#F8F4EB] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink/50">
            <IconHeart className="h-4 w-4" /> {t("page.gallery.label")}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryStrip.map((photo, i) => (
              <Reveal key={photo.src} delay={i * 80}>
                <div className={`relative aspect-square w-full overflow-hidden bg-brand-sand ${photo.shape}`}>
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AS SEEN ON SOCIAL ---------- */}
      <section className="relative overflow-hidden border-t border-brand-sand bg-white px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <Eyebrow>{t("page.social.eyebrow")}</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">{t("page.social.title")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {socialPosts.map((post) => (
              <a key={post.caption} href={post.href} className="block rounded-2xl border border-brand-sand p-5 transition hover:border-black/20">
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-coral">{post.platform}</div>
                <p className="mt-3 text-sm text-brand-ink/80">{post.caption}</p>
                <div className="mt-4 text-xs text-brand-ink/50">{post.date}</div>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* ---------- RECOGNITION ---------- */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>{t("page.recognition.eyebrow")}</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">{t("page.recognition.title")}</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recognitionTiers.map((m) => (
              <div key={m.tier} className="rounded-2xl border border-brand-sand p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">{m.tier}</div>
                <h3 className="text-base text-brand-ink">{m.title}</h3>
                <p className="mt-2 text-xs text-brand-ink/60">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-brand-sand p-7">
            <div className="font-serif-display text-3xl text-brand-ink">32<span className="text-sm font-sans font-normal text-brand-ink/60"> {t("page.recognition.hoursUnit")}</span></div>
            <div className="h-2.5 flex-1 min-w-[200px] overflow-hidden rounded-full bg-white">
              <div className="h-full w-[64%] rounded-full bg-brand-coral" />
            </div>
            <div className="text-xs text-brand-ink/60">{t("page.recognition.progressLabel")}</div>
          </div>
        </div>
      </section>

      {/* ---------- CORPORATE NUDGE ---------- */}
      <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-2xl border border-brand-sand border-l-4 border-l-brand-coral p-8">
          <div>
            <h3 className="max-w-lg text-xl text-brand-ink">{t("page.corporate.title")}</h3>
            <p className="mt-2 max-w-md text-sm text-brand-ink/70">
              {t("page.corporate.body")}
            </p>
          </div>
          <button
            onClick={() => generateCsrOnePager(t)}
            className="rounded-full bg-brand-sand px-6 py-3 text-sm font-semibold text-brand-ink hover:bg-black hover:text-white"
          >
            {t("page.corporate.cta")}
          </button>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative overflow-hidden bg-brand-sand px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow>{t("page.faq.eyebrow")}</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">{t("page.faq.title")}</h2>
          <div className="mt-8 rounded-3xl bg-white px-6 sm:px-8">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/*---------- AI VOLUNTEER MATCH ----------*/}
      <section id="match" className="relative overflow-hidden bg-black px-4 py-24 sm:px-6 lg:px-8">
        <Blob className="-left-20 top-0 h-72 w-72 bg-brand-coral/15" />
        <Blob className="-right-16 bottom-0 h-64 w-64 bg-brand-coral/10" />
        <AiVolunteerMatch rosterItems={translatedRosterItems} onSelectRole={selectRoleAndScroll} />
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="relative overflow-hidden bg-[#F8F4EB] px-4 py-16 text-center sm:px-6 lg:px-8">
        <Blob className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[#F8DCDA] opacity-50" />
        <div className="relative">
          <TriMark className="mx-auto h-2.5 w-9 text-brand-coral" />
          <h2 className="mt-4 font-serif-display text-3xl text-brand-ink sm:text-4xl">{t("page.finalCta.title")}</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* <CtaButton href="#opportunities">Browse open roles</CtaButton> */}
            <CtaButton href="/donate" variant="outline">{t("page.finalCta.donate")}</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}