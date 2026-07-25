"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function LanguageSwitcher({ locale, onChange }: { locale: Locale; onChange: (locale: Locale) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{t(locale, "language")}</span>
      <select
        value={locale}
        onChange={(event) => onChange(event.target.value as Locale)}
        className="rounded-md border border-input bg-background px-2 py-1 text-foreground"
        aria-label="Language"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
