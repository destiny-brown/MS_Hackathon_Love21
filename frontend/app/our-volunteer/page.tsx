"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Blob } from "@/components/brand/Blob";
import { BrandCard } from "@/components/brand/BrandCard";
import { CtaButton } from "@/components/brand/CtaButton";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Reveal } from "@/components/brand/Reveal";
import { TriMark } from "@/components/brand/TriMark";
import { PageSectionNav, type PageSectionNavItem } from "@/components/site/page-section-nav";
import { SiteLayout } from "@/components/site/site-layout";
import { LiveActivityBadge } from "@/components/volunteer/live-activity-badge";
import { VolunteerFaqAccordion } from "@/components/volunteer/volunteer-faq-accordion";
import { VolunteerStoryCarousel } from "@/components/volunteer/volunteer-story-carousel";
import { api, getCurrentUserWithRole, type VolunteerActivity, type User } from "@/lib/api";
import {
  availabilityOptions,
  categoryMeta,
  commitmentOptions,
  groupSizeOptions,
  interestOptions,
  rosterItems as fallbackRosterItems,
  type Availability,
  type Category,
  type Commitment,
  type GroupSize,
  type Interest,
  type RosterItem,
} from "@/lib/volunteer-roster";

const sectionNavItems: PageSectionNavItem[] = [
  { id: "our-volunteer-hero", label: "Roles" },
  { id: "campaign", label: "Campaign" },
  { id: "opportunities", label: "Opportunities" },
  { id: "life-on-shift", label: "Life" },
  { id: "faq", label: "FAQ" },
  { id: "match", label: "AI Match" },
];

// ---------------------------------------------------------------------------
// Page-local decorative helpers (WaveDivider / icons stay here).
// ---------------------------------------------------------------------------

function DashedRule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`mt-2 block h-px w-16 border-t border-dashed border-brand-red/40 ${className}`} />;
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
    signedUp: activity.signed_up,
  };
}

// Placeholder — wire up to Instagram/Facebook Graph API later.
const socialPosts = [
  { platform: "Instagram", caption: "Saturday football squad putting in the work ⚽", date: "2 days ago", href: "#" },
  { platform: "Instagram", caption: "Dragon boat practice ahead of next month's race 🐉", date: "5 days ago", href: "#" },
  { platform: "Facebook", caption: "Thank you to this quarter's corporate volunteer team!", date: "1 week ago", href: "#" },
];

// Replace with a real, consented volunteer story before this goes live.

