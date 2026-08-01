"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { Blob } from "@/components/brand/Blob";
import { BrandCard } from "@/components/brand/BrandCard";
import { CtaButton } from "@/components/brand/CtaButton";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Reveal } from "@/components/brand/Reveal";
import { TriMark } from "@/components/brand/TriMark";
import { SiteLayout } from "@/components/site/site-layout";
import { programmes } from "@/lib/site-data";

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
  return (
    <>
      {/* Desktop / tablet: vertical rail pinned to the right edge */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden items-center sm:flex">
        <div className="pointer-events-auto flex flex-col gap-3 pr-3 lg:pr-4">
          <Link
            href="/donate"
            className="group flex items-center rounded-full bg-brand-red text-white shadow-lg shadow-black/20 transition-[padding,box-shadow] duration-300 hover:pr-5 hover:shadow-xl hover:shadow-black/25"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <IconHeart className="h-6 w-6" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[110px]">
              Donate
            </span>
          </Link>
          <Link
            href="/our-volunteer"
            className="group flex items-center rounded-full border border-black/10 bg-white text-brand-dark shadow-lg shadow-black/10 transition-[padding,box-shadow] duration-300 hover:pr-5 hover:shadow-xl hover:shadow-black/15"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <IconHands className="h-6 w-6" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[110px]">
              Volunteer
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile: fixed bottom bar instead of a side rail */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-px border-t border-black/10 bg-white/95 backdrop-blur sm:hidden">
        <Link
          href="/donate"
          className="flex flex-1 items-center justify-center gap-2 bg-brand-red py-3.5 text-sm font-semibold text-white"
        >
          <IconHeart className="h-4 w-4" /> Donate
        </Link>
        <Link
          href="/our-volunteer"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-brand-dark"
        >
          <IconHands className="h-4 w-4" /> Volunteer
        </Link>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const journeySteps = [
  {
    step: "01",
    title: "Show up",
    body: "Volunteer for a class, a match day, or a family event. Most people meet Love 21 here first.",
    href: "/our-volunteer",
    cta: "Find a shift",
  },
  {
    step: "02",
    title: "Stay close",
    body: "Once you've seen the impact firsthand, become a recurring monthly donor — the support that keeps classes running year-round.",
    href: "/donate",
    cta: "Give monthly",
  },
  {
    step: "03",
    title: "Bring your company",
    body: "Introduce Love 21 to your employer. Volunteers are our biggest source of new corporate partners.",
    href: "/join-us",
    cta: "Start a CSR conversation",
  },
];

// Replace with real, family-approved quotes and names before this goes live.
const testimonials = [
  {
    quote: "Two years ago, [Name] couldn't finish a lap. This season, [she/he] led the warm-up.",
    name: "[Parent name], mother of a Saturday football member",
  },
  {
    quote: "I signed up for one Saturday shift. Eighteen months later I'm on the events committee.",
    name: "[Volunteer name], class volunteer since 2024",
  },
  {
    quote: "Our team came for a CSR morning. Half of us are still volunteering monthly.",
    name: "[Company name], corporate partner",
  },
];

// Placeholder — swap for your real weekly calendar.
const weeklyRhythm = [
  { day: "Mon", programme: "Football skills", time: "4:30–5:30pm" },
  { day: "Wed", programme: "Nutrition & cooking club", time: "4:00–5:00pm" },
  { day: "Thu", programme: "Swim class", time: "5:00–6:00pm" },
  { day: "Sat", programme: "Family sports morning", time: "9:30–11:30am" },
];

const faqs = [
  {
    q: "Do I need experience to volunteer?",
    a: "No. Most of our volunteers have never worked with neurodiverse members before their first shift. Coaches brief you on-site, every time.",
  },
  {
    q: "Is there a cost for families to join?",
    a: "Programme fees are kept deliberately low and needs-based support is available — cost should never be the reason a family doesn't join. Ask us directly through the member app.",
  },
  {
    q: "Can my company send a small group, not a big event?",
    a: "Yes — some of our strongest partners started with two or three employees on a single Saturday shift, not a full CSR day.",
  },
  {
    q: "How is my donation actually used?",
    a: "Every tier on this page is tied to a specific, real cost — class sessions, coaching, or programme fees. We're not government-funded, so recurring gifts are what let us plan a full season, not just one month.",
  },
];

// A handful of candid moments to break up the two-hero-image page into
// something that feels photographed throughout, not just bookended.
const galleryStrip = [
  { src: "/images/get-involved/gallery-1.jpeg", alt: "Members warming up before a football class", shape: "rounded-[42%_58%_65%_35%/45%_40%_60%_55%]" },
  { src: "/images/get-involved/gallery-2.jpeg", alt: "A cooking club session in the nutrition programme", shape: "rounded-[60%_40%_35%_65%/55%_60%_40%_45%]" },
  { src: "/images/get-involved/gallery-3.jpg", alt: "A volunteer high-fiving a member at swim class", shape: "rounded-[35%_65%_55%_45%/60%_35%_65%_40%]" },
  { src: "/images/get-involved/gallery-4.jpg", alt: "A family sports morning on a Saturday", shape: "rounded-[55%_45%_40%_60%/40%_55%_45%_60%]" },
];

// ---------------------------------------------------------------------------
// Small interactive components
// ---------------------------------------------------------------------------

function TestimonialCarousel() {
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
  }, []);

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
              aria-label={`Show testimonial ${i + 1}`}
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

function FaqAccordion() {
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
  const cardAccents = ["bg-brand-red", "bg-brand-dark", "bg-brand-light"];

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
      <Reveal>
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <Blob className="-top-10 -right-16 h-72 w-72 bg-[#F8DCDA] opacity-40" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pr-16">
          <div className="relative">
            <Eyebrow>Celebrating Ability</Eyebrow>
            <h1 className="mt-3 font-serif-display text-4xl leading-[1.05] text-brand-dark sm:text-5xl lg:text-6xl">
              This isn&apos;t a disability issue.
              <br />
              It&apos;s an{" "}
              <span className="relative italic text-brand-red">
                opportunity
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
              issue.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-brand-dark/75">
              Every month, 600+ Hong Kong families walk through our doors for sport, nutrition, and
              community — because someone showed up for them first. That someone could be you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CtaButton href="/donate">Donate</CtaButton>
              <CtaButton href="/our-volunteer" variant="outline">Volunteer</CtaButton>
            </div>
          </div>

          <div className="relative">
            <Blob className="-bottom-8 -left-10 h-40 w-40 bg-[#EAF6F2] opacity-70" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-light lg:aspect-[3/4]">
              {/* Swap for a real, high-res photo of a member mid-activity — smiling, in motion, not posed/pitying. */}
              <Image
                src="/images/get-involved/hero-image.png"
                alt="A Love 21 member smiling during a sports class"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      </Reveal>

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
                    21 Years in Hong Kong
                  </span>
                  <TriMark className="h-1.5 w-5 text-brand-red/50" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                    Celebrating Ability
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

        <section id="programmes" className="relative px-4 py-16 sm:px-6 lg:px-8 lg:pr-24">
          <Reveal>
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Programmes</Eyebrow>
                <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">What we do</h2>
              </div>
              <p className="max-w-2xl text-sm text-brand-dark/70">
                A whole-person model — sport, nutrition, and family support — because reaching full
                potential takes more than one hour a week.
              </p>
            </div>
          </div>
          </Reveal>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 sm:grid-cols-2">
              {programmes.map((programme, i) => (
                <Reveal key={programme.title} delay={i * 0.08}>
                  <BrandCard
                    as="article"
                    className="group relative overflow-hidden rounded-2xl border-brand-slate/10 p-6 transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <span
                      className={`absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rotate-45 opacity-10 transition-opacity group-hover:opacity-20 ${cardAccents[i % cardAccents.length]}`}
                      aria-hidden="true"
                    />
                    <h3 className="font-serif-display text-2xl text-brand-ink">{programme.title}</h3>
                    <p className="mt-3 text-sm text-brand-ink/75">{programme.description}</p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link href="/members" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Join as a member</Link>
                      <Link href="/our-volunteer" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Volunteer</Link>
                      <Link href="/donate" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Donate</Link>
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
              <IconHeart className="h-4 w-4" /> Life at Love 21, in between the numbers
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
      <section className="relative overflow-hidden bg-[#EAF6F2] px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="right-8 top-8 h-36 w-36 bg-white/50" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
            <IconSprout className="h-4 w-4" /> A week at Love 21
          </div>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-dark sm:text-4xl">
            This is what "600+ families a month" looks like on the ground
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
            Placeholder schedule — replace with your real weekly calendar before publishing.
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
            Your Journey
          </p>
          <h2 className="mt-2 max-w-xl font-serif-display text-4xl sm:text-5xl">
            Most of our biggest supporters started with one shift.
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
              alt="A Love 21 member during a community activity"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
              <IconTrophy className="h-4 w-4" /> A Love 21 Story
            </p>
            <div className="mt-3">
              <TestimonialCarousel />
            </div>
            <Link href="/stories-media" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline">
              Read more member stories
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>
      </Reveal>

      {/* ---------- FAQ ---------- */}
      <Reveal>
      <section className="relative overflow-hidden bg-brand-light px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow>Before you reach out</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">Questions people actually ask</h2>
          <div className="mt-8 rounded-3xl bg-white px-6 shadow-sm sm:px-8">
            <FaqAccordion />
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
              <Eyebrow>Stay close</Eyebrow>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-dark sm:text-4xl">
                Stay connected with Love 21
              </h2>
              <p className="mt-3 max-w-md text-brand-dark/70">
                Receive stories, programme updates, upcoming events, and ways you can
                continue making an impact — as often as you'd like to hear from us.
              </p>

              <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 rounded-full border border-black/15 px-5 py-3 text-sm text-brand-dark outline-none focus:border-brand-red sm:min-w-[220px]"
                />

                <label className="sr-only" htmlFor="newsletter-frequency">
                  Update frequency
                </label>
                <select
                  id="newsletter-frequency"
                  defaultValue="monthly"
                  className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm text-brand-dark outline-none focus:border-brand-red"
                >
                  <option value="weekly">Weekly updates</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="monthly">Monthly updates</option>
                  <option value="quarterly">Quarterly updates</option>
                  <option value="important">Only important announcements</option>
                </select>

                <button
                  type="submit"
                  className="rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* A quiet closing prompt for people who are ready to act right now,
                rather than a second big CTA block competing with the form. */}
            <BrandCard className="border-brand-slate/20 bg-brand-light p-7 sm:p-7">
              <TriMark className="h-2 w-7 text-brand-red" />
              <p className="mt-4 font-serif-display text-xl text-brand-dark">
                Not ready to wait for the next update?
              </p>
              <p className="mt-2 text-sm text-brand-dark/70">
                You can donate or find a volunteer shift today — both take less than five minutes.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <CtaButton href="/donate">Donate</CtaButton>
                <CtaButton href="/our-volunteer" variant="outline">Volunteer</CtaButton>
              </div>
            </BrandCard>
          </div>
        </div>
      </section>
      </Reveal>
    </SiteLayout>
  );
}