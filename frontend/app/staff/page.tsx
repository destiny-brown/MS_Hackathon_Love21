import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function StaffPage() {
  return (
    <SiteLayout>
      <PageHero title="STAFF" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-brand-ink/80">
          <p>
            Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong.
          </p>
          <p>
            It is our goal to provide the greatest support for the Down syndrome and autistic community through sport
            and nutrition programmes. We also strive to be as financially responsible and transparent as possible.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
