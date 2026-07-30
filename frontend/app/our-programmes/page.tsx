import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { programmes } from "@/lib/site-data";

export default function OurProgrammesPage() {
  return (
    <SiteLayout>
      <PageHero title="Our Programmes" subtitle="Programmes are now part of Get Involved to keep action paths in one place." />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <article className="rounded-2xl border border-brand-sand bg-white p-6">
            <p className="text-brand-ink/80">
              You are on a legacy programmes URL. For the newest experience, explore programmes under Get Involved where
              each programme links directly to family registration, volunteer signup, CSR, donations, and wishlist support.
            </p>
            <Link href="/get-involved" className="mt-4 inline-flex text-sm font-semibold text-brand-coral hover:underline">
              Go to Get Involved
            </Link>
          </article>

          {programmes.map((programme) => (
            <article key={programme.title} className="border-b border-brand-sand pb-12 last:border-0">
              <h2 className="font-serif-display text-3xl text-brand-ink">{programme.title}</h2>
              <p className="mt-4 max-w-3xl text-brand-ink/80">{programme.description}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
