/** Allowed in-app navigation targets for Captain21 agent tools (mirrors backend allowlist). */
export const SITE_NAV_PATHS = [
  "/our-story",
  "/our-programmes",
  "/get-involved",
  "/our-volunteer",
  "/learn-play",
  "/learn-play/quiz",
  "/learn-play/21-moves",
  "/learn-play/short-videos",
  "/learn-play/resources",
  "/donate",
  "/wishlist",
  "/stories-media",
  "/impact-dashboard",
  "/events-campaigns",
  "/contact-us",
  "/members",
  "/join-us",
  "/about-governance",
] as const;

export type SiteNavPath = (typeof SITE_NAV_PATHS)[number];

export const SITE_LOCALES = ["en", "yue", "zh"] as const;

export type SiteToolLocale = (typeof SITE_LOCALES)[number];
