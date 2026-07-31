import Image from "next/image";

import { DonationOpportunities } from "@/components/site/donation-opportunities";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;
  return (
    <SiteLayout>
      <PageHero
        title="Donate"
        subtitle="Choose one clear way to help. Your gift supports sports, nutrition, family programmes, and everyday care for Love 21 members."
        primaryAction={{ label: "Start donation", href: "#donation-form" }}
        secondaryAction={{ label: "See wishlist", href: "/shop" }}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="rounded-3xl border border-brand-sand bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Before you give</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-4 text-brand-ink/80">
                <h2 className="font-serif-display text-3xl text-brand-ink sm:text-4xl">Ability deserves opportunity</h2>
                <p>
                  Love 21 members bring talent, ambition, and determination. Your gift helps remove barriers in sport,
                  work, family life, and the wider community.
                </p>
                <p>
                  You do not need to log in to donate. For donations of HKD$100 or above, an official receipt can be
                  issued upon request. Contact Maggie at{" "}
                  <a href="mailto:Maggie@love21foundation.com" className="rounded-md text-brand-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    Maggie@love21foundation.com
                  </a>{" "}
                  for enquiries.
                </p>
              </div>
              <aside className="rounded-2xl bg-brand-cream p-5">
                <h2 className="font-serif-display text-2xl text-brand-ink">One gift or monthly support</h2>
                <p className="mt-3 text-sm leading-6 text-brand-ink/75">
                  Choose one-time or monthly giving in the demo checkout. No real payment is taken until a payment processor is connected.
                </p>
              </aside>
            </div>
          </div>

          <DonationOpportunities initialItemSlug={item} />

          <div className="border-t border-brand-sand pt-10 text-brand-ink/80">
            <h2 className="font-serif-display text-3xl text-brand-ink">Donate by other means</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-brand-sand bg-white p-6">
                <h3 className="font-serif-display text-2xl text-brand-ink">Donate with PayMe</h3>
                <p className="mt-2 text-sm">
                  Open PayMe and scan Love 21&rsquo;s official QR code to make a donation.
                </p>
                <Image
                  src="/images/love21-payme.png"
                  alt="Love 21 Foundation PayMe donation QR code"
                  width={332}
                  height={383}
                  className="mx-auto mt-5 h-auto w-full max-w-72"
                  unoptimized
                />
                <p className="mt-4 text-xs text-brand-ink/65">
                  PayMe donations are reflected in campaign progress after Love 21 staff reconcile them.
                </p>
              </article>

              <article className="space-y-4 rounded-2xl border border-brand-sand bg-white p-6">
                <h3 className="font-serif-display text-2xl text-brand-ink">Bank transfer, FPS, or cheque</h3>
                <p>
                  HSBC transfer: <strong>582-350526-838</strong>
                  <br />
                  FPS ID: <strong>164778151</strong>
                </p>
                <p>Cheques can be written out to &ldquo;Love 21 Foundation Limited&rdquo; and mailed to:</p>
                <address className="not-italic">
                  1102, 11/F, Artisan Lab
                  <br />
                  21 Luk Hop Street, San Po Kong,
                  <br />
                  Kowloon, HK.
                </address>
              </article>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
