"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { SiteLayout } from "@/components/site/site-layout";
import { api, type VolunteerActivity } from "@/lib/api";
import {
  availabilityOptions,
  categoryMeta,
  interestOptions,
  rosterItems as fallbackRosterItems,
  type Availability,
  type Category,
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

// ---------------------------------------------------------------------------
// Page-only content (roster + matcher data lives in lib/volunteer-roster.ts)
// ---------------------------------------------------------------------------

function mapActivityToRosterItem(activity: VolunteerActivity): RosterItem {
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
    ctaLabel: activity.cta_label ?? "I'm interested",
  };
}

// Placeholder — wire up to Instagram/Facebook Graph API later.
const socialPosts = [
  { platform: "Instagram", caption: "Saturday football squad putting in the work ⚽", date: "2 days ago", href: "#" },
  { platform: "Instagram", caption: "Dragon boat practice ahead of next month's race 🐉", date: "5 days ago", href: "#" },
  { platform: "Facebook", caption: "Thank you to this quarter's corporate volunteer team!", date: "1 week ago", href: "#" },
];

// Replace with a real, consented volunteer story before this goes live.
const volunteerStories = [
  {
    quote: "I signed up for one Saturday shift because a friend dragged me along. Eighteen months later I'm on the events committee.",
    name: "[Volunteer name], class volunteer since 2024",
  },
  {
    quote: "My daughter has Down syndrome, and I never expected to be the one coaching football. Now I can't imagine my Saturdays without it.",
    name: "[Volunteer name], parent & sports volunteer",
  },
  {
    quote: "Our team came for one CSR morning. Half of us still show up monthly, on our own time.",
    name: "[Company name], corporate partner",
  },
];

// Candid, in-the-field moments — placeholder paths.
const galleryStrip = [
  { src: "/images/get-involved/gallery-1.jpeg", alt: "A volunteer coaching a football drill", shape: "rounded-[42%_58%_65%_35%/45%_40%_60%_55%]" },
  { src: "/images/get-involved/gallery-2.jpeg", alt: "Volunteers helping run a cooking workshop", shape: "rounded-[60%_40%_35%_65%/55%_60%_40%_45%]" },
  { src: "/images/get-involved/gallery-3.jpg", alt: "A high-five between a volunteer and a member at swim class", shape: "rounded-[35%_65%_55%_45%/60%_35%_65%_40%]" },
  { src: "/images/get-involved/gallery-4.jpg", alt: "A corporate volunteer team on-site", shape: "rounded-[55%_45%_40%_60%/40%_55%_45%_60%]" },
];

const faqs = [
  { q: "Do I need experience to volunteer?", a: "No. Most of our volunteers have never worked with neurodiverse members before their first shift. Coaches brief you on-site, every time." },
  { q: "What if I need to cancel a shift?", a: "Life happens — cancel or swap through the member app up to 24 hours ahead, no penalty. We'd just ask you not to no-show, since a role sitting empty means a class runs short-staffed." },
  { q: "Is training provided?", a: "Yes. Every new volunteer gets a short on-site briefing before their first shift, plus a returning volunteer paired alongside them for support." },
  { q: "Can I bring a friend, or volunteer as a group?", a: "Absolutely — group and friend sign-ups are common, especially for the community dinners & trips crew and corporate days." },
];

// ---- One-pager generator -------------------------------------------------

