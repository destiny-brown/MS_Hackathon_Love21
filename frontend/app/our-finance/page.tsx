"use client";

import { useTranslation } from "react-i18next";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { annualReports } from "@/lib/site-data";

export default function OurFinancePage() {
  const { t } = useTranslation("governance");

  return (
    <SiteLayout>
      <PageHero
        title={t("pages.finance.title", { defaultValue: "OUR REPORTS" })}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-brand-ink/80">
          <p>
            {t("pages.finance.p1", {
              defaultValue:
                "Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong.",
            })}
          </p>
          <p>
            {t("pages.finance.p2", {
              defaultValue:
                "It is our goal to provide the greatest support for the Down syndrome and autistic community through sport and nutrition programmes. We also strive to be as financially responsible and transparent as possible.",
            })}
          </p>
          <ul className="space-y-3 pt-4">
            {annualReports.map((report) => (
              <li key={report.year}>
                <a href={report.href} className="text-brand-coral hover:underline">
                  {t("pages.finance.reportLink", {
                    year: report.year,
                    defaultValue: `Please see our ${report.year} Annual Report here`,
                  })}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
