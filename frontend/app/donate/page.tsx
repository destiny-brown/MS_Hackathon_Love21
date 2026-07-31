import Image from "next/image";

import { DonationOpportunities } from "@/components/site/donation-opportunities";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function DonatePage() {
  return (
    <SiteLayout>
      <PageHero
        title="Back Their Potential"
        subtitle="Choose the campaign or cause that speaks to you and help create more opportunities for every ability to shine."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-4 text-brand-ink/80">
              <h2 className="font-serif-display text-4xl text-brand-ink">Ability deserves opportunity</h2>
              <p>
                Love 21 members bring talent, ambition, and determination. Your gift helps remove the barriers that
                prevent those strengths from being fully seen in sport, work, family life, and the wider community.
              </p>
              <p>
                For donations of HKD$100 or above, an official receipt will be issued and mailed to you upon request.
                Please contact Maggie at{" "}
                <a href="mailto:Maggie@love21foundation.com" className="text-brand-coral hover:underline">
                  Maggie@love21foundation.com
                </a>{" "}
                for enquiries.
              </p>
            </div>
            <aside className="rounded-2xl border border-brand-sand bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Give your way</p>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">One gift or lasting support</h2>
              <p className="mt-3 text-sm text-brand-ink/75">
                Choose one-time, weekly, monthly, quarterly, semiannual, or annual giving securely through MoonClerk.
              </p>
            </aside>
          </div>

          <DonationOpportunities />

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
