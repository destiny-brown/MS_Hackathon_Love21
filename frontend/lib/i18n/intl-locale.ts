import type { SiteLocale } from "@/lib/i18n/locales";

/** Map site locale to BCP 47 tag for Intl formatters. */
export function intlLocaleForSite(locale: SiteLocale | string): string {
  switch (locale) {
    case "yue":
      return "zh-HK";
    case "zh":
      return "zh-CN";
    default:
      return "en-HK";
  }
}
