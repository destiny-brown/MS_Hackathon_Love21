import Image from "next/image";

import { BrandCard } from "@/components/brand/BrandCard";
import { CtaButton } from "@/components/brand/CtaButton";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Reveal } from "@/components/brand/Reveal";
import { DonationAmountProvider } from "@/components/site/donation-amount-context";
import { DonationOpportunities } from "@/components/site/donation-opportunities";
import { DonationTierGrid } from "@/components/site/donation-tier-grid";
import { DonateGratitudeWall } from "@/components/site/donate-gratitude-wall";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const { amount, item } = await searchParams;
  const suggestedAmount = Number(amount) || undefined;

  return (
    <SiteLayout>
      <PageHero
        title="Donate"
        subtitle="Choose one clear way to help. Your gift supports sports, nutrition, family programmes, and everyday care for Love 21 members."
        primaryAction={{ label: "Start donation", href: "#donation-form" }}
        secondaryAction={{ label: "See wishlist", href: "/wishlist" }}
      />
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
                <CtaButton href="/donate#donation-form">
                  Choose your tier
                </CtaButton>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ---------- WALL OF GRATITUDE ---------- */}
        <Reveal>
          <DonateGratitudeWall />
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

              <DonationOpportunities initialItemSlug={item} />

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
                      Open PayMe and scan Love 21&apos;s official QR code to
                      make a donation.
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
