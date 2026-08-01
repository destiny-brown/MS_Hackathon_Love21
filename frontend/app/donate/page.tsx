import Image from "next/image";

import { BrandCard } from "@/components/brand/BrandCard";
import { CtaButton } from "@/components/brand/CtaButton";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Reveal } from "@/components/brand/Reveal";
import { DONATION_TIERS } from "@/lib/donation-tiers";
import { DonationAmountProvider } from "@/components/site/donation-amount-context";
import { DonationOpportunities } from "@/components/site/donation-opportunities";
import { getWishlistItem } from "@/lib/wishlist-items";
import { DonationTierGrid } from "@/components/site/donation-tier-grid";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

// ---------------------------------------------------------------------------
// Wall of Gratitude
// ---------------------------------------------------------------------------

type GratitudeMessage = {
  quote: string;
  name: string;
  detail: string;
  photo?: string;
  featured?: boolean;
};

const gratitudeMessages: GratitudeMessage[] = [
  {
    quote: "Thank you for the new football boots — I scored my first goal in them!",
    name: "Marcus",
    detail: "19 · Sports programme",
  },
  {
    quote: "My mum smiled through my whole graduation speech. Because of you, I had one.",
    name: "Priya",
    detail: "24 · Vocational training",
    photo: "/images/donate/gratitude-3.png",
    featured: true,
  },
  {
    quote: "I made three friends this year. We text every day now.",
    name: "Leo",
    detail: "16 · Community programme",
  },
  {
    quote: "Learning to cook made me feel like an adult for the first time.",
    name: "Hana",
    detail: "21 · Nutrition programme",
    photo: "/images/donate/gratitude-2.png",
  },
  {
    quote: "You helped me get a job interview. I got the job.",
    name: "Kelvin",
    detail: "23 · Vocational training",
    photo: "/images/donate/gratitude-1.png",
  },
  {
    quote: "My son laughed with his whole body at swim class today. I hadn't heard that sound in months.",
    name: "Mrs. Chan",
    detail: "Parent",
    featured: true,
  },
  {
    quote: 'The dragon boat team calls me "Captain" now. I never thought that would be me.',
    name: "Wing",
    detail: "27 · Sports programme",
  },
  {
    quote: "For the first time, people ask me for advice, not the other way round.",
    name: "Sabrina",
    detail: "25 · Mentorship programme",
  },
];

const rowOne = gratitudeMessages.slice(0, 4);
const rowTwo = gratitudeMessages.slice(4);

const cardRotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function GratitudeCard({
  message,
  rotate,
}: {
  message: GratitudeMessage;
  rotate: string;
}) {
  return (
    <div
      className={`group relative mx-3 shrink-0 rounded-3xl bg-white p-7 shadow-[0_2px_16px_rgba(26,26,26,0.04),0_0_0_1px_rgba(26,26,26,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_20px_40px_rgba(26,26,26,0.08),0_0_0_1px_rgba(232,84,62,0.08)] ${rotate} ${message.featured ? "w-[380px]" : "w-[320px]"} ${message.photo ? "pb-7 pt-5" : ""}`}
    >
      {/* Washi tape */}
      <div className="pointer-events-none absolute -top-2.5 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-2 rounded-sm bg-brand-red/10 opacity-70" />
      {/* Push pin */}
      <div className="pointer-events-none absolute right-5 top-3.5">
        <div className="relative h-2.5 w-2.5 rounded-full bg-brand-red shadow-sm">
          <div className="absolute -top-1 left-1/2 h-1.5 w-px -translate-x-1/2 bg-black/10" />
        </div>
      </div>

      {/* Large quote mark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-3 font-serif-display text-6xl leading-none text-brand-red/10"
      >
        &ldquo;
      </span>

      {/* Photo */}
      {message.photo && (
        <div className="relative mb-5 overflow-hidden rounded-2xl bg-brand-light shadow-inner">
          <Image
            src={message.photo}
            alt=""
            width={400}
            height={300}
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(26,26,26,0.06)]" />
        </div>
      )}

      {/* Quote */}
      <p
        className={`relative z-10 font-serif-display leading-snug text-brand-dark ${message.featured ? "text-xl" : "text-[17px]"}`}
      >
        {message.quote}
      </p>

      {/* Author */}
      <div className="relative z-10 mt-5 border-t border-brand-dark/5 pt-4">
        <p className="text-xs font-bold tracking-wide text-brand-red/90">
          {message.name}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-brand-dark/40">
          {message.detail}
        </p>
      </div>
    </div>
  );
}