function generateCsrOnePager() {
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
      <div class="tag">Bring your team</div>
      <h1>Corporate Volunteer Day at Love 21 Foundation</h1>
      <p>Share this with your HR or CSR team — everything they need to say yes is on this page.</p>

      <div class="stat-row">
        <div class="stat"><b>600+</b>families supported monthly</div>
        <div class="stat"><b>~1,000</b>classes run each month</div>
        <div class="stat"><b>21 yrs</b>building this community in HK</div>
      </div>

      <p><b>What it is:</b> A hands-on day at our San Po Kong centre alongside our members —
      no experience needed. Past teams have helped run sports sessions, nutrition workshops,
      and community events.</p>

      <p><b>Why it matters for your team:</b> Employees leave with a direct, ability-focused
      understanding of neurodiversity — not a lecture, a real afternoon spent together.</p>

      <p><b>Next step:</b> Reply to this email or visit our Get Involved page to pick a date
      for your team.</p>

      <div class="cta">Contact us at partnerships@love21.org.hk to book your team's date.</div>

      <footer>Love 21 Foundation · San Po Kong, Kowloon · Generated from a volunteer's visit to love21.org.hk/our-volunteer</footer>

      <p class="no-print"><button onclick="window.print()">Print / Save as PDF</button></p>
    </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
}

// ---------------------------------------------------------------------------
// Small components
// ---------------------------------------------------------------------------

