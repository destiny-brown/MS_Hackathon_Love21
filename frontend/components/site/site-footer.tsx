"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { navKeyByHref } from "@/lib/i18n/nav";
import { footerNav, mainNav } from "@/lib/site-data";

export function SiteFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className="border-t border-brand-sand bg-brand-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-brand-coral">Love 21 Foundation</p>
          <p className="mt-3 text-sm text-brand-ink/70">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink/55">{t("footer.explore")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => {
              const key = navKeyByHref[item.href];
              return (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-ink/70 transition hover:text-brand-coral">
                    {key ? t(key) : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink/55">{t("footer.more")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((item) => {
              const key = navKeyByHref[item.href];
              return (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-ink/70 transition hover:text-brand-coral">
                    {key ? t(key) : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-brand-sand pt-6 text-sm text-brand-ink/70 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {t("footer.copyright")}
        </p>
        <p>{t("footer.charity")}</p>
      </div>
    </footer>
  );
}