function GratitudeMarqueeRow({
  items,
  direction,
}: {
  items: GratitudeMessage[];
  direction: "left" | "right";
}) {
  const track = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div
        className={`flex w-max ${direction === "left" ? "animate-[wog-scroll_50s_linear_infinite]" : "animate-[wog-scroll_50s_linear_infinite_reverse]"}`}
      >
        {track.map((msg, i) => (
          <GratitudeCard
            key={`${msg.name}-${i}`}
            message={msg}
            rotate={cardRotations[i % cardRotations.length]}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const { amount, item } = await searchParams;
  const wishlistItem = getWishlistItem(item);
  const suggestedAmount = Number(amount) || wishlistItem?.unitCost;
  return (
    <SiteLayout>
      <PageHero
        title="Donate"
        subtitle="Choose one clear way to help. Your gift supports sports, nutrition, family programmes, and everyday care for Love 21 members."
        primaryAction={{ label: "Start donation", href: "#donation-form" }}
        secondaryAction={{ label: "See wishlist", href: "/wishlist" }}
      />

      <Reveal>
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-6xl">
            <Eyebrow>Donor transparency</Eyebrow>
            <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">Where your gift goes</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DONATION_TIERS.map((tier, i) => (
                <Reveal key={tier.amount} delay={i * 0.08}>
                  <BrandCard
                    className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6 ${i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"}`}
                  >
                    <div className="font-serif-display text-2xl text-brand-red">{tier.label}</div>
                    <p className="mt-3 text-sm text-brand-dark/70">{tier.impact}</p>
                  </BrandCard>
                </Reveal>
              ))}
            </div>
            <div className="mt-8">
              <CtaButton href="#donation-form">Choose your tier</CtaButton>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Tier cards and the mock donation form share one DonationAmountProvider
          so clicking a tier above always drives the form below — single
          source of truth, no amount hardcoded in more than one place. */}
      <DonationAmountProvider defaultAmount={suggestedAmount}>
        {/* ---------- WHERE YOUR GIFT GOES ---------- */}
        <Reveal>
          <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
            <div className="relative mx-auto max-w-6xl">
              <Eyebrow>Donor transparency</Eyebrow>
              <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">
                Where your gift goes
              </h2>
              <DonationTierGrid />
              <div className="mt-8">
                <CtaButton href="/donate#donation-form">Choose your tier</CtaButton>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ---------- WALL OF GRATITUDE ---------- */}
        <Reveal>
          <section className="relative overflow-hidden border-y border-brand-light bg-brand-light/30">
            <style>{`
              @keyframes wog-scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              @keyframes wog-float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-12px) rotate(5deg); }
              }
              .wog-row:hover .animate-[wog-scroll_50s_linear_infinite],
              .wog-row:hover .animate-[wog-scroll_50s_linear_infinite_reverse] {
                animation-play-state: paused;
              }
              @media (prefers-reduced-motion: reduce) {
                .animate-[wog-scroll_50s_linear_infinite],
                .animate-[wog-scroll_50s_linear_infinite_reverse] {
                  animation: none;
                }
              }
            `}</style>

            {/* Background grain */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Giant faded quote mark */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif-display text-[400px] leading-none text-brand-red/[0.03] sm:text-[500px]"
            >
              &ldquo;
            </span>

            {/* Glow orbs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-red/[0.04] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-brand-light blur-3xl" />

            {/* Floating hearts */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[8%] top-[15%] animate-[wog-float_8s_ease-in-out_infinite] text-lg text-brand-red/[0.06]"
            >
              ♥
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[10%] top-[60%] animate-[wog-float_8s_ease-in-out_2s_infinite] text-sm text-brand-red/[0.05]"
            >
              ♥
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[5%] top-[30%] animate-[wog-float_8s_ease-in-out_4s_infinite] text-xl text-brand-red/[0.05]"
            >
              ♥
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[20%] left-[12%] animate-[wog-float_8s_ease-in-out_1s_infinite] text-base text-brand-red/[0.06]"
            >
              ♥
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[3%] top-[70%] animate-[wog-float_8s_ease-in-out_3s_infinite] text-xs text-brand-red/[0.05]"
            >
              ♥
            </span>

            {/* Header */}
            <div className="relative z-10 px-4 pt-20 text-center sm:px-6 lg:px-8">
              <div className="relative mx-auto max-w-3xl">
                <div className="mx-auto mb-6 h-0.5 w-16 bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
                <Eyebrow className="justify-center">Wall of Gratitude</Eyebrow>
                <h2 className="mt-3 font-serif-display text-4xl leading-[1.1] text-brand-dark sm:text-5xl">
                  Every gift becomes
                  <br />
                  someone&apos;s <em className="text-brand-red">good day</em>.
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-dark/60">
                  These are real moments from the Love 21 community — made possible by donors who chose to show up. Your gift doesn&apos;t just fund programmes. It funds{" "}
                  <em className="text-brand-dark/80">firsts</em>.
                </p>
              </div>
            </div>

            {/* Marquee rows */}
            <div className="relative z-10 mt-14 space-y-5">
              <div className="wog-row">
                <GratitudeMarqueeRow items={rowOne} direction="left" />
              </div>
              <div className="wog-row">
                <GratitudeMarqueeRow items={rowTwo} direction="right" />
              </div>
            </div>

            {/* CTA band */}
            <div className="relative z-10 mx-auto mt-14 max-w-3xl px-4 pb-6 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-brand-red/10 bg-white/80 px-8 py-7 shadow-sm backdrop-blur-sm">
                <p className="max-w-md text-sm leading-relaxed text-brand-dark/60">
                  <strong className="text-brand-dark">
                    Your name could be the reason someone&apos;s story changes.
                  </strong>{" "}
                  Every message on this wall started with a single decision to
                  give.
                </p>
                <CtaButton href="/donate#donation-form">Become a donor</CtaButton>
              </div>
            </div>

            {/* Footer note */}
            <p className="relative z-10 px-4 pb-16 pt-8 text-center text-xs text-brand-dark/30">
              <span className="mb-2 block text-brand-red/30">♥</span>
              Messages and photos shared with permission from members and
              families.
              <br />
              Names shortened for privacy.
            </p>
          </section>
        </Reveal>

        {/* ---------- DONATION FORM & INFO ---------- */}
        <Reveal>
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-12">
              <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="space-y-4 text-brand-dark/80">
                  <h2 className="font-serif-display text-4xl text-brand-dark">
                    Ability deserves opportunity
                  </h2>
                  <p>
                    Love 21 members bring talent, ambition, and determination.
                    Your gift helps remove the barriers that prevent those
                    strengths from being fully seen in sport, work, family life,
                    and the wider community.
                  </p>
                  <p>
                    For donations of HKD$100 or above, an official receipt will
                    be issued and mailed to you upon request. Please contact
                    Maggie at{" "}
                    <a
                      href="mailto:Maggie@love21foundation.com"
                      className="text-brand-red hover:underline"
                    >
                      Maggie@love21foundation.com
                    </a>{" "}
                    for enquiries.
                  </p>
                </div>
                <BrandCard as="aside" className="rounded-2xl p-6 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
                    Give your way
                  </p>
                  <h2 className="mt-2 font-serif-display text-3xl text-brand-dark">
                    One gift or lasting support
                  </h2>
                  <p className="mt-3 text-sm text-brand-dark/75">
                    Choose one-time or monthly giving in the mock checkout. No
                    real payment is taken until a processor is connected.
                  </p>
                </BrandCard>
              </div>

              <DonationOpportunities initialWishlistItemId={wishlistItem?.id ?? item ?? null} />

              <div className="border-t border-brand-light pt-10 text-brand-dark/80">
                <h2 className="font-serif-display text-3xl text-brand-dark">
                  Donate by other means
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <BrandCard as="article" className="rounded-2xl p-6 sm:p-6">
                    <h3 className="font-serif-display text-2xl text-brand-dark">
                      Donate with PayMe
                    </h3>
                    <p className="mt-2 text-sm">
                      Open PayMe and scan Love 21&apos;s official QR code to make
                      a donation.
                    </p>
                    <Image
                      src="/images/love21-payme.png"
                      alt="Love 21 Foundation PayMe donation QR code"
                      width={332}
                      height={383}
                      className="mx-auto mt-5 h-auto w-full max-w-72"
                      unoptimized
                    />
                    <p className="mt-4 text-xs text-brand-dark/65">
                      PayMe donations are reflected in campaign progress after
                      Love 21 staff reconcile them.
                    </p>
                  </BrandCard>

                  <BrandCard
                    as="article"
                    className="space-y-4 rounded-2xl p-6 sm:p-6"
                  >
                    <h3 className="font-serif-display text-2xl text-brand-dark">
                      Bank transfer, FPS, or cheque
                    </h3>
                    <p>
                      HSBC transfer: <strong>582-350526-838</strong>
                      <br />
                      FPS ID: <strong>164778151</strong>
                    </p>
                    <p>
                      Cheques can be written out to &ldquo;Love 21 Foundation
                      Limited&rdquo; and mailed to:
                    </p>
                    <address className="not-italic">
                      1102, 11/F, Artisan Lab
                      <br />
                      21 Luk Hop Street, San Po Kong,
                      <br />
                      Kowloon, HK.
                    </address>
                  </BrandCard>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </DonationAmountProvider>
    </SiteLayout>
  );
}