function VolunteerStoryCarousel() {
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
  }, []);

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
              aria-label={`Show story ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-coral" : "w-1.5 bg-brand-ink/20"}`}
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
  const [interest, setInterest] = useState<Interest | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [thinking, setThinking] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [resultIndex, setResultIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiEnhanced, setAiEnhanced] = useState(false);

  async function findMatch() {
    if (!interest || !availability) return;
    setThinking(true);
    setResults(null);
    setError(null);
    setAiEnhanced(false);

    try {
      const response = await api.matchVolunteer({ interest, availability });
      if (!response.enabled || response.matches.length === 0) {
        setError(response.message || "No matches found right now. Try another combination.");
        return;
      }

      const mapped = response.matches
        .map((match) => {
          const item = rosterItems.find((role) => role.id === match.role_id);
          if (!item) return null;
          return { item, score: match.score, reasons: match.reasons };
        })
        .filter((match): match is MatchResult => match !== null);

      if (mapped.length === 0) {
        setError("We couldn't map those matches to open roles. Please try again.");
        return;
      }

      setResults(mapped);
      setAiEnhanced(response.ai_enhanced);
      setResultIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Matching failed. Is the backend running on port 8000?");
    } finally {
      setThinking(false);
    }
  }

  function reset() {
    setInterest(null);
    setAvailability(null);
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
          New · Smart Matching
        </p>
        {(interest || availability || results || error) && !thinking && (
          <button onClick={reset} className="text-xs font-semibold text-white/50 hover:text-white">
            Start over
          </button>
        )}
      </div>

      <h3 className="mt-3 font-serif-display text-3xl text-white sm:text-4xl">
        Not sure where you fit? Let it find your shift.
      </h3>
      <p className="mt-3 max-w-xl text-sm text-white/65">
        Two questions, and we&apos;ll match you against every open role by pillar, timing, and real capacity.
      </p>

      {!results && !thinking && (
        <div className="mt-8 space-y-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">1. What pulls you in?</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {interestOptions.map((opt) => (
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
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">2. When are you usually free?</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {availabilityOptions.map((opt) => (
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

          <button
            onClick={findMatch}
            disabled={!interest || !availability}
            className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-brand-coral disabled:hover:text-white"
          >
            Find my match →
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
          Weighing pillar fit, timing, and open capacity…
        </div>
      )}

      {results && active && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/50">Your best match</span>
            <div className="flex items-center gap-2">
              {aiEnhanced && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">AI polished</span>
              )}
              <span className="rounded-full bg-brand-coral/15 px-3 py-1 text-xs font-semibold text-brand-coral">
                {active.score}% match
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
              Sign me up for this
            </button>
            {results.length > 1 && (
              <button
                onClick={() => setResultIndex((resultIndex + 1) % results.length)}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40"
              >
                See another match
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

function VolunteerContent() {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const initialFilter: Category | "all" = requestedCategory && requestedCategory in categoryMeta ? (requestedCategory as Category) : "all";

  const [rosterItems, setRosterItems] = useState<RosterItem[]>(fallbackRosterItems);
  const [filter, setFilter] = useState<Category | "all">(initialFilter);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>(fallbackRosterItems[0].title);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .listVolunteerActivities()
      .then((activities) => {
        if (activities.length === 0) return;
        const mapped = activities.map(mapActivityToRosterItem);
        setRosterItems(mapped);
        setSelectedOpportunity((current) =>
          mapped.some((item) => item.title === current) ? current : mapped[0].title,
        );
      })
      .catch(() => {
        // Keep local fallback roster if backend is unavailable.
      });
  }, []);

  const visibleItems = useMemo(
    () => (filter === "all" ? rosterItems : rosterItems.filter((item) => item.category === filter)),
    [filter, rosterItems],
  );

  const urgentItems = useMemo(
    () =>
      rosterItems
        .filter((item) => item.total && item.filled !== undefined && item.filled / item.total >= 0.6)
        .sort((a, b) => b.filled! / b.total! - a.filled! / a.total!)
        .slice(0, 2),
    [rosterItems],
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
            <Eyebrow>Get Involved · Volunteers</Eyebrow>
            <h1 className="mt-3 max-w-2xl font-serif-display text-4xl leading-[1.08] text-brand-ink sm:text-5xl">
              Come be part of a <span className="text-brand-coral">so much ability</span> community.
            </h1>
            <p className="mt-5 max-w-lg text-brand-ink/75">
              No email chains, no waiting on the office. Pick an opening across sport, nutrition,
              family support or a corporate day, and you&apos;re confirmed straight away.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <a href="#opportunities" className="rounded-full bg-brand-coral px-7 py-3.5 text-sm font-semibold text-white hover:bg-black">
                See open roles
              </a>
              <a href="#match" className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold text-brand-ink hover:border-black">
                Not sure where to start?
              </a>
            </div>
          </div>

          <div className="relative">
            <Blob className="-bottom-8 -left-10 h-40 w-40 bg-[#EAF6F2] opacity-70" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[55%_45%_35%_65%/55%_35%_65%_45%] bg-brand-sand lg:aspect-[3/4]">
              {/* Swap for a real photo of a volunteer mid-shift — energetic, not posed. */}
              <Image src="/images/get-involved/hero-image.png" alt="A volunteer coaching alongside a Love 21 member" fill priority className="object-cover" />
            </div>
          </div>
        </div>

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
        </div>
      </section>

      {/* ---------- URGENCY STRIP ---------- */}
      {urgentItems.length > 0 && (
        <section className="bg-black px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white">
            <span className="flex items-center gap-2 font-semibold text-brand-coral">
              <TriMark className="h-2 w-6" />
              Going fast
            </span>
            {urgentItems.map((item) => (
              <a key={item.id} href="#opportunities" className="text-white/80 hover:text-white">
                {item.title} — {item.filled}/{item.total} filled
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ---------- OPPORTUNITIES BOARD ---------- */}
      <section id="opportunities" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>The board</Eyebrow>
              <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Open opportunities</h2>
            </div>
            <p className="max-w-md text-sm text-brand-ink/70">
              Every role sits under one of our four programme pillars. Pick the one that fits you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              <button
                onClick={() => setFilter("all")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-semibold transition lg:rounded-none lg:border-l-2 lg:px-0 lg:pl-4 ${
                  filter === "all"
                    ? "bg-black text-white lg:bg-transparent lg:border-brand-coral lg:text-brand-ink"
                    : "bg-brand-sand text-brand-ink lg:bg-transparent lg:border-transparent lg:text-brand-ink/60"
                }`}
              >
                All roles
              </button>
              {(Object.keys(categoryMeta) as Category[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-semibold transition lg:rounded-none lg:border-l-2 lg:px-0 lg:pl-4 ${
                    filter === key
                      ? "bg-black text-white lg:bg-transparent lg:border-brand-coral lg:text-brand-ink"
                      : "bg-brand-sand text-brand-ink lg:bg-transparent lg:border-transparent lg:text-brand-ink/60"
                  }`}
                >
                  {categoryMeta[key].label}
                  <span className="hidden text-xs font-normal text-brand-ink/50 lg:block">{categoryMeta[key].blurb}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {visibleItems.map((item, i) => {
                const pct = item.total && item.filled !== undefined ? Math.round((item.filled / item.total) * 100) : null;
                return (
                  <Reveal key={item.id} delay={i * 60}>
                    <article className="h-full rounded-2xl border border-brand-sand p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-sand text-lg">{item.icon}</div>
                      <h3 className="text-xl text-brand-ink">{item.title}</h3>
                      <p className="mt-2 text-sm text-brand-ink/70">{item.desc}</p>
                      <div className="mt-4 flex flex-col gap-1 text-xs text-brand-ink/60">
                        <span><b className="font-semibold text-brand-ink">When:</b> {item.when}</span>
                        <span><b className="font-semibold text-brand-ink">Where:</b> {item.where}</span>
                      </div>

                      {pct !== null ? (
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-sand">
                            <div className="h-full rounded-full bg-brand-coral" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="whitespace-nowrap text-xs text-brand-ink/50">{item.filled} / {item.total} filled</span>
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
                          onClick={generateCsrOnePager}
                          className="mt-2 w-full rounded-full border border-black/15 py-2.5 text-xs font-semibold text-brand-ink hover:border-black"
                        >
                          Generate a one-pager for your HR/CSR team
                        </button>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#F8F4EB" />

      {/* ---------- VOLUNTEER STORY SPOTLIGHT ---------- */}
      <section className="relative overflow-hidden bg-[#F8F4EB] px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="-left-16 top-1/3 h-56 w-56 bg-[#F8DCDA] opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-brand-sand">
            {/* Replace with a real volunteer photo — mid-shift, genuine, not posed. */}
            <Image src="/images/get-involved/story-spotlight.png" alt="A Love 21 volunteer during a shift" fill className="object-cover" />
          </div>
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
              <IconTrophy className="h-4 w-4" /> Volunteer Spotlight
            </p>
            <div className="mt-3">
              <VolunteerStoryCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- GALLERY ---------- */}
      <section className="bg-[#F8F4EB] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ink/50">
            <IconHeart className="h-4 w-4" /> Life on shift
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
          <Eyebrow>From our feed</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">As featured this week</h2>
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

      {/* ---------- SIGN UP ---------- */}
      <section id="signup" className="bg-brand-sand px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 sm:p-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>One form, no waiting</Eyebrow>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">Sign up. You&apos;re confirmed.</h2>
            <p className="mt-4 text-sm text-brand-ink/70">
              This form replaces the old manual email process. Submit it and get an instant
              confirmation — no staff follow-up required before you can show up.
            </p>
            <div className="mt-4 inline-block rounded-full bg-brand-sand px-4 py-2 text-xs font-semibold text-brand-ink">
              Auto-confirmed · no approval queue
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-brand-sand p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-ink/70">Full name</label>
                <input required placeholder="Chan Tai Man" className="rounded-lg border border-brand-sand px-3 py-2.5 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-ink/70">Email</label>
                <input required type="email" placeholder="you@email.com" className="rounded-lg border border-brand-sand px-3 py-2.5 text-sm" />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-ink/70">Phone</label>
                <input type="tel" placeholder="+852 0000 0000" className="rounded-lg border border-brand-sand px-3 py-2.5 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-ink/70">Opportunity</label>
                <select
                  value={selectedOpportunity}
                  onChange={(e) => setSelectedOpportunity(e.target.value)}
                  className="rounded-lg border border-brand-sand px-3 py-2.5 text-sm"
                >
                  {rosterItems.map((item) => (
                    <option key={item.id} value={item.title}>{item.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-ink/70">Availability</label>
              <textarea placeholder="e.g. Saturday mornings, or flexible weekday evenings" className="min-h-[70px] rounded-lg border border-brand-sand px-3 py-2.5 text-sm" />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-[260px] text-xs text-brand-ink/50">
                Signing up also starts your tracked hours toward recognition badges.
              </p>
              <button type="submit" className="rounded-full bg-brand-coral px-6 py-3 text-sm font-semibold text-white hover:bg-black">
                Confirm my spot
              </button>
            </div>
            {submitted && (
              <div className="mt-4 rounded-lg bg-brand-sand p-4 text-sm text-brand-ink">
                You&apos;re confirmed for <b>{selectedOpportunity}</b> — a calendar invite and a welcome note are on their way to your inbox.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ---------- RECOGNITION ---------- */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>Hours & recognition</Eyebrow>
          <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">Every hour counts, and it shows</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { tier: "1", title: "First cap", body: "Your first logged shift. Welcome to the roster." },
              { tier: "10", title: "Season regular", body: "10 hours in — you've got a standing spot on the schedule." },
              { tier: "50", title: "Community favourite", body: "50 hours of showing up. Featured in our volunteer spotlight." },
              { tier: "100", title: "Team captain", body: "100+ hours. Invited to help lead new volunteer onboarding." },
            ].map((m) => (
              <div key={m.tier} className="rounded-2xl border border-brand-sand p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">{m.tier}</div>
                <h3 className="text-base text-brand-ink">{m.title}</h3>
                <p className="mt-2 text-xs text-brand-ink/60">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-brand-sand p-7">
            <div className="font-serif-display text-3xl text-brand-ink">32<span className="text-sm font-sans font-normal text-brand-ink/60"> hrs</span></div>
            <div className="h-2.5 flex-1 min-w-[200px] overflow-hidden rounded-full bg-white">
              <div className="h-full w-[64%] rounded-full bg-brand-coral" />
            </div>
            <div className="text-xs text-brand-ink/60">18 hours to your Community Favourite ribbon</div>
          </div>
        </div>
      </section>

      {/* ---------- CORPORATE NUDGE ---------- */}
      <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-2xl border border-brand-sand border-l-4 border-l-brand-coral p-8">
          <div>
            <h3 className="max-w-lg text-xl text-brand-ink">Know a company that could sponsor a class of 15?</h3>
            <p className="mt-2 max-w-md text-sm text-brand-ink/70">
              Volunteers are often the first link to a new corporate partner — a quick introduction goes a long way.
            </p>
          </div>
          <button
            onClick={generateCsrOnePager}
            className="rounded-full bg-brand-sand px-6 py-3 text-sm font-semibold text-brand-ink hover:bg-black hover:text-white"
          >
            Generate one-pager to introduce them
          </button>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative overflow-hidden bg-brand-sand px-4 py-20 sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow>Before you sign up</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Questions people actually ask</h2>
          <div className="mt-8 rounded-3xl bg-white px-6 sm:px-8">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ---------- AI VOLUNTEER MATCH ---------- */}
      <section id="match" className="relative overflow-hidden bg-black px-4 py-24 sm:px-6 lg:px-8">
        <Blob className="-left-20 top-0 h-72 w-72 bg-brand-coral/15" />
        <Blob className="-right-16 bottom-0 h-64 w-64 bg-brand-coral/10" />
        <AiVolunteerMatch rosterItems={rosterItems} onSelectRole={selectRoleAndScroll} />
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="relative overflow-hidden bg-[#F8F4EB] px-4 py-16 text-center sm:px-6 lg:px-8">
        <Blob className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[#F8DCDA] opacity-50" />
        <div className="relative">
          <TriMark className="mx-auto h-2.5 w-9 text-brand-coral" />
          <h2 className="mt-4 font-serif-display text-3xl text-brand-ink sm:text-4xl">Every shift starts with someone saying yes.</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CtaButton href="#opportunities">Browse open roles</CtaButton>
            <CtaButton href="/donate" variant="outline">Prefer to give instead?</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}