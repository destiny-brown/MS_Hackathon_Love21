import Link from "next/link";

import { CommunityQuotesWall } from "@/components/learn/community-quotes-wall";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

// ---------------------------------------------------------------------------
// Signature mark — same three-dot motif used across the site (Love 21 exists
// because of trisomy 21, three copies of a chromosome). Kept local to this
// file so it doesn't depend on how other pages happen to export it.
// ---------------------------------------------------------------------------

const RED = "#EF233C";

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
    number: "01",
    title: "21 Moves",
    description:
      "Bust today's myth, practise a real inclusion skill, and journey across Hong Kong with Captain 21.",
    href: "/learn-play/21-moves",
    badge: "Daily",
    accent: "red" as const,
  },
  {
    number: "02",
    title: "Short Videos",
    description: "Neurodiversity education clips for families, volunteers, and community partners.",
    href: "/learn-play/short-videos",
    badge: "Video",
    accent: "ink" as const,
  },
  {
    number: "03",
    title: "Resources",
    description:
      "Love 21 archive and further reading — real stories and curated neurodiversity articles.",
    href: "/learn-play/resources",
    badge: "Stories",
    accent: "red" as const,
  },
];

// Only two accent families from here on — red and ink/black — nothing blue.
const ACCENTS = {
  red: {
    corner: RED,
    number: `text-[${RED}]/20`,
    badge: `bg-[${RED}]/10 text-[${RED}]`,
    link: `text-[${RED}]`,
  },
  ink: {
    corner: "#101014",
    number: "text-brand-ink/15",
    badge: "bg-brand-ink/10 text-brand-ink",
    link: "text-brand-ink",
  },
} as const;

export default function LearnPlayPage() {
  return (
    <SiteLayout>
      {/* Hero — warm cream background, ink serif heading, single red accent.
          Eyebrow no longer repeats the page title itself. */}
      <section className="relative overflow-hidden bg-brand-cream px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <Blob className="-right-16 -top-16 h-72 w-72 bg-[#EF233C] opacity-[0.06]" />
        <Blob className="-left-10 bottom-0 h-40 w-40 bg-black opacity-[0.04]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#EF233C]">
            <TriMark className="h-2 w-7" />
            Celebrating Ability
          </p>
          <h1 className="mt-3 font-serif text-6xl font-medium tracking-tight text-brand-ink sm:text-7xl lg:text-8xl">
            Learn
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-ink/70">
            Learn through shared experiences, hear from the community, and explore real stories.
          </p>
          <div className="mt-8 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#EF233C] to-brand-ink" />
        </div>
      </section>

     {/* Community — single featured quote in a soft cream card, matching
          the warmth of the rest of the page instead of standing apart as a
          dark/navy anchor block. */}
      <section className="bg-brand-cream px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-brand-ink/10 bg-[#FBF6EE] px-8 py-12 shadow-[0_24px_60px_rgba(16,16,20,0.06)] sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#EF233C] opacity-[0.06] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-ink opacity-[0.03] blur-3xl" />

            <div className="relative z-10">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/40">
                <TriMark className="h-2 w-7 text-[#EF233C]/70" />
                From the Community
              </p>

              <blockquote className="mt-6 max-w-3xl font-serif text-3xl font-medium leading-snug text-brand-ink sm:text-4xl lg:text-[42px]">
                &ldquo;Those with Down&apos;s syndrome and autism are{" "}
                <em className="text-[#EF233C]">ready for purposeful employment</em>.&rdquo;
              </blockquote>

              <p className="mt-5 text-sm text-brand-ink/50">
                South China Morning Post · Love 21 Foundation
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-semibold">
                <Link href="#" className="text-[#EF233C] transition-colors hover:text-brand-ink">
                  Read the full story →
                </Link>
                <Link href="#" className="text-brand-ink/50 transition-colors hover:text-brand-ink">
                  Play today&apos;s 21 Moves
                </Link>
                <Link href="#" className="text-brand-ink/50 transition-colors hover:text-brand-ink">
                  Get involved →
                </Link>
              </div>

              {/* Carousel dots */}
              <div className="mt-10 flex gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-ink/15" />
                <span className="h-2 w-2 rounded-full bg-brand-ink/15" />
                <span className="h-2 w-6 rounded-full bg-[#EF233C]" />
                <span className="h-2 w-2 rounded-full bg-brand-ink/15" />
                <span className="h-2 w-2 rounded-full bg-brand-ink/15" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More — rebuilt as numbered "door" cards in the spirit of the
          "Where will you begin?" module: a folded corner, a large faint
          serial number, and a clean ENTER-style link. No icons, no pastel
          noise-texture headers, no blue. */}
      <section className="bg-brand-cream px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            {/* Faint connecting line — a quiet "journey" motif echoed across
                the site, not a full path illustration. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[52px] hidden border-t border-dashed border-brand-ink/15 sm:block"
            />

            <div className="grid gap-6 sm:grid-cols-3">
              {resources.map((r) => {
                const accent = ACCENTS[r.accent];
                return (
                  <article
                    key={r.title}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-ink/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_rgba(16,16,20,0.1)]"
                  >
                    {/* Folded corner */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 top-0 h-0 w-0"
                      style={{
                        borderStyle: "solid",
                        borderWidth: "0 34px 34px 0",
                        borderColor: `transparent ${accent.corner} transparent transparent`,
                        opacity: 0.9,
                      }}
                    />

                    <div className="flex items-start justify-between">
                      <span className={`font-serif text-5xl font-semibold leading-none ${accent.number}`}>
                        {r.number}
                      </span>
                      <span className={`mt-1 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${accent.badge}`}>
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-semibold text-brand-ink">{r.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink/70">{r.description}</p>

                    <Link
                      href={r.href}
                      className={`mt-6 inline-flex items-center gap-1.5 border-t border-brand-ink/10 pt-5 text-xs font-bold uppercase tracking-[0.18em] transition-all group-hover:gap-2.5 ${accent.link}`}
                    >
                      Enter <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}