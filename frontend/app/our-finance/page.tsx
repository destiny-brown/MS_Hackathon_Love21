import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { annualReports } from "@/lib/site-data";

export default function OurFinancePage() {
  return (
    <SiteLayout>
      <PageHero title="OUR REPORTS" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-brand-ink/80">
          <p>
            Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong.
          </p>
          <p>
            It is our goal to provide the greatest support for the Down syndrome and autistic community through sport
            and nutrition programmes. We also strive to be as financially responsible and transparent as possible.
          </p>
          <ul className="space-y-3 pt-4">
            {annualReports.map((report) => (
              <li key={report.year}>
                <a href={report.href} className="text-brand-coral hover:underline">
                  Please see our {report.year} Annual Report here
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
