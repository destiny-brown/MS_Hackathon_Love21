"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Blob } from "@/components/brand/Blob";
import { BrandCard } from "@/components/brand/BrandCard";
import { CtaButton } from "@/components/brand/CtaButton";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Reveal } from "@/components/brand/Reveal";
import { TriMark } from "@/components/brand/TriMark";
import { PageSectionNav, type PageSectionNavItem } from "@/components/site/page-section-nav";
import { SiteLayout } from "@/components/site/site-layout";

const PROGRAMME_KEYS = ["sports", "nutrition", "family", "csr"] as const;

const sectionNavItems: PageSectionNavItem[] = [
  { id: "get-involved-hero", label: "Join", labelKey: "sectionNav.join" },
  { id: "programmes", label: "Categories", labelKey: "sectionNav.categories" },
  { id: "activities", label: "Activities", labelKey: "sectionNav.activities" },
  { id: "faq", label: "FAQ", labelKey: "sectionNav.faq" },
];

// ---------------------------------------------------------------------------
// Decorative primitives — used sparingly, one or two per section, never as
// wall-to-wall texture. Each one earns its place by softening a hard edge
// rather than sitting on top of it.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Small interactive components
// ---------------------------------------------------------------------------

type TestimonialItem = { quote: string; name: string };
type FaqItem = { q: string; a: string };

