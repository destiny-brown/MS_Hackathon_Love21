"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const sectionKeys = [
  { key: "board", href: "/board-of-directors" },
  { key: "staff", href: "/staff" },
  { key: "reports", href: "/our-finance" },
  { key: "contact", href: "/contact-us" },
] as const;

export default function AboutGovernancePage() {
  const { t } = useTranslation("governance");

  return (
    <SiteLayout>
      <TranslatedPageHero
        ns="pages"
        titleKey="about.title"
        subtitleKey="about.subtitle"
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
          {sectionKeys.map((section) => (
            <article key={section.key} className="rounded-2xl border border-brand-sand bg-white p-6">
              <h2 className="font-serif-display text-3xl text-brand-ink">
                {t(`pages.aboutGovernance.sections.${section.key}.title`, {
                  defaultValue:
                    section.key === "board"
                      ? "Board of Directors"
                      : section.key === "staff"
                        ? "Staff"
                        : section.key === "reports"
                          ? "Annual Reports"
                          : "Contact Us",
                })}
              </h2>
              <p className="mt-3 text-brand-ink/75">
                {t(`pages.aboutGovernance.sections.${section.key}.description`, {
                  defaultValue:
                    section.key === "board"
                      ? "Meet the leaders guiding Love 21's strategy, stewardship, and governance."
                      : section.key === "staff"
                        ? "Learn about the team delivering programmes and community support."
                        : section.key === "reports"
                          ? "Transparent reporting and financial stewardship updates."
                          : "Reach the team for partnerships, support, and community enquiries.",
                })}
              </p>
              <Link
                href={section.href}
                className="mt-5 inline-flex text-sm font-semibold text-brand-coral hover:underline"
              >
                {t("pages.aboutGovernance.openSection", { defaultValue: "Open Section" })}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
