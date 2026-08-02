"use client";

import { Reveal } from "@/components/brand/Reveal";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { useTranslation } from "react-i18next";

export default function JoinUsPage() {
  const { t } = useTranslation("governance");
  const roles = t("internship.roles", { returnObjects: true }) as string[];
  const requirements = t("internship.requirements", { returnObjects: true }) as string[];

  return (
    <SiteLayout>
      <Reveal>
        <TranslatedPageHero titleKey="joinUs.title" subtitleKey="joinUs.subtitle" />
      </Reveal>
      <Reveal>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-10">
            <p className="text-lg text-brand-dark/80">{t("internship.intro")}</p>

            <div>
              <h2 className="font-serif-display text-2xl text-brand-dark">{t("internship.rolesTitle")}</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-brand-dark/80">
                {roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif-display text-2xl text-brand-dark">{t("internship.requirementsTitle")}</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-brand-dark/80">
                {requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>

            <p className="text-brand-dark/80">
              {t("internship.contactBefore")}
              <a href="mailto:jeff@love21foundation.com" className="text-brand-red hover:underline">
                jeff@love21foundation.com
              </a>
              {t("internship.contactMiddle")}
              <a href="mailto:maggie@love21foundation.com" className="text-brand-red hover:underline">
                maggie@love21foundation.com
              </a>
              {t("internship.contactAfter")}
            </p>
            <p className="text-brand-dark/80">{t("internship.availability")}</p>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
