"use client";

import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { Reveal } from "@/components/brand/Reveal";
import { ContactForm } from "@/components/site/contact-form";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export function ContactUsContent() {
  const { t } = useTranslation("pages");

  return (
    <SiteLayout>
      <Reveal>
        <TranslatedPageHero titleKey="contact.title" subtitleKey="contact.subtitle" />
      </Reveal>
      <Reveal>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6 text-brand-dark/80">
              <p>
                <Trans
                  i18nKey="contact.memberRegistration"
                  ns="pages"
                  components={{
                    membersLink: <Link href="/members" className="text-brand-red hover:underline" />,
                    volunteerLink: <Link href="/our-volunteer" className="text-brand-red hover:underline" />,
                  }}
                />
              </p>
              <p>
                <Trans
                  i18nKey="contact.partnership"
                  ns="pages"
                  components={{
                    email: <a href="mailto:jeff@love21foundation.com" className="text-brand-red hover:underline" />,
                  }}
                />
              </p>
              <p>
                <Trans
                  i18nKey="contact.otherEnquiries"
                  ns="pages"
                  components={{
                    email: <a href="mailto:info@love21foundation.com" className="text-brand-red hover:underline" />,
                  }}
                />
              </p>
              <div className="space-y-4 pt-4">
                <div>
                  <p className="font-semibold text-brand-dark">{t("contact.spaceTitle")}</p>
                  <p>{t("contact.spaceAddress")}</p>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">{t("contact.officeTitle")}</p>
                  <p>{t("contact.officeAddress")}</p>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
