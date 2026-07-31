"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { SiteLayout } from "@/components/site/site-layout";
import { programmes } from "@/lib/site-data";

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
// (a black band, a straight section seam) rather than sitting on top of it.
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
// Data
// ---------------------------------------------------------------------------

const impactStats = [
  { value: "600+", label: "families & members supported monthly" },
  { value: "~1,000", label: "classes run every month" },
  { value: "15%", label: "of neurodiverse adults are in competitive employment globally — we're changing that" },
];

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

type PersonaKey = "families" | "volunteers" | "donors" | "corporate" | "government";

type Persona = {
  label: string;
  headline: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const personas: Record<PersonaKey, Persona> = {
  families: {
    label: "Families",
    headline: "Register your child for classes, support, and community.",
    body: "Sign up through the Love 21 member app — our fair sign-up system, class calendar, and gamified progress tracking all live there. This page is your front door in.",
    primary: { label: "Join as a family", href: "/members" },
    secondary: { label: "See our programmes", href: "#programmes" },
  },
  volunteers: {
    label: "Volunteers",
    headline: "One form. No waiting for an email back.",
    body: "Browse open roles by programme, pick your slot, and you're auto-confirmed — no manual approval queue. Your hours are tracked toward recognition badges from day one.",
    primary: { label: "Browse volunteer roles", href: "/our-volunteer" },
    secondary: { label: "See the impact your hours have", href: "#journey" },
  },
  donors: {
    label: "Donors",
    headline: "HKD 500 funds a class of 15. See exactly where it goes.",
    body: "As a non-government-funded charity, recurring donations are what let us plan beyond one month at a time. Every donation tier is tied to a specific, real outcome.",
    primary: { label: "Give one-time or monthly", href: "/donate" },
    secondary: { label: "Explore our wishlist instead", href: "/shop" },
  },
  corporate: {
    label: "Corporate",
    headline: "CSR days that teach your team something, not just a photo op.",
    body: "Bring your team on-site, sponsor a class outright, or offer skills-based pro bono support. Many of our best partners started with one employee volunteering solo.",
    primary: { label: "Explore CSR partnerships", href: "/join-us" },
    secondary: { label: "Book a corporate volunteer day", href: "/our-volunteer" },
  },
  government: {
    label: "Government & Policy",
    headline: "See the model. Help fix inclusive education in Hong Kong.",
    body: "We're happy to host visits and share our data — class outcomes, employment stats, family reach — for anyone working on disability and education policy.",
    primary: { label: "Request a visit", href: "/about-us" },
    secondary: { label: "Read our impact data", href: "/impact-dashboard" },
  },
};

// Replace with real, family-approved quotes and names before this goes live.
const testimonials = [
  {
    title: "Donate",
    description: "Back campaigns and causes that create more opportunities for every ability to shine.",
    href: "/donate",
  },
  {
    title: "Wishlist",
    description: "Fund or purchase practical tools that help members train, learn, and create.",
    href: "/shop",
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

const donationTiers = [
  { amount: "HKD 200", impact: "Snacks and hydration for one class of 15" },
  { amount: "HKD 500", impact: "Funds a full class session, coach included" },
  { amount: "HKD 1,500", impact: "Covers one member's programme fees for a term" },
  { amount: "HKD 5,000", impact: "Sponsors a full Saturday family sports morning" },
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
        <blockquote className="font-serif-display text-3xl leading-snug text-brand-ink sm:text-4xl">
          "{active.quote}"
        </blockquote>
        <p className="mt-5 text-sm font-semibold text-brand-ink/60">{active.name}</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <TriMark className="h-2 w-7 text-brand-coral/40" />
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Show testimonial ${i + 1}`}
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
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-sand">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="py-5">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif-display text-lg text-brand-ink sm:text-xl">{item.q}</span>
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
              <p className="overflow-hidden text-brand-ink/70">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Wire this up to your actual mailing list provider — this just confirms client-side for now.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-serif-display text-xl text-brand-ink">
        You're on the list. First update lands soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-wrap gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="min-w-0 flex-1 rounded-full border border-black/15 px-5 py-3 text-sm text-brand-ink outline-none focus:border-brand-coral"
      />
      <button
        type="submit"
        className="rounded-full bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
      >
        Get updates
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GetInvolvedPage() {
  const [persona, setPersona] = useState<PersonaKey>("volunteers");
  const [displayedPersona, setDisplayedPersona] = useState<PersonaKey>("volunteers");
  const [personaFade, setPersonaFade] = useState(true);

  useEffect(() => {
    setPersonaFade(false);
    const t = setTimeout(() => {
      setDisplayedPersona(persona);
      setPersonaFade(true);
    }, 150);
    return () => clearTimeout(t);
  }, [persona]);

  const active = personas[displayedPersona];
  const cardAccents = ["bg-brand-coral", "bg-brand-ink", "bg-brand-sand"];
  const cardTilts = ["-rotate-1", "rotate-0", "rotate-1"];

  return (
    <SiteLayout>
      {/* Local keyframes for the marquee band and the faint dot texture. */}
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
        .l21-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 18px 18px;
        }
      `}</style>

      {/* ---------- STORY HERO ---------- */}
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <Blob className="-top-10 -right-16 h-72 w-72 bg-[#F8DCDA] opacity-40" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative">
            <Eyebrow>Celebrating Ability</Eyebrow>
            <h1 className="mt-3 font-serif-display text-4xl leading-[1.05] text-brand-ink sm:text-5xl lg:text-6xl">
              This isn&apos;t a disability issue.
              <br />
              It&apos;s an{" "}
              <span className="relative italic text-brand-coral">
                opportunity
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
              issue.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-brand-ink/75">
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
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-brand-sand lg:aspect-[3/4]">
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
                    21 Years in Hong Kong
                  </span>
                  <TriMark className="h-1.5 w-5 text-brand-coral/50" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                    Celebrating Ability
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- BY THE NUMBERS ---------- */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="left-1/2 top-0 h-96 w-96 -translate-x-1/2 bg-[#FBE3E3] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <div className="relative text-center">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-6 select-none overflow-hidden whitespace-nowrap text-center font-serif-display text-[14vw] leading-none text-brand-ink/[0.05] sm:text-[90px]"
            >
              NUMBERS
            </span>
            <div className="relative z-10 pt-10 sm:pt-14">
              <Eyebrow className="justify-center">By the numbers</Eyebrow>
              <h2 className="mx-auto mt-3 max-w-xl font-serif-display text-4xl text-brand-ink sm:text-5xl">
                Not just statistics. Real families.
              </h2>
            </div>
          </div>

          <div className="relative mt-14 grid gap-6 sm:grid-cols-3">
            {impactStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div
                  className={`h-full rounded-[32px] bg-gradient-to-br from-[#2A1414] to-[#160B0B] px-7 py-9 text-white shadow-lg shadow-red-900/10 transition-all duration-500 hover:-translate-y-2 hover:rotate-0 hover:shadow-xl ${cardTilts[i % cardTilts.length]}`}
                >
                  <div className="font-serif-display text-5xl">{stat.value}</div>
                  <div className="mt-3 text-sm leading-snug text-white/70">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#FFFFFF" />

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

        <section id="programmes" className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Programmes</Eyebrow>
                <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">What we do</h2>
              </div>
              <p className="max-w-2xl text-sm text-brand-ink/70">
                A whole-person model — sport, nutrition, and family support — because reaching full
                potential takes more than one hour a week.
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
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link href="/members" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Join as a member</Link>
                      <Link href="/our-volunteer" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Volunteer</Link>
                      <Link href="/donate" className="rounded-md font-semibold text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Donate</Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- GALLERY STRIP ---------- */}
        <section className="relative px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink/50">
              <IconHeart className="h-4 w-4" /> Life at Love 21, in between the numbers
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
      </div>

      <WaveDivider color="#EAF6F2" />

      {/* ---------- WEEKLY RHYTHM ---------- */}
      <section className="relative overflow-hidden bg-[#EAF6F2] px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="right-8 top-8 h-36 w-36 bg-white/50" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
            <IconSprout className="h-4 w-4" /> A week at Love 21
          </div>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">
            This is what "600+ families a month" looks like on the ground
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {weeklyRhythm.map((slot) => (
              <div key={slot.day + slot.programme} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-coral">{slot.day}</div>
                <div className="mt-2 font-serif-display text-lg text-brand-ink">{slot.programme}</div>
                <div className="mt-1 text-sm text-brand-ink/60">{slot.time}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-ink/50">
            Placeholder schedule — replace with your real weekly calendar before publishing.
          </p>
        </div>
      </section>

      {/* ---------- THE DONOR JOURNEY ---------- */}
      <section id="journey" className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <Blob className="-left-16 bottom-0 h-64 w-64 bg-brand-coral/20" />
        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
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
                <Reveal key={step.step} delay={i * 100} className="relative rounded-2xl border border-white/15 bg-white/[0.03] p-7">
                  <span className="flex items-center gap-2 font-serif-display text-sm text-brand-coral">
                    <span className="h-2 w-2 rounded-full bg-brand-coral" />
                    {step.step}
                  </span>
                  <h3 className="mt-3 font-serif-display text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{step.body}</p>
                  <Link
                    href={step.href}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-coral hover:underline"
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

      {/* ---------- WHERE YOUR GIFT GOES ---------- */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 bg-[#FBE3E3] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <Eyebrow>Donor transparency</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Where your gift goes</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {donationTiers.map((tier, i) => (
              <div
                key={tier.amount}
                className={`rounded-2xl border border-brand-sand bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"}`}
              >
                <div className="font-serif-display text-2xl text-brand-coral">{tier.amount}</div>
                <p className="mt-3 text-sm text-brand-ink/70">{tier.impact}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CtaButton href="/donate">Choose your tier</CtaButton>
          </div>
        </div>
      </section>

      {/* ---------- PERSONA SWITCHER: CHOOSE YOUR PATHWAY ---------- */}
      <section className="relative overflow-hidden bg-[#FBEAEA] px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="-top-14 right-10 h-52 w-52 bg-white/40" />
        <div className="relative mx-auto max-w-6xl">
          <Eyebrow>Get Involved</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Choose your path</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-ink/70">
            Select the option that sounds closest. Each path has one main next step.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {(Object.keys(personas) as PersonaKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setPersona(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-offset-2 ${
                  persona === key
                    ? "bg-black text-white"
                    : "bg-white text-brand-ink hover:bg-black/10"
                }`}
              >
                {personas[key].label}
              </button>
            ))}
          </div>

          <div
            className={`mt-8 rounded-3xl border border-black/10 bg-white p-8 transition-opacity duration-300 sm:p-10 ${
              personaFade ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3 className="max-w-2xl font-serif-display text-2xl text-brand-ink sm:text-3xl">
              {active.headline}
            </h3>
            <p className="mt-4 max-w-2xl text-brand-ink/75">{active.body}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <CtaButton href={active.primary.href}>{active.primary.label}</CtaButton>
              {active.secondary && (
                <CtaButton href={active.secondary.href} variant="outline">{active.secondary.label}</CtaButton>
              )}
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
              alt="A Love 21 member during a community activity"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
              <IconTrophy className="h-4 w-4" /> A Love 21 Story
            </p>
            <div className="mt-3">
              <TestimonialCarousel />
            </div>
            <Link href="/stories" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-coral hover:underline">
              Read more member stories
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative overflow-hidden bg-brand-sand px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow>Before you reach out</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Questions people actually ask</h2>
          <div className="mt-8 rounded-3xl bg-white px-6 sm:px-8">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ---------- OTHER WAYS TO GIVE ---------- */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-brand-sand p-8">
            <IconHands className="absolute -right-2 -top-2 h-20 w-20 text-brand-ink/[0.06] transition-transform duration-500 group-hover:rotate-6" />
            <h3 className="relative font-serif-display text-2xl text-brand-ink">Start your own campaign</h3>
            <p className="relative mt-3 text-brand-ink/75">
              Running a marathon, doing a birthday fundraiser, or leading a school drive? Set up a
              peer-to-peer page in minutes and rally your own network.
            </p>
            <Link href="/campaigns/new" className="group/link relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-coral hover:underline">
              Start a campaign
              <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1.5">→</span>
            </Link>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-brand-sand p-8">
            <IconHeart className="absolute -right-2 -top-2 h-20 w-20 text-brand-ink/[0.06] transition-transform duration-500 group-hover:rotate-6" />
            <h3 className="relative font-serif-display text-2xl text-brand-ink">Give something, not just cash</h3>
            <p className="relative mt-3 text-brand-ink/75">
              Our wishlist — built with Crossroads Foundation — lists exactly what's needed right
              now, so your gift goes where it counts instead of into storage.
            </p>
            <Link href="/shop" className="group/link relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-coral hover:underline">
              View the wishlist
              <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section className="relative overflow-hidden border-t border-brand-sand bg-white px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="left-0 bottom-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 bg-[#EAF6F2] opacity-60" />
        <div className="relative mx-auto max-w-6xl">
          <Eyebrow>Stay close</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">
            One email a month. No noise.
          </h2>
          <div className="mt-6">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="relative overflow-hidden bg-black px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <Blob className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-brand-coral/10" />
        <div className="relative">
          <TriMark className="mx-auto h-2.5 w-9 text-brand-coral" />
          <h2 className="mt-4 font-serif-display text-3xl sm:text-4xl">Ability doesn&apos;t need permission. It needs opportunity.</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CtaButton href="/donate">Donate now</CtaButton>
            <CtaButton href="/our-volunteer" variant="outline-dark">Volunteer</CtaButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}