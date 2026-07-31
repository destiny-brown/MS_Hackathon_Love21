"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { ContactForm } from "@/components/site/contact-form";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function ContactUsPage() {
  const { t } = useTranslation(["pages", "governance"]);

  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="contact.title" subtitleKey="contact.subtitle" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6 text-brand-ink/80">
            <p>
              {t("governance:pages.contact.membersPrefix", {
                defaultValue: "For member registration, please",
              })}{" "}
              <Link href="/members" className="text-brand-coral hover:underline">
                {t("governance:pages.contact.membersLink", {
                  defaultValue: "fill out the form here",
                })}
              </Link>
              . {t("governance:pages.contact.volunteerPrefix", {
                defaultValue: "For volunteering, please check out the",
              })}{" "}
              <Link href="/our-volunteer" className="text-brand-coral hover:underline">
                {t("governance:pages.contact.volunteerLink", {
                  defaultValue: "volunteer page",
                })}
              </Link>{" "}
              {t("governance:pages.contact.volunteerSuffix", {
                defaultValue: "for details and registration.",
              })}
            </p>
            <p>
              {t("governance:pages.contact.partnershipPrefix", {
                defaultValue: "For partnership, please contact Jeff (Founder/CEO):",
              })}{" "}
              <a href="mailto:jeff@love21foundation.com" className="text-brand-coral hover:underline">
                jeff@love21foundation.com
              </a>
            </p>
            <p>
              {t("governance:pages.contact.enquiriesPrefix", {
                defaultValue: "For other enquiries, please fill out the form or contact us at",
              })}{" "}
              <a href="mailto:info@love21foundation.com" className="text-brand-coral hover:underline">
                info@love21foundation.com
              </a>
            </p>
            <div className="space-y-4 pt-4">
              <div>
                <p className="font-semibold text-brand-ink">
                  {t("governance:pages.contact.spaceTitle", {
                    defaultValue: "Love 21 Space",
                  })}
                </p>
                <p>
                  {t("governance:pages.contact.spaceAddress", {
                    defaultValue: "2/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon",
                  })}
                </p>
              </div>
              <div>
                <p className="font-semibold text-brand-ink">
                  {t("governance:pages.contact.officeTitle", {
                    defaultValue: "Love 21 Office (for correspondences)",
                  })}
                </p>
                <p>
                  {t("governance:pages.contact.officeAddress", {
                    defaultValue: "1102, 11/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon",
                  })}
                </p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}