// Candid, in-the-field moments — placeholder paths.
const galleryStrip = [
  { src: "/images/get-involved/gallery-1.jpeg", alt: "A volunteer coaching a football drill", shape: "rounded-[42%_58%_65%_35%/45%_40%_60%_55%]" },
  { src: "/images/get-involved/gallery-2.jpeg", alt: "Volunteers helping run a cooking workshop", shape: "rounded-[60%_40%_35%_65%/55%_60%_40%_45%]" },
  { src: "/images/get-involved/gallery-3.jpg", alt: "A high-five between a volunteer and a member at swim class", shape: "rounded-[35%_65%_55%_45%/60%_35%_65%_40%]" },
  { src: "/images/get-involved/gallery-4.jpg", alt: "A corporate volunteer team on-site", shape: "rounded-[55%_45%_40%_60%/40%_55%_45%_60%]" },
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
  onSelectRole: (item: RosterItem) => void;
}) {
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
        setError(response.message || "AI matching is unavailable right now. Try again in a moment.");
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
        <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
          <IconSpark className="h-4 w-4" />
          AI · Smart Matching
        </p>
        {(interest || availability || commitment || groupSize || results || error) && !thinking && (
          <button onClick={reset} className="text-xs font-semibold text-white/50 hover:text-white">
            Start over
          </button>
        )}
      </div>

      <h3 className="mt-3 font-serif-display text-3xl text-white sm:text-4xl">
        Not sure where you fit? Let it find your shift.
      </h3>
      <p className="mt-3 max-w-xl text-sm text-white/65">
        Four quick questions, and our local AI (Ollama) will read every open role to find the best fit for your interests, timing, commitment, and group size.
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
                    interest === opt.key ? "border-brand-red bg-brand-red/10" : "border-white/15 hover:border-white/30"
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
                    availability === opt.key ? "border-brand-red bg-brand-red/10 text-white" : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">3. How often can you commit?</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {commitmentOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setCommitment(opt.key)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    commitment === opt.key ? "border-brand-red bg-brand-red/10 text-white" : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">4. Coming alone, or bringing others?</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {groupSizeOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setGroupSize(opt.key)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    groupSize === opt.key ? "border-brand-red bg-brand-red/10 text-white" : "border-white/15 text-white/70 hover:border-white/30"
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
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-brand-red disabled:hover:text-white"
          >
            Ask AI for my match →
          </button>
        </div>
      )}

      {thinking && (
        <div className="mt-10 flex items-center gap-3 text-sm text-white/60">
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red" />
          </span>
          Ollama is reading every open role and weighing your answers…
        </div>
      )}

      {results && active && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/50">Your best match</span>
            <div className="flex items-center gap-2">
              {aiEnhanced && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">AI matched</span>
              )}
              <span className="rounded-full bg-brand-red/15 px-3 py-1 text-xs font-semibold text-brand-red">
                {active.score}% match
              </span>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-brand-red transition-all duration-700" style={{ width: `${active.score}%` }} />
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
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                {reason}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectRole(active.item)}
              className="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              {active.item.signedUp ? "You're registered" : "Sign me up for this"}
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

const ROLES_PREVIEW_COUNT = 4;

function VolunteerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const requestedSignup = searchParams.get("signup");
  const initialFilter: Category | "all" = requestedCategory && requestedCategory in categoryMeta ? (requestedCategory as Category) : "all";

  const [rosterItems, setRosterItems] = useState<RosterItem[]>(fallbackRosterItems);
  const [filter, setFilter] = useState<Category | "all">(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registeringSlug, setRegisteringSlug] = useState<string | null>(null);
  const [handledRedirectSignup, setHandledRedirectSignup] = useState(false);

  async function loadVolunteerActivities() {
    try {
      const activities = await api.listVolunteerActivities();
      if (activities.length === 0) return;
      const mapped = activities.map(mapActivityToRosterItem);
      setRosterItems(mapped);
    } catch {
      // Keep local fallback roster if backend is unavailable.
    }
  }

  useEffect(() => {
    getCurrentUserWithRole()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setCurrentUserLoading(false));
    loadVolunteerActivities();
  }, []);

  const visibleItems = useMemo(() => {
    let items = filter === "all" ? rosterItems : rosterItems.filter((item) => item.category === filter);
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
  }, [filter, rosterItems, searchQuery]);

  useEffect(() => {
    setShowAllRoles(false);
  }, [filter, searchQuery]);

  const displayedItems = showAllRoles ? visibleItems : visibleItems.slice(0, ROLES_PREVIEW_COUNT);
  const hiddenCount = visibleItems.length - ROLES_PREVIEW_COUNT;

  const urgentItems = useMemo(
    () =>
      rosterItems
        .filter((item) => item.total && item.filled !== undefined && item.filled / item.total >= 0.6)
        .sort((a, b) => b.filled! / b.total! - a.filled! / a.total!)
        .slice(0, 2),
    [rosterItems],
  );

  async function registerForRole(item: RosterItem) {
    setRegistrationMessage("");
    setRegistrationError("");

    if (!currentUser) {
      router.push(`/login?role=supporter&next=${encodeURIComponent(`/our-volunteer?signup=${item.id}`)}`);
      return;
    }

    setRegisteringSlug(item.id);
    try {
      const registration = await api.signUpForVolunteerActivity(item.id);
      setRosterItems((items) =>
        items.map((role) => (role.id === registration.activity_slug ? { ...role, signedUp: true } : role)),
      );
      setRegistrationMessage(`You're registered for ${registration.activity_name}.`);
      await loadVolunteerActivities();
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : "Could not register for this activity");
    } finally {
      setRegisteringSlug(null);
    }
  }

  useEffect(() => {
    if (handledRedirectSignup || currentUserLoading || !currentUser || !requestedSignup) return;
    const item = rosterItems.find((role) => role.id === requestedSignup);
    if (!item) return;
    setHandledRedirectSignup(true);
    registerForRole(item);
    router.replace("/our-volunteer", { scroll: false });
  }, [currentUser, currentUserLoading, handledRedirectSignup, requestedSignup, rosterItems, router]);

  return (
    <>
      {/* Sentinel for section-nav reveal — not a nav target. */}
      <div id="our-volunteer-nav-sentinel" className="h-px w-full" aria-hidden="true" />

      {/* ---------- HERO ---------- */}
      <Reveal>
        <section
          id="our-volunteer-hero"
          className="relative scroll-mt-24 overflow-hidden bg-white px-4 pb-10 pt-14 sm:px-6 lg:px-8"
        >
          <Blob className="-top-10 -right-16 h-72 w-72 bg-[#F8DCDA] opacity-40" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Eyebrow>Get Involved · Volunteers</Eyebrow>
              <h1 className="mt-3 max-w-2xl font-serif-display text-4xl leading-[1.08] text-brand-dark sm:text-5xl">
                Come be part of a{" "}
                <span className="relative text-brand-red">
                  so much ability
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
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="1 8"
                    />
                  </svg>
                </span>{" "}
                community.
              </h1>
              <p className="mt-5 max-w-lg text-brand-dark/75">
                No email chains, no waiting on the office. Pick an opening
                across sport, nutrition, family support or a corporate day, and
                you&apos;re confirmed straight away.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#opportunities"
                  className="rounded-full bg-brand-red px-7 py-3.5 text-sm font-semibold text-white hover:bg-black"
                >
                  See open roles
                </a>
                <a
                  href="#match"
                  className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold text-brand-dark hover:border-black"
                >
                  Not sure where to start?
                </a>
              </div>
              <LiveActivityBadge />
            </div>
            <div className="relative">
              <Blob className="-bottom-8 -left-10 h-40 w-40 bg-[#EAF6F2] opacity-70" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[55%_45%_35%_65%/55%_35%_65%_45%] bg-brand-light lg:aspect-[3/4]">
                {/* Swap for a real photo of a volunteer mid-shift — energetic, not posed. */}
                <Image
                  src="/images/get-involved/hero-image.png"
                  alt="A volunteer coaching alongside a Love 21 member"
                  fill
                  priority
                  className="object-cover"
                />
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
            <div key={stat.label} className="rounded-2xl bg-brand-light px-5 py-6">
              <div className="font-serif-display text-2xl text-brand-dark">{stat.value}</div>
              <div className="mt-1 text-xs leading-snug text-brand-dark/70">{stat.label}</div>
            </div>
          ))}
        </div> */}
        </section>
      </Reveal>

      <PageSectionNav items={sectionNavItems} heroSelector="#our-volunteer-nav-sentinel" />

      {/* ---------- START YOUR OWN CAMPAIGN ---------- */}
      <Reveal>
        <section
          id="campaign"
          className="scroll-mt-24 border-y border-brand-light bg-brand-light px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-2xl border border-dashed border-brand-red/40 bg-white p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                <IconFlag className="h-5 w-5 text-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
                  Another way to help
                </p>
                <h3 className="mt-1 max-w-md font-serif-display text-xl text-brand-dark sm:text-2xl">
                  Can&apos;t commit to a shift? Start your own fundraising
                  campaign instead.
                </h3>
                <p className="mt-2 max-w-md text-sm text-brand-dark/70">
                  Run a marathon, host a birthday fundraiser, or rally your
                  friends — set up a peer-to-peer page in minutes and raise
                  funds on your own schedule.
                </p>
              </div>
            </div>
            <a
              href="/contact-us"
              className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-brand-red px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-brand-red/90 hover:shadow-lg active:scale-95 animate-[heartbeat_1.5s_ease-in-out_infinite]"
            >
              <span className="relative z-10">
                Contact us to start a campaign
              </span>
              <span className="absolute inset-0 rounded-full bg-brand-red/30 blur-md animate-[pulse-ring_1.5s_ease-out_infinite]" />
            </a>
          </div>
        </section>
      </Reveal>

      {/* ---------- URGENCY STRIP ---------- */}
      {urgentItems.length > 0 && (
        <section className="bg-black px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white">
            <span className="flex items-center gap-2 font-semibold text-brand-red">
              <TriMark className="h-2 w-6" />
              Going fast
            </span>
            {urgentItems.map((item) => (
              <a
                key={item.id}
                href="#opportunities"
                className="text-white/80 hover:text-white"
              >
                {item.title} — {item.filled}/{item.total} filled
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ---------- OPPORTUNITIES BOARD ---------- */}
      <section
        id="opportunities"
        className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>The board</Eyebrow>
              <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">
                Open opportunities
              </h2>
            </div>
            <p className="max-w-md text-sm text-brand-dark/70">
              Every role sits under one of our four programme pillars. Pick the
              one that fits you.
            </p>
          </div>

          <div className="relative mb-8">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles — try “Saturday”, “cooking”, or “CSR”"
              className="w-full rounded-full border border-dashed border-brand-dark/20 bg-white py-3 pl-11 pr-4 text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition focus:border-solid focus:border-brand-red"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-dark/40 hover:text-brand-dark"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              <button
                onClick={() => setFilter("all")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-semibold transition lg:rounded-none lg:border-l-2 lg:px-0 lg:pl-4 ${
                  filter === "all"
                    ? "bg-black text-white lg:bg-transparent lg:border-solid lg:border-brand-red lg:text-brand-dark"
                    : "bg-brand-light text-brand-dark lg:bg-transparent lg:border-dashed lg:border-brand-dark/15 lg:text-brand-dark/60"
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
                      ? "bg-black text-white lg:bg-transparent lg:border-solid lg:border-brand-red lg:text-brand-dark"
                      : "bg-brand-light text-brand-dark lg:bg-transparent lg:border-dashed lg:border-brand-dark/15 lg:text-brand-dark/60"
                  }`}
                >
                  {categoryMeta[key].label}
                  <span className="hidden text-xs font-normal text-brand-dark/50 lg:block">
                    {categoryMeta[key].blurb}
                  </span>
                </button>
              ))}
            </div>

            <div>
              {registrationMessage ? (
                <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800" role="status">
                  {registrationMessage}
                </p>
              ) : null}
              {registrationError ? (
                <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700" role="alert">
                  {registrationError}
                </p>
              ) : null}

              {displayedItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-dark/20 p-10 text-center">
                  <p className="text-sm text-brand-dark/60">
                    No roles match{" "}
                    {searchQuery ? `“${searchQuery}”` : "this filter"} right
                    now.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                    className="mt-3 text-sm font-semibold text-brand-red hover:underline"
                  >
                    Clear search & filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {displayedItems.map((item, i) => {
                    const pct =
                      item.total && item.filled !== undefined
                        ? Math.round((item.filled / item.total) * 100)
                        : null;
                    return (
                      <Reveal key={item.id} delay={i * 0.06}>
                        <BrandCard
                          as="article"
                          className="h-full rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                        >
                          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-lg">
                            {item.icon}
                          </div>
                          <h3 className="text-xl text-brand-dark">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm text-brand-dark/70">
                            {item.desc}
                          </p>
                          <div className="mt-4 flex flex-col gap-1 text-xs text-brand-dark/60">
                            <span>
                              <b className="font-semibold text-brand-dark">
                                When:
                              </b>{" "}
                              {item.when}
                            </span>
                            <span>
                              <b className="font-semibold text-brand-dark">
                                Where:
                              </b>{" "}
                              {item.where}
                            </span>
                          </div>

                          {pct !== null ? (
                            <div className="mt-4 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light">
                                <div
                                  className="h-full rounded-full bg-brand-red"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="whitespace-nowrap text-xs text-brand-slate">
                                {item.filled} / {item.total} filled
                              </span>
                            </div>
                          ) : (
                            <div className="mt-4 text-xs text-brand-slate">
                              {item.note}
                            </div>
                          )}

                          <button
                            onClick={() => registerForRole(item)}
                            disabled={registeringSlug === item.id || item.signedUp}
                            className="mt-5 w-full rounded-full bg-brand-light py-3 text-sm font-semibold text-brand-dark hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-brand-light disabled:hover:text-brand-dark"
                          >
                            {item.signedUp ? "You're registered" : registeringSlug === item.id ? "Registering..." : item.ctaLabel}
                          </button>

                          {item.category === "csr" &&
                            item.id === "corporate-day" && (
                              <button
                                onClick={generateCsrOnePager}
                                className="mt-2 w-full rounded-full border border-brand-slate/40 py-2.5 text-xs font-semibold text-brand-dark hover:border-brand-dark"
                              >
                                Generate a one-pager for your HR/CSR team
                              </button>
                            )}
                        </BrandCard>
                      </Reveal>
                    );
                  })}
                </div>
              )}

              {hiddenCount > 0 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowAllRoles((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-dark/25 px-6 py-3 text-sm font-semibold text-brand-dark transition hover:border-black hover:border-solid"
                  >
                    {showAllRoles
                      ? "Show fewer roles"
                      : `View ${hiddenCount} more role${hiddenCount === 1 ? "" : "s"}`}
                    <span
                      aria-hidden="true"
                      className={`inline-block transition-transform duration-300 ${showAllRoles ? "rotate-180" : ""}`}
                    >
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#EDF2F4" />

      {/* ---------- GALLERY ---------- */}
      <section id="life-on-shift" className="scroll-mt-24 bg-brand-light px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark/50">
            <IconHeart className="h-4 w-4" /> Life on shift
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryStrip.map((photo, i) => (
              <Reveal key={photo.src} delay={i * 0.08}>
                <div
                  className={`relative aspect-square w-full overflow-hidden bg-brand-light ${photo.shape}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AS SEEN ON SOCIAL ---------- */}
      <Reveal>
        <section className="relative overflow-hidden border-t border-brand-light bg-white px-4 py-16 sm:px-6 lg:px-8">
          <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-40" />
          <div className="relative mx-auto max-w-6xl">
            <Eyebrow>From our feed</Eyebrow>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-dark sm:text-4xl">
              As featured this week
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {socialPosts.map((post) => (
                <a
                  key={post.caption}
                  href={post.href}
                  className="block rounded-2xl border border-brand-light p-5 transition hover:border-black/20"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                    {post.platform}
                  </div>
                  <p className="mt-3 text-sm text-brand-dark/80">
                    {post.caption}
                  </p>
                  <div className="mt-4 text-xs text-brand-dark/50">
                    {post.date}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- RECOGNITION ---------- */}
      <Reveal>
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>Hours & recognition</Eyebrow>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-dark sm:text-4xl">
              Every hour counts, and it shows
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  tier: "1",
                  title: "First cap",
                  body: "Your first logged shift. Welcome to the roster.",
                },
                {
                  tier: "10",
                  title: "Season regular",
                  body: "10 hours in — you've got a standing spot on the schedule.",
                },
                {
                  tier: "50",
                  title: "Community favourite",
                  body: "50 hours of showing up. Featured in our volunteer spotlight.",
                },
                {
                  tier: "100",
                  title: "Team captain",
                  body: "100+ hours. Invited to help lead new volunteer onboarding.",
                },
              ].map((m) => (
                <BrandCard key={m.tier} className="rounded-2xl p-6 sm:p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-dark text-sm font-semibold text-white">
                    {m.tier}
                  </div>
                  <h3 className="text-base text-brand-dark">{m.title}</h3>
                  <p className="mt-2 text-xs text-brand-dark/60">{m.body}</p>
                </BrandCard>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-brand-light p-7">
              <div className="font-serif-display text-3xl text-brand-dark">
                32
                <span className="text-sm font-sans font-normal text-brand-dark/60">
                  {" "}
                  hrs
                </span>
              </div>
              <div className="h-2.5 flex-1 min-w-[200px] overflow-hidden rounded-full bg-white">
                <div className="h-full w-[64%] rounded-full bg-brand-red" />
              </div>
              <div className="text-xs text-brand-dark/60">
                18 hours to your Community Favourite ribbon
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- CORPORATE NUDGE ---------- */}
      <Reveal>
        <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
          <BrandCard className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-2xl border-l-4 border-l-brand-red p-8 sm:p-8">
            <div>
              <h3 className="max-w-lg text-xl text-brand-dark">
                Know a company that could sponsor a class of 15?
              </h3>
              <p className="mt-2 max-w-md text-sm text-brand-dark/70">
                Volunteers are often the first link to a new corporate partner —
                a quick introduction goes a long way.
              </p>
            </div>
            <button
              onClick={generateCsrOnePager}
              className="rounded-full bg-brand-light px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-dark hover:text-white"
            >
              Generate one-pager to introduce them
            </button>
          </BrandCard>
        </section>
      </Reveal>

      {/* ---------- FAQ ---------- */}
      <Reveal>
        <section
          id="faq"
          className="relative scroll-mt-24 overflow-hidden bg-brand-light px-4 py-20 sm:px-6 lg:px-8"
        >
          <Blob className="right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 bg-[#FBE3E3] opacity-50" />
          <div className="relative mx-auto max-w-3xl">
            <Eyebrow>Before you sign up</Eyebrow>
            <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">
              Questions people actually ask
            </h2>
            <div className="mt-8 rounded-3xl bg-white px-6 sm:px-8">
              <VolunteerFaqAccordion />
            </div>
          </div>
        </section>
      </Reveal>

      {/*---------- AI VOLUNTEER MATCH ----------*/}
      <Reveal>
      <section id="match" className="relative scroll-mt-24 overflow-hidden bg-black px-4 py-24 sm:px-6 lg:px-8">
        <Blob className="-left-20 top-0 h-72 w-72 bg-brand-red/15" />
        <Blob className="-right-16 bottom-0 h-64 w-64 bg-brand-red/10" />
        <AiVolunteerMatch rosterItems={rosterItems} onSelectRole={registerForRole} />
      </section>
      </Reveal>

      {/* ---------- FINAL CTA ---------- */}
      <Reveal>
        <section className="relative overflow-hidden bg-brand-light px-4 py-16 text-center sm:px-6 lg:px-8">
          <Blob className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[#F8DCDA] opacity-50" />
          <div className="relative">
            <TriMark className="mx-auto h-2.5 w-9 text-brand-red" />
            <h2 className="mt-4 font-serif-display text-3xl text-brand-dark sm:text-4xl">
              Every shift starts with someone saying yes.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {/* <CtaButton href="#opportunities">Browse open roles</CtaButton> */}
              <CtaButton href="/donate" variant="outline">
                Prefer to give instead?
              </CtaButton>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}