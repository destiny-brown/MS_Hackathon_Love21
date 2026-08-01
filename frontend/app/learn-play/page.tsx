import Link from "next/link";

import { CommunityQuotesWall } from "@/components/learn/community-quotes-wall";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

// ---------------------------------------------------------------------------
// Signature mark — same three-dot motif used across the site (Love 21 exists
// because of trisomy 21, three copies of a chromosome). Kept local to this
// file so it doesn't depend on how other pages happen to export it.
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

// A soft blurred circle, used sparingly for a bit of depth behind flat sections.
function Blob({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

const resources = [
  {
    title: "21 Moves",
    description:
      "Bust today's myth, practise a real inclusion skill, and journey across Hong Kong with Captain 21.",
    href: "/learn-play/21-moves",
    badge: "Daily",
    theme: "coral" as const,
    icon: "🎯",
    action: "Explore",
  },
  {
    title: "Short Videos",
    description: "Neurodiversity education clips for families, volunteers, and community partners.",
    href: "/learn-play/short-videos",
    badge: "Video",
    theme: "sea" as const,
    icon: "▶️",
    action: "Watch",
  },
  {
    title: "Resources",
    description:
      "Love 21 archive and further reading — real stories and curated neurodiversity articles.",
    href: "/learn-play/resources",
    badge: "Stories",
    theme: "ink" as const,
    icon: "📖",
    action: "Read",
  },
];

// Pastel wash + accent color per card theme. Sea/ink pull from the site's
// existing tokens; the coral/red card uses the same explicit red as the
// homepage hero (#EF233C) rather than the brand-coral token, which reads
// as orange rather than red.
const THEME_STYLES = {
  coral: {
    headerBg: "bg-[#FBEAEA]",
    ring: "border-[#EF233C]/25",
    accentBar: "bg-gradient-to-r from-[#EF233C] to-black/80",
    badge: "bg-[#EF233C]/10 text-[#EF233C]",
    action: "text-[#EF233C]",
  },
  sea: {
    headerBg: "bg-[#EAF6F2]",
    ring: "border-brand-sea/25",
    accentBar: "bg-gradient-to-r from-brand-sea to-black/80",
    badge: "bg-brand-sea/10 text-brand-sea",
    action: "text-brand-sea",
  },
  ink: {
    headerBg: "bg-[#FFF5D8]",
    ring: "border-brand-ink/20",
    accentBar: "bg-gradient-to-r from-brand-ink to-black/70",
    badge: "bg-brand-ink/10 text-brand-ink",
    action: "text-brand-ink",
  },
} as const;

export default function LearnPlayPage() {
  return (
    <SiteLayout>
      {/* Hero — warm cream background, ink serif heading, coral italic accent */}
      <section className="relative overflow-hidden bg-brand-cream px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <Blob className="-right-16 -top-16 h-72 w-72 bg-[#FBEAEA] opacity-60" />
        <Blob className="-left-10 bottom-0 h-40 w-40 bg-[#EAF6F2] opacity-60" />
        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#EF233C]">
            <TriMark className="h-2 w-7" />
            Learn &amp; Play
          </p>
          <h1 className="mt-3 font-serif text-6xl font-medium tracking-tight text-brand-ink sm:text-7xl lg:text-8xl">
            Learn &amp; <em className="text-[#EF233C]">Play</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-ink/70">
            Educate through shared experiences — bust myths, hear from the community, and go deeper
            with real stories.
          </p>
          <div className="mt-8 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#EF233C] to-brand-ink" />
        </div>
      </section>

      {/* Community — single featured quote in a dark anchor card, matching the
          "dark card as a beat, pastel card as a rest" rhythm used elsewhere on
          the site rather than the previous near-black/navy palette. */}
      <section className="bg-brand-cream px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl bg-brand-ink px-8 py-12 shadow-2xl sm:px-14 sm:py-16">
            {/* Ambient glows, now coral + sea instead of red + navy */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#EF233C] opacity-[0.12] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-sea opacity-[0.15] blur-3xl" />

            <div className="relative z-10">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                <TriMark className="h-2 w-7 text-[#EF233C]/60" />
                From the Community
              </p>

              <blockquote className="mt-6 max-w-3xl font-serif text-3xl font-medium leading-snug text-white sm:text-4xl lg:text-[42px]">
                &ldquo;Those with Down&apos;s syndrome and autism are{" "}
                <em className="text-[#EF233C]">ready for purposeful employment</em>.&rdquo;
              </blockquote>

              <p className="mt-5 text-sm text-white/50">
                South China Morning Post · Love 21 Foundation
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-semibold">
                <Link href="#" className="text-[#EF233C] transition-colors hover:text-white">
                  Read the full story →
                </Link>
                <Link href="#" className="text-white/60 transition-colors hover:text-white">
                  Play today&apos;s 21 Moves
                </Link>
                <Link href="#" className="text-white/60 transition-colors hover:text-white">
                  Get involved →
                </Link>
              </div>

              {/* Carousel dots */}
              <div className="mt-10 flex gap-2">
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-6 rounded-full bg-[#EF233C]" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA bar */}
      <section className="bg-brand-cream px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="mx-auto max-w-xl text-base leading-relaxed text-brand-ink/70">
          Every myth we bust connects to a real Love 21 story — and a way to{" "}
          <Link
            href="/get-involved"
            className="font-semibold text-[#EF233C] underline decoration-[#EF233C] underline-offset-4 transition-colors hover:text-black hover:decoration-black"
          >
            get involved
          </Link>
          .
        </p>
      </section>

      {/* Resources — three cards, each with a soft pastel visual header instead
          of a saturated color block, so they sit in the same family as the
          rest of the site rather than reading as a separate, punchier design. */}
      <section className="bg-brand-cream px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#EF233C]">
              <TriMark className="h-2 w-7" />
              Explore more
            </p>
            <h2 className="mt-2 font-serif text-4xl font-medium text-brand-ink sm:text-5xl">
              Explore <em className="text-[#EF233C]">More</em>
            </h2>
            <p className="mt-2 text-brand-ink/60">
              Three ways to learn, play, and grow with the Love 21 community.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => {
              const theme = THEME_STYLES[r.theme];
              return (
                <article
                  key={r.title}
                  className="group overflow-hidden rounded-2xl border border-brand-sand bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_32px_64px_rgba(31,41,51,0.1)]"
                >
                  {/* Top accent bar */}
                  <div className={`h-[5px] w-full ${theme.accentBar}`} />

                  {/* Visual header — pastel wash, concentric rings, icon in a
                      floating white circle rather than a saturated gradient block */}
                  <div className={`relative flex h-44 items-center justify-center overflow-hidden ${theme.headerBg}`}>
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      }}
                    />
                    <div className={`pointer-events-none absolute h-32 w-32 rounded-full border-2 ${theme.ring}`} />
                    <div className={`pointer-events-none absolute h-20 w-20 rounded-full border-2 ${theme.ring}`} />
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      <span className="text-3xl">{r.icon}</span>
                    </div>
                  </div>

                  <div className="p-7">
                    <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${theme.badge}`}>
                      {r.badge}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl font-semibold text-brand-ink">{r.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{r.description}</p>
                    <Link
                      href={r.href}
                      className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5 ${theme.action}`}
                    >
                      {r.action} <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}