"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/site/site-layout";
import { useTranslatedProgrammes } from "@/lib/i18n/translated-data";

// ---------------------------------------------------------------------------
// Signature mark
// Love 21 exists because of trisomy 21 — three copies of a chromosome.
// This three-dot mark stands in for that fact everywhere a divider,
// bullet, or eyebrow accent would normally go.
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

// ---------------------------------------------------------------------------
// Decorative primitives — used sparingly, one or two per section, never as
// wall-to-wall texture. Each one earns its place by softening a hard edge
// rather than sitting on top of it.
// ---------------------------------------------------------------------------

function Blob({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

// A single torn/organic wave, used as a seam between two sections so the
// page reads as a continuous piece rather than stacked rectangles.
function WaveDivider({
  flip = false,
  color = "#FFFFFF",
  className = "",
}: {
  flip?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-14 w-full overflow-hidden sm:h-20 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="h-full w-full">
        <path
          d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,50 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

// Thin-stroke line icons — a deliberately small, consistent set that stands
// in for the "sport / nutrition / family / achievement" pillars, instead of
// emoji or a random icon-library grab bag.
function IconSprout({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 34V19" />
      <path d="M20 20c0-7-6-11-13-11 0 7 6 12 13 11Z" />
      <path d="M20 15c0-6 5-9 11-9 0 6-5 10-11 9Z" />
    </svg>
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
function IconHands({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 20l6-6 7 2 9-3 6 4-8 8-8-1-6 3" />
      <path d="M12 14l6 6" />
      <path d="M28 21l-8 9" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Floating CTA rail — a two-way rail (Donate + Volunteer) pinned to the edge
// of the viewport. Collapsed to a circular icon by default; expands to
// reveal its label on hover/focus. Swaps to a bottom bar on small screens.
// ---------------------------------------------------------------------------

function FloatingCta() {
  const { t } = useTranslation("getInvolved");

  return (
    <>
      {/* Desktop / tablet: vertical rail pinned to the right edge */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden items-center sm:flex">
        <div className="pointer-events-auto flex flex-col gap-3 pr-3 lg:pr-4">
          <Link
            href="/donate"
            className="group flex items-center rounded-full bg-brand-coral text-white shadow-lg shadow-black/20 transition-[padding,box-shadow] duration-300 hover:pr-5 hover:shadow-xl hover:shadow-black/25"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <IconHeart className="h-6 w-6" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[110px]">
              {t("floatingCta.donate")}
            </span>
          </Link>
          <Link
            href="/our-volunteer"
            className="group flex items-center rounded-full border border-black/10 bg-white text-brand-ink shadow-lg shadow-black/10 transition-[padding,box-shadow] duration-300 hover:pr-5 hover:shadow-xl hover:shadow-black/15"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <IconHands className="h-6 w-6" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[110px]">
              {t("floatingCta.volunteer")}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile: fixed bottom bar instead of a side rail */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-px border-t border-black/10 bg-white/95 backdrop-blur sm:hidden">
        <Link
          href="/donate"
          className="flex flex-1 items-center justify-center gap-2 bg-brand-coral py-3.5 text-sm font-semibold text-white"
        >
          <IconHeart className="h-4 w-4" /> {t("floatingCta.donate")}
        </Link>
        <Link
          href="/our-volunteer"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-brand-ink"
        >
          <IconHands className="h-4 w-4" /> {t("floatingCta.volunteer")}
        </Link>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Scroll reveal — fade + a little lift + a soft focus pull, rather than a
// flat opacity toggle, so entrances feel considered instead of mechanical.
// ---------------------------------------------------------------------------

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        filter: visible ? "blur(0px)" : "blur(6px)",
      }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:blur-none ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// A button with a bit of life in it: fill on hover, arrow slides, shadow
// deepens. Two variants so it reads correctly on both light and dark grounds.
function CtaButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
}) {
  const styles = {
    solid:
      "bg-brand-coral text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] hover:bg-black",
    outline:
      "border border-black/15 text-brand-ink hover:border-black hover:bg-black hover:text-white",
    "outline-dark":
      "border border-white/30 text-white hover:border-white hover:bg-white hover:text-black",
  }[variant];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 ${styles}`}
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Data keys (resolved via i18n in components)
// ---------------------------------------------------------------------------

const journeyStepKeys = ["01", "02", "03"] as const;
const journeyHrefs: Record<typeof journeyStepKeys[number], string> = {
  "01": "/our-volunteer",
  "02": "/donate",
  "03": "/join-us",
};

const testimonialKeys = ["parent", "volunteer", "corporate"] as const;

const weeklyRhythmKeys = [
  { dayKey: "mon", slotKey: "football" },
  { dayKey: "wed", slotKey: "cooking" },
  { dayKey: "thu", slotKey: "swim" },
  { dayKey: "sat", slotKey: "family" },
] as const;

const faqKeys = ["experience", "cost", "company", "donation"] as const;

const galleryStrip = [
  { src: "/images/get-involved/gallery-1.jpeg", photoKey: "football", shape: "rounded-[42%_58%_65%_35%/45%_40%_60%_55%]" },
  { src: "/images/get-involved/gallery-2.jpeg", photoKey: "cooking", shape: "rounded-[60%_40%_35%_65%/55%_60%_40%_45%]" },
  { src: "/images/get-involved/gallery-3.jpg", photoKey: "swim", shape: "rounded-[35%_65%_55%_45%/60%_35%_65%_40%]" },
  { src: "/images/get-involved/gallery-4.jpg", photoKey: "family", shape: "rounded-[55%_45%_40%_60%/40%_55%_45%_60%]" },
] as const;

// ---------------------------------------------------------------------------
// Small interactive components
// ---------------------------------------------------------------------------

function TestimonialCarousel() {
  const { t } = useTranslation("getInvolved");
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % testimonialKeys.length);
        setFade(true);
      }, 200);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function go(next: number) {
    setFade(false);
    setTimeout(() => {
      setIndex((next + testimonialKeys.length) % testimonialKeys.length);
      setFade(true);
    }, 200);
  }

  const key = testimonialKeys[index];

  return (
    <div>
      <div
        className={`transition-opacity duration-300 motion-reduce:transition-none ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <blockquote className="font-serif-display text-3xl leading-snug text-brand-ink sm:text-4xl">
          &ldquo;{t(`testimonials.items.${key}.quote`)}&rdquo;
        </blockquote>
        <p className="mt-5 text-sm font-semibold text-brand-ink/60">
          {t(`testimonials.items.${key}.name`)}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <TriMark className="h-2 w-7 text-brand-coral/40" />
        <div className="flex gap-1.5">
          {testimonialKeys.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={t("testimonials.showLabel", { number: i + 1 })}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-coral" : "w-1.5 bg-brand-ink/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const { t } = useTranslation("getInvolved");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-sand">
      {faqKeys.map((key, i) => {
        const isOpen = open === i;
        return (
          <div key={key} className="py-5">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif-display text-lg text-brand-ink sm:text-xl">
                {t(`faq.items.${key}.q`)}
              </span>
              <span
                className={`shrink-0 text-2xl text-brand-coral transition-transform duration-300 ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="overflow-hidden text-brand-ink/70">{t(`faq.items.${key}.a`)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GetInvolvedPage() {
  const { t } = useTranslation("getInvolved");
  const programmes = useTranslatedProgrammes();
  const cardAccents = ["bg-brand-coral", "bg-brand-ink", "bg-brand-sand"];

  return (
    <SiteLayout>
      {/* Local keyframes for the marquee band. */}
      <style>{`
        @keyframes l21-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .l21-marquee-track {
          display: flex;
          width: max-content;
          animation: l21-marquee 38s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .l21-marquee-track { animation: none; }
        }
      `}</style>

      {/* Floating Donate / Volunteer rail — stays pinned across the whole page */}
      <FloatingCta />

      {/* ---------- STORY HERO ---------- */}
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <Blob className="-top-10 -right-16 h-72 w-72 bg-[#F8DCDA] opacity-40" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pr-16">
          <div className="relative">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="mt-3 font-serif-display text-4xl leading-[1.05] text-brand-ink sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              It&apos;s an{" "}
              <span className="relative italic text-brand-coral">
                {t("hero.titleHighlight")}
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
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              {t("hero.titleLine2")}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-brand-ink/75">
              {t("hero.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CtaButton href="/donate">{t("hero.donate")}</CtaButton>
              <CtaButton href="/our-volunteer" variant="outline">{t("hero.volunteer")}</CtaButton>
            </div>
          </div>

          <div className="relative">
            <Blob className="-bottom-8 -left-10 h-40 w-40 bg-[#EAF6F2] opacity-70" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-sand lg:aspect-[3/4]">
              {/* Swap for a real, high-res photo of a member mid-activity — smiling, in motion, not posed/pitying. */}
              <Image
                src="/images/get-involved/hero-image.png"
                alt={t("hero.imageAlt")}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE: 21 YEARS IN HONG KONG ---------- */}
      <div className="relative overflow-hidden border-y border-black/5 bg-[#FBEAEA] py-3">
        <Blob className="left-1/4 top-1/2 h-24 w-24 -translate-y-1/2 bg-white/40" />
        <Blob className="right-1/4 top-1/2 h-16 w-16 -translate-y-1/2 bg-[#F6D3D3]/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FBEAEA] via-transparent to-[#FBEAEA]" />
        <div className="l21-marquee-track">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 items-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="mx-5 flex items-center gap-2.5 whitespace-nowrap">
                  <span className="font-serif-display text-sm text-brand-ink sm:text-base">
                    {t("marquee.years")}
                  </span>
                  <TriMark className="h-1.5 w-5 text-brand-coral/50" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                    {t("marquee.celebrating")}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- WHAT WE DO + GALLERY (journey connector) ---------- */}
      <div className="relative overflow-hidden bg-[#F8F4EB]">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 1200 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M120 40 C450 180 250 380 600 420 C850 450 700 700 1080 760"
            stroke="#E3AFAF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="2 14"
            opacity="0.55"
          />
        </svg>
        <div className="pointer-events-none absolute left-[9%] top-[4%] hidden h-2.5 w-2.5 rounded-full bg-brand-coral shadow-md lg:block" />
        <div className="pointer-events-none absolute left-[89%] top-[76%] hidden h-2.5 w-2.5 rounded-full bg-brand-coral shadow-md lg:block" />

        <section id="programmes" className="relative px-4 py-16 sm:px-6 lg:px-8 lg:pr-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>{t("programmes.eyebrow")}</Eyebrow>
                <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">{t("programmes.title")}</h2>
              </div>
              <p className="max-w-2xl text-sm text-brand-ink/70">
                {t("programmes.subtitle")}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {programmes.map((programme, i) => (
                <Reveal key={programme.title} delay={i * 80}>
                  <article className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
                    <span
                      className={`absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rotate-45 opacity-10 transition-opacity group-hover:opacity-20 ${cardAccents[i % cardAccents.length]}`}
                      aria-hidden="true"
                    />
                    <h3 className="font-serif-display text-2xl text-brand-ink">{programme.title}</h3>
                    <p className="mt-3 text-sm text-brand-ink/75">{programme.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- GALLERY STRIP ---------- */}
        <section className="relative px-4 pb-16 sm:px-6 lg:px-8 lg:pr-24">
          <div className="mx-auto max-w-6xl">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink/50">
              <IconHeart className="h-4 w-4" /> {t("gallery.eyebrow")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryStrip.map((photo, i) => (
                <Reveal key={photo.src} delay={i * 80}>
                  <div className={`relative aspect-square w-full overflow-hidden bg-brand-sand ${photo.shape}`}>
                    <Image
                      src={photo.src}
                      alt={t(`gallery.photos.${photo.photoKey}`)}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      <WaveDivider color="#EAF6F2" />

      {/* ---------- WEEKLY RHYTHM ---------- */}
      <section className="relative overflow-hidden bg-[#EAF6F2] px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="right-8 top-8 h-36 w-36 bg-white/50" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
            <IconSprout className="h-4 w-4" /> {t("weeklyRhythm.eyebrow")}
          </div>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">
            {t("weeklyRhythm.title")}
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {weeklyRhythmKeys.map((slot) => (
              <div key={slot.dayKey + slot.slotKey} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-coral">
                  {t(`weeklyRhythm.days.${slot.dayKey}`)}
                </div>
                <div className="mt-2 font-serif-display text-lg text-brand-ink">
                  {t(`weeklyRhythm.slots.${slot.slotKey}.programme`)}
                </div>
                <div className="mt-1 text-sm text-brand-ink/60">
                  {t(`weeklyRhythm.slots.${slot.slotKey}.time`)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-ink/50">
            {t("weeklyRhythm.placeholder")}
          </p>
        </div>
      </section>

      {/* ---------- THE DONOR JOURNEY ---------- */}
      <section id="journey" className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <Blob className="-left-16 bottom-0 h-64 w-64 bg-brand-coral/20" />
        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
            <TriMark className="h-2 w-7" />
            {t("journey.eyebrow")}
          </p>
          <h2 className="mt-2 max-w-xl font-serif-display text-4xl sm:text-5xl">
            {t("journey.title")}
          </h2>

          <div className="relative mt-12">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-10 hidden h-6 w-full lg:block"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path
                d="M100 30 C400 -10 500 70 700 30 C900 -10 1000 60 1100 30"
                stroke="#890000"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="2 12"
                opacity="0.6"
              />
            </svg>
            <div className="grid gap-6 lg:grid-cols-3">
              {journeyStepKeys.map((stepKey, i) => (
                <Reveal key={stepKey} delay={i * 100} className="relative rounded-2xl border border-white/15 bg-white/[0.03] p-7">
                  <span className="flex items-center gap-2 font-serif-display text-sm text-brand-coral">
                    <span className="h-2 w-2 rounded-full bg-brand-coral" />
                    {stepKey}
                  </span>
                  <h3 className="mt-3 font-serif-display text-2xl">
                    {t(`journey.steps.${stepKey}.title`)}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">
                    {t(`journey.steps.${stepKey}.body`)}
                  </p>
                  <Link
                    href={journeyHrefs[stepKey]}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-coral hover:underline"
                  >
                    {t(`journey.steps.${stepKey}.cta`)}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STORY SPOTLIGHT (testimonial carousel) ---------- */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="-left-20 top-1/3 h-64 w-64 bg-[#EAF6F2] opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-brand-sand">
            {/* Replace with a real member story photo — smiles, motion, not posed/pitying. */}
            <Image
              src="/images/get-involved/story-spotlight.png"
              alt={t("testimonials.spotlightAlt")}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
              <IconTrophy className="h-4 w-4" /> {t("testimonials.eyebrow")}
            </p>
            <div className="mt-3">
              <TestimonialCarousel />
            </div>
            <Link href="/stories" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-coral hover:underline">
              {t("testimonials.readMore")}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative overflow-hidden bg-brand-sand px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">{t("faq.title")}</h2>
          <div className="mt-8 rounded-3xl bg-white px-6 shadow-sm sm:px-8">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER / CLOSING ---------- */}
      <section className="relative overflow-hidden border-t border-brand-sand bg-white px-4 py-16 pb-24 sm:px-6 sm:pb-16 lg:px-8">
        <Blob className="left-0 bottom-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 bg-[#EAF6F2] opacity-60" />
        <Blob className="right-10 top-0 h-32 w-32 -translate-y-1/2 bg-[#FBE3E3] opacity-50" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Eyebrow>{t("newsletter.eyebrow")}</Eyebrow>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">
                {t("newsletter.title")}
              </h2>
              <p className="mt-3 max-w-md text-brand-ink/70">
                {t("newsletter.body")}
              </p>

              <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <label className="sr-only" htmlFor="newsletter-email">
                  {t("newsletter.emailLabel")}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder={t("newsletter.emailPlaceholder")}
                  className="min-w-0 flex-1 rounded-full border border-black/15 px-5 py-3 text-sm text-brand-ink outline-none focus:border-brand-coral sm:min-w-[220px]"
                />

                <label className="sr-only" htmlFor="newsletter-frequency">
                  {t("newsletter.frequencyLabel")}
                </label>
                <select
                  id="newsletter-frequency"
                  defaultValue="monthly"
                  className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm text-brand-ink outline-none focus:border-brand-coral"
                >
                  <option value="weekly">{t("newsletter.frequencies.weekly")}</option>
                  <option value="biweekly">{t("newsletter.frequencies.biweekly")}</option>
                  <option value="monthly">{t("newsletter.frequencies.monthly")}</option>
                  <option value="quarterly">{t("newsletter.frequencies.quarterly")}</option>
                  <option value="important">{t("newsletter.frequencies.important")}</option>
                </select>

                <button
                  type="submit"
                  className="rounded-full bg-brand-coral px-7 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  {t("newsletter.subscribe")}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-brand-sand bg-[#FBF8F1] p-7">
              <TriMark className="h-2 w-7 text-brand-coral" />
              <p className="mt-4 font-serif-display text-xl text-brand-ink">
                {t("newsletter.closingTitle")}
              </p>
              <p className="mt-2 text-sm text-brand-ink/70">
                {t("newsletter.closingBody")}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <CtaButton href="/donate">{t("newsletter.donate")}</CtaButton>
                <CtaButton href="/our-volunteer" variant="outline">{t("newsletter.volunteer")}</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}