function TestimonialCarousel({
  testimonials,
  showLabel,
}: {
  testimonials: TestimonialItem[];
  showLabel: (index: number) => string;
}) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
        setFade(true);
      }, 200);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  function go(next: number) {
    setFade(false);
    setTimeout(() => {
      setIndex((next + testimonials.length) % testimonials.length);
      setFade(true);
    }, 200);
  }

  const active = testimonials[index];

  return (
    <div>
      <div
        className={`transition-opacity duration-300 motion-reduce:transition-none ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <blockquote className="font-serif-display text-3xl leading-snug text-brand-dark sm:text-4xl">
          "{active.quote}"
        </blockquote>
        <p className="mt-5 text-sm font-semibold text-brand-dark/60">{active.name}</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <TriMark className="h-2 w-7 text-brand-red/40" />
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={showLabel(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-red" : "w-1.5 bg-brand-dark/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-light">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="py-5">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif-display text-lg text-brand-dark sm:text-xl">{item.q}</span>
              <span
                className={`shrink-0 text-2xl text-brand-red transition-transform duration-300 ${
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
              <p className="overflow-hidden text-brand-dark/70">{item.a}</p>
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
  const cardAccents = ["bg-brand-red", "bg-brand-dark", "bg-brand-light"];

  const journeySteps = useMemo(
    () => [
      {
        step: "01",
        title: t("journey.steps.01.title"),
        body: t("journey.steps.01.body"),
        href: "/our-volunteer",
        cta: t("journey.steps.01.cta"),
      },
      {
        step: "02",
        title: t("journey.steps.02.title"),
        body: t("journey.steps.02.body"),
        href: "/donate",
        cta: t("journey.steps.02.cta"),
      },
      {
        step: "03",
        title: t("journey.steps.03.title"),
        body: t("journey.steps.03.body"),
        href: "/join-us",
        cta: t("journey.steps.03.cta"),
      },
    ],
    [t],
  );

  const testimonials = useMemo(
    () => [
      {
        quote: t("testimonials.items.parent.quote"),
        name: t("testimonials.items.parent.name"),
      },
      {
        quote: t("testimonials.items.volunteer.quote"),
        name: t("testimonials.items.volunteer.name"),
      },
      {
        quote: t("testimonials.items.corporate.quote"),
        name: t("testimonials.items.corporate.name"),
      },
    ],
    [t],
  );

  const weeklyRhythm = useMemo(
    () => [
      {
        day: t("weeklyRhythm.days.mon"),
        programme: t("weeklyRhythm.slots.football.programme"),
        time: t("weeklyRhythm.slots.football.time"),
      },
      {
        day: t("weeklyRhythm.days.wed"),
        programme: t("weeklyRhythm.slots.cooking.programme"),
        time: t("weeklyRhythm.slots.cooking.time"),
      },
      {
        day: t("weeklyRhythm.days.thu"),
        programme: t("weeklyRhythm.slots.swim.programme"),
        time: t("weeklyRhythm.slots.swim.time"),
      },
      {
        day: t("weeklyRhythm.days.sat"),
        programme: t("weeklyRhythm.slots.family.programme"),
        time: t("weeklyRhythm.slots.family.time"),
      },
    ],
    [t],
  );

  const faqs = useMemo(
    () => [
      { q: t("faq.items.experience.q"), a: t("faq.items.experience.a") },
      { q: t("faq.items.cost.q"), a: t("faq.items.cost.a") },
      { q: t("faq.items.company.q"), a: t("faq.items.company.a") },
      { q: t("faq.items.donation.q"), a: t("faq.items.donation.a") },
    ],
    [t],
  );

  const galleryStrip = useMemo(
    () => [
      {
        src: "/images/get-involved/gallery-1.jpeg",
        alt: t("gallery.photos.football"),
        shape: "rounded-[42%_58%_65%_35%/45%_40%_60%_55%]",
      },
      {
        src: "/images/get-involved/gallery-2.jpeg",
        alt: t("gallery.photos.cooking"),
        shape: "rounded-[60%_40%_35%_65%/55%_60%_40%_45%]",
      },
      {
        src: "/images/get-involved/gallery-3.jpg",
        alt: t("gallery.photos.swim"),
        shape: "rounded-[35%_65%_55%_45%/60%_35%_65%_40%]",
      },
      {
        src: "/images/get-involved/gallery-4.jpg",
        alt: t("gallery.photos.family"),
        shape: "rounded-[55%_45%_40%_60%/40%_55%_45%_60%]",
      },
    ],
    [t],
  );

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

      {/* The Donate / Volunteer rail now lives in SiteLayout so it renders on
          every page automatically — see components/site/floating-cta.tsx.
          It's intentionally not re-declared or re-rendered here. */}

      {/* Sentinel for section-nav reveal — not a nav target. */}
      <div id="get-involved-nav-sentinel" className="h-px w-full" aria-hidden="true" />

      {/* ---------- STORY HERO ---------- */}
      <Reveal>
      <section
        id="get-involved-hero"
        className="relative scroll-mt-24 overflow-hidden bg-white px-4 pb-16 pt-14 sm:px-6 lg:px-8"
      >        <Blob className="-top-10 -right-16 h-72 w-72 bg-[#F8DCDA] opacity-40" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pr-16">
          <div className="relative">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="mt-3 font-serif-display text-4xl leading-[1.05] text-brand-dark sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              <span className="relative italic text-brand-red">
                {t("hero.titleHighlight")}
                <svg
                  viewBox="0 0 200 14"
                  className="absolute -bottom-1 left-0 h-3 w-full text-brand-red/50"
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
            <p className="mt-6 max-w-lg text-lg text-brand-dark/75">
              {t("hero.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CtaButton href="/donate">{t("hero.donate")}</CtaButton>
              <CtaButton href="/our-volunteer" variant="outline">{t("hero.volunteer")}</CtaButton>
            </div>
          </div>

          <div className="relative">
            <Blob className="-bottom-8 -left-10 h-40 w-40 bg-[#EAF6F2] opacity-70" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-light lg:aspect-[3/4]">
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
      </Reveal>

      <PageSectionNav items={sectionNavItems} ns="getInvolved" heroSelector="#get-involved-nav-sentinel" />

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
                  <span className="font-serif-display text-sm text-brand-dark sm:text-base">
                    {t("marquee.years")}
                  </span>
                  <TriMark className="h-1.5 w-5 text-brand-red/50" />
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
      <div className="relative overflow-hidden bg-brand-light">
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
        <div className="pointer-events-none absolute left-[9%] top-[4%] hidden h-2.5 w-2.5 rounded-full bg-brand-red shadow-md lg:block" />
        <div className="pointer-events-none absolute left-[89%] top-[76%] hidden h-2.5 w-2.5 rounded-full bg-brand-red shadow-md lg:block" />

        <section id="programmes" className="relative scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:pr-24">
          <Reveal>
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>{t("programmes.eyebrow")}</Eyebrow>
                <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">{t("programmes.title")}</h2>
              </div>
              <p className="max-w-2xl text-sm text-brand-dark/70">
                {t("programmes.subtitle")}
              </p>
            </div>
          </div>
          </Reveal>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 sm:grid-cols-2">
              {PROGRAMME_KEYS.map((key, i) => (
                <Reveal key={key} delay={i * 0.08}>
                  <BrandCard
                    as="article"
                    className="group relative overflow-hidden rounded-2xl border-brand-slate/10 p-6 transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <span
                      className={`absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rotate-45 opacity-10 transition-opacity group-hover:opacity-20 ${cardAccents[i % cardAccents.length]}`}
                      aria-hidden="true"
                    />
                    <h3 className="font-serif-display text-2xl text-brand-ink">{t(`programmes.${key}.title`)}</h3>
                    <p className="mt-3 text-sm text-brand-ink/75">{t(`programmes.${key}.description`)}</p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link href="/members" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{t("programmes.joinMember")}</Link>
                      <Link href="/our-volunteer" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{t("hero.volunteer")}</Link>
                      <Link href="/donate" className="rounded-md font-semibold text-brand-red hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{t("hero.donate")}</Link>
                    </div>
                  </BrandCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- GALLERY STRIP ---------- */}
        <section className="relative px-4 pb-16 sm:px-6 lg:px-8 lg:pr-24">
          <div className="mx-auto max-w-6xl">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark/50">
              <IconHeart className="h-4 w-4" /> {t("gallery.eyebrow")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryStrip.map((photo, i) => (
                <Reveal key={photo.src} delay={i * 0.08}>
                  <div className={`relative aspect-square w-full overflow-hidden bg-brand-light ${photo.shape}`}>
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      <WaveDivider color="#EAF6F2" />

      {/* ---------- WEEKLY RHYTHM ---------- */}
      <Reveal>
      <section id="activities" className="relative scroll-mt-24 overflow-hidden bg-[#EAF6F2] px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="right-8 top-8 h-36 w-36 bg-white/50" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
            <IconSprout className="h-4 w-4" /> {t("weeklyRhythm.eyebrow")}
          </div>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-dark sm:text-4xl">
            {t("weeklyRhythm.title")}
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {weeklyRhythm.map((slot) => (
              <div key={slot.day + slot.programme} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-red">{slot.day}</div>
                <div className="mt-2 font-serif-display text-lg text-brand-dark">{slot.programme}</div>
                <div className="mt-1 text-sm text-brand-dark/60">{slot.time}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-dark/50">
            {t("weeklyRhythm.placeholder")}
          </p>
        </div>
      </section>
      </Reveal>

      {/* ---------- THE DONOR JOURNEY ---------- */}
      <Reveal>
      <section id="journey" className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <Blob className="-left-16 bottom-0 h-64 w-64 bg-brand-red/20" />
        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
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
              {journeySteps.map((step, i) => (
                <Reveal key={step.step} delay={i * 0.1} className="relative rounded-2xl border border-white/15 bg-white/[0.03] p-7">
                  <span className="flex items-center gap-2 font-serif-display text-sm text-brand-red">
                    <span className="h-2 w-2 rounded-full bg-brand-red" />
                    {step.step}
                  </span>
                  <h3 className="mt-3 font-serif-display text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{step.body}</p>
                  <Link
                    href={step.href}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
                  >
                    {step.cta}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* ---------- STORY SPOTLIGHT (testimonial carousel) ---------- */}
      <Reveal>
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="-left-20 top-1/3 h-64 w-64 bg-[#EAF6F2] opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-brand-light">
            {/* Replace with a real member story photo — smiles, motion, not posed/pitying. */}
            <Image
              src="/images/get-involved/story-spotlight.png"
              alt={t("testimonials.spotlightAlt")}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
              <IconTrophy className="h-4 w-4" /> {t("testimonials.eyebrow")}
            </p>
            <div className="mt-3">
              <TestimonialCarousel
                testimonials={testimonials}
                showLabel={(i) => t("testimonials.showLabel", { number: i + 1 })}
              />
            </div>
            <Link href="/stories-media" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline">
              {t("testimonials.readMore")}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>
      </Reveal>

      {/* ---------- FAQ ---------- */}
      <Reveal>
      <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-brand-light px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">{t("faq.title")}</h2>
          <div className="mt-8 rounded-3xl bg-white px-6 shadow-sm sm:px-8">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>
      </Reveal>

      {/* ---------- NEWSLETTER / CLOSING ---------- */}
      <Reveal>
      <section className="relative overflow-hidden border-t border-brand-light bg-white px-4 py-16 pb-24 sm:px-6 sm:pb-16 lg:px-8">
        <Blob className="left-0 bottom-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 bg-[#EAF6F2] opacity-60" />
        <Blob className="right-10 top-0 h-32 w-32 -translate-y-1/2 bg-[#FBE3E3] opacity-50" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Eyebrow>{t("newsletter.eyebrow")}</Eyebrow>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-dark sm:text-4xl">
                {t("newsletter.title")}
              </h2>
              <p className="mt-3 max-w-md text-brand-dark/70">
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
                  className="min-w-0 flex-1 rounded-full border border-black/15 px-5 py-3 text-sm text-brand-dark outline-none focus:border-brand-red sm:min-w-[220px]"
                />

                <label className="sr-only" htmlFor="newsletter-frequency">
                  {t("newsletter.frequencyLabel")}
                </label>
                <select
                  id="newsletter-frequency"
                  defaultValue="monthly"
                  className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none focus:border-brand-red"
                >
                  <option value="weekly">{t("newsletter.frequencies.weekly")}</option>
                  <option value="biweekly">{t("newsletter.frequencies.biweekly")}</option>
                  <option value="monthly">{t("newsletter.frequencies.monthly")}</option>
                  <option value="quarterly">{t("newsletter.frequencies.quarterly")}</option>
                  <option value="important">{t("newsletter.frequencies.important")}</option>
                </select>

                <button
                  type="submit"
                  className="rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  {t("newsletter.subscribe")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </Reveal>
    </SiteLayout>
  );
}