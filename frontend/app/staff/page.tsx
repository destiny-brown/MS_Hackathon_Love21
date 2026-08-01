import Image from "next/image";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function StaffPage() {
  return (
    <SiteLayout>
      <PageHero title="STAFF" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10 text-brand-dark/80">
          <div className="space-y-4">
            <p>
              Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong.
            </p>
            <p>
              It is our goal to provide the greatest support for the Down syndrome and autistic community through sport
              and nutrition programmes. We also strive to be as financially responsible and transparent as possible.
            </p>
          </div>

          <article className="rounded-2xl border border-brand-light bg-white p-6">
            <div className="overflow-hidden rounded-xl border border-brand-light bg-brand-light">
              <Image
                src="/images/love21-organisation-chart.jpg"
                alt="Love 21 Foundation organisation chart"
                width={1600}
                height={1000}
                className="h-auto w-full"
              />
            </div>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
