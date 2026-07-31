"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation("forms");
  const inputClass = dark
    ? "h-11 rounded-md border border-brand-cream/30 bg-transparent px-3 text-brand-cream placeholder:text-brand-cream/45"
    : "h-11 rounded-md border border-brand-sand bg-white px-3 text-brand-ink placeholder:text-brand-ink/45";

  return (
    <form className="grid gap-3" aria-label={t("newsletter.formLabel")}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm" htmlFor="newsletter-first-name">
            {t("newsletter.firstName")}
          </label>
          <input id="newsletter-first-name" className={`mt-1 w-full ${inputClass}`} />
        </div>
        <div>
          <label className="text-sm" htmlFor="newsletter-last-name">
            {t("newsletter.lastName")}
          </label>
          <input id="newsletter-last-name" className={`mt-1 w-full ${inputClass}`} />
        </div>
      </div>
      <div>
        <label className="text-sm" htmlFor="newsletter-email">
          {t("newsletter.email")}
        </label>
        <input id="newsletter-email" type="email" required className={`mt-1 w-full ${inputClass}`} />
      </div>
      <div>
        <label className="text-sm" htmlFor="newsletter-phone">
          {t("newsletter.phone")}
        </label>
        <input id="newsletter-phone" type="tel" className={`mt-1 w-full ${inputClass}`} />
      </div>
      <Button type="submit" className="mt-2 w-fit">
        {t("newsletter.subscribe")}
      </Button>
    </form>
  );
}
