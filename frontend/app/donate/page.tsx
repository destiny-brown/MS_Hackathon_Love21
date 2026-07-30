import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
  return (
    <SiteLayout>
      <PageHero title="DONATE" subtitle="Thank you so much for supporting Love 21!" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-4 text-brand-ink/80">
            <p>
              For donations of HKD$100 or above, an official receipt will be issued and mailed to you upon request.
              Please contact Maggie at{" "}
              <a href="mailto:Maggie@love21foundation.com" className="text-brand-coral hover:underline">
                Maggie@love21foundation.com
              </a>{" "}
              for enquiries.
            </p>
            <p>
              Your kind donation will help us provide even more opportunities for our Down syndrome and autistic
              community, allowing them to take ownership of their health through sports, nutrition and our vast range of
              holistic programmes.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-sand bg-white p-6">
            <h2 className="font-serif-display text-2xl text-brand-ink">Every dollar counts!</h2>
            <p className="mt-3 text-brand-ink/75">
              We now have a recurring donation option. Please consider a weekly or monthly donation through your credit
              card.
            </p>
            <Button className="mt-6">Donate Now</Button>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif-display text-2xl text-brand-ink">To donate by other means</h2>
            <p className="text-brand-ink/80">
              You can also donate by HSBC transfer to <strong>582-350526-838</strong> / FPS ID:{" "}
              <strong>164778151</strong>
            </p>
            <p className="text-brand-ink/80">
              Cheques can be written out to &ldquo;Love 21 Foundation Limited&rdquo; and mailed to us at:
            </p>
            <address className="not-italic text-brand-ink/80">
              1102, 11/F, Artisan Lab
              <br />
              21 Luk Hop Street, San Po Kong,
              <br />
              Kowloon, HK.
            </address>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
