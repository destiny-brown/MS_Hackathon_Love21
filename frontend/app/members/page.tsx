"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { ContactForm } from "@/components/site/contact-form";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const { t } = useTranslation("pages");
  const memberSteps = t("members.steps", { returnObjects: true }) as string[];

  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="members.title" subtitleKey="members.subtitle" />
      <section id="member-enquiry" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1fr]">
          <aside className="rounded-3xl border border-brand-sand bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
              {t("members.whatHappensNext")}
            </p>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">{t("members.stepsTitle")}</h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-brand-ink/75">
              {memberSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-cream font-semibold text-brand-coral">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/get-involved#programmes">{t("members.seeProgrammes")}</Link>
            </Button>
          </aside>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
