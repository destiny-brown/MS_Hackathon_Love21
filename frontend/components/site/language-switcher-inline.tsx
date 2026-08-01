"use client";

import { useTranslation } from "react-i18next";

import { useSitePreferences } from "@/components/site/site-preferences";
import { siteLocales } from "@/lib/i18n/locales";

export function LanguageSwitcherInline() {
  const { locale, setLocale } = useSitePreferences();
  const { t } = useTranslation("common");

  return (
    <div
      className="inline-flex overflow-hidden rounded-full border border-brand-sand"
      role="group"
      aria-label={t("a11y.languageGroup")}
    >
      {siteLocales.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={locale === item.id}
          aria-label={item.label}
          title={item.label}
          onClick={() => setLocale(item.id)}
          className={`min-w-[2rem] px-2 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-inset ${
            locale === item.id
              ? "bg-brand-coral text-white"
              : "bg-white text-brand-ink/70 hover:bg-brand-sand/50"
          }`}
        >
          {item.nativeLabel}
        </button>
      ))}
    </div>
  );
}
