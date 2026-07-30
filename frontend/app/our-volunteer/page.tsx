import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";

export default function OurVolunteerPage() {
  return (
    <SiteLayout>
      <PageHero
        title="OUR VOLUNTEERS"
        subtitle="Love 21 Foundation is extremely grateful for our loving and dedicated team of volunteers!"
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-lg text-brand-ink/80">
            If you&apos;d like to commit to teaching your own weekly class for our beneficiaries or supporting an already
            existing class, please sign up or contact us at{" "}
            <a href="mailto:coms@love21foundation.com" className="text-brand-coral hover:underline">
              coms@love21foundation.com
            </a>
            .
          </p>

          <div className="rounded-2xl border border-brand-sand bg-white p-6">
            <h2 className="text-xl font-semibold text-brand-ink">Sign-up as Love 21 Volunteer</h2>
            <p className="mt-3 text-brand-ink/75">
              Love 21 Foundation is a registered charity in Hong Kong dedicated to empowering the Down syndrome,
              autistic, and neurodiverse communities through comprehensive sports, nutrition, and holistic support
              programmes. We&apos;re now looking for passionate and enthusiastic volunteers to join us!
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact-us">Register Interest</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-brand-sand bg-brand-cream p-6">
            <h2 className="text-xl font-semibold text-brand-ink">HandsOn Hong Kong Partnership</h2>
            <p className="mt-3 text-brand-ink/75">
              We are also currently partnered with HandsOn Hong Kong! To view our full volunteering schedule, please
              visit the HandsOn Hong Kong website and register for our volunteering activities through their dashboard.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
