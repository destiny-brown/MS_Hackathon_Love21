export type SiteLocale = "en" | "yue" | "zh";

export const siteLocales: {
  id: SiteLocale;
  label: string;
  nativeLabel: string;
  htmlLang: string;
}[] = [
  { id: "en", label: "English", nativeLabel: "EN", htmlLang: "en" },
  { id: "yue", label: "Cantonese", nativeLabel: "粵", htmlLang: "zh-HK" },
  { id: "zh", label: "Mandarin", nativeLabel: "普", htmlLang: "zh-CN" },
];

export const i18nNamespaces = [
  "common",
  "home",
  "pages",
  "forms",
  "auth",
  "governance",
  "donate",
  "media",
  "impact",
  "learn",
  "volunteer",
  "getInvolved",
  "dashboard",
  "admin",
] as const;

export type I18nNamespace = (typeof i18nNamespaces)[number];
