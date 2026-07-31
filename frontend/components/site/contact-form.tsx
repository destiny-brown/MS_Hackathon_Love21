"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export function ContactForm() {
  const { t } = useTranslation("forms");

  return (
    <form className="grid gap-4 rounded-2xl border border-brand-sand bg-white p-6" aria-label={t("contact.formLabel")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm" htmlFor="contact-first-name">
            {t("contact.firstName")}
          </label>
          <input id="contact-first-name" className="mt-1 h-11 w-full rounded-md border border-brand-sand bg-white px-3" />
        </div>
        <div>
          <label className="text-sm" htmlFor="contact-last-name">
            {t("contact.lastName")}
          </label>
          <input id="contact-last-name" className="mt-1 h-11 w-full rounded-md border border-brand-sand bg-white px-3" />
        </div>
      </div>
      <div>
        <label className="text-sm" htmlFor="contact-email">
          {t("contact.email")}
        </label>
        <input id="contact-email" type="email" className="mt-1 h-11 w-full rounded-md border border-brand-sand bg-white px-3" />
      </div>
      <div>
        <label className="text-sm" htmlFor="contact-phone">
          {t("contact.phone")}
        </label>
        <input id="contact-phone" type="tel" className="mt-1 h-11 w-full rounded-md border border-brand-sand bg-white px-3" />
      </div>
      <div>
        <label className="text-sm" htmlFor="contact-message">
          {t("contact.message")}
        </label>
        <textarea id="contact-message" rows={5} className="mt-1 w-full rounded-md border border-brand-sand bg-white px-3 py-2" />
      </div>
      <Button type="submit" className="w-fit">
        {t("contact.send")}
      </Button>
    </form>
  );
}
