"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "@/lib/i18n/config";
import { siteLocales, type SiteLocale } from "@/lib/i18n/locales";
import { track } from "@/lib/analytics/track";

export type FontScale = "normal" | "large" | "xl";

export type AccessibilitySettings = {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
};

type SitePreferencesContextValue = {
  locale: SiteLocale;
  setLocale: (locale: SiteLocale) => void;
  a11y: AccessibilitySettings;
  setFontScale: (scale: FontScale) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleUnderlineLinks: () => void;
  resetAccessibility: () => void;
  speechLang: string;
};

const LOCALE_KEY = "love21-locale";
const A11Y_KEY = "love21-a11y";

const defaultA11y: AccessibilitySettings = {
  fontScale: "normal",
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
};

const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(null);

function readStoredLocale(): SiteLocale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LOCALE_KEY);
  if (stored === "en" || stored === "yue" || stored === "zh") return stored;
  return "en";
}

function readStoredA11y(): AccessibilitySettings {
  if (typeof window === "undefined") return defaultA11y;
  try {
    const raw = window.localStorage.getItem(A11Y_KEY);
    if (!raw) return defaultA11y;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return {
      fontScale: parsed.fontScale === "large" || parsed.fontScale === "xl" ? parsed.fontScale : "normal",
      highContrast: Boolean(parsed.highContrast),
      reduceMotion: Boolean(parsed.reduceMotion),
      underlineLinks: Boolean(parsed.underlineLinks),
    };
  } catch {
    return defaultA11y;
  }
}

function applyDocumentPreferences(locale: SiteLocale, a11y: AccessibilitySettings) {
  const html = document.documentElement;
  const localeMeta = siteLocales.find((item) => item.id === locale) ?? siteLocales[0];

  html.lang = localeMeta.htmlLang;
  html.dataset.locale = locale;
  html.dataset.fontScale = a11y.fontScale;
  html.classList.toggle("a11y-high-contrast", a11y.highContrast);
  html.classList.toggle("a11y-reduce-motion", a11y.reduceMotion);
  html.classList.toggle("a11y-underline-links", a11y.underlineLinks);
}

function SitePreferencesInner({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>("en");
  const [a11y, setA11y] = useState<AccessibilitySettings>(defaultA11y);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const nextLocale = readStoredLocale();
    const nextA11y = readStoredA11y();
    setLocaleState(nextLocale);
    setA11y(nextA11y);
    void i18n.changeLanguage(nextLocale);
    applyDocumentPreferences(nextLocale, nextA11y);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(LOCALE_KEY, locale);
    void i18n.changeLanguage(locale);
    applyDocumentPreferences(locale, a11y);
  }, [locale, a11y, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(A11Y_KEY, JSON.stringify(a11y));
    applyDocumentPreferences(locale, a11y);
  }, [a11y, locale, ready]);

  const setLocale = useCallback((next: SiteLocale) => {
    setLocaleState((prev) => {
      if (ready && prev !== next) {
        track("locale_changed", { from: prev, to: next }, { locale: next });
      }
      return next;
    });
  }, [ready]);

  const setFontScale = useCallback((fontScale: FontScale) => {
    setA11y((prev) => ({ ...prev, fontScale }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setA11y((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setA11y((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  }, []);

  const toggleUnderlineLinks = useCallback(() => {
    setA11y((prev) => ({ ...prev, underlineLinks: !prev.underlineLinks }));
  }, []);

  const resetAccessibility = useCallback(() => {
    setA11y(defaultA11y);
  }, []);

  const speechLang = useMemo(() => {
    if (locale === "yue") return "zh-HK";
    if (locale === "zh") return "zh-CN";
    return "en-HK";
  }, [locale]);

  const value = useMemo<SitePreferencesContextValue>(
    () => ({
      locale,
      setLocale,
      a11y,
      setFontScale,
      toggleHighContrast,
      toggleReduceMotion,
      toggleUnderlineLinks,
      resetAccessibility,
      speechLang,
    }),
    [
      locale,
      setLocale,
      a11y,
      setFontScale,
      toggleHighContrast,
      toggleReduceMotion,
      toggleUnderlineLinks,
      resetAccessibility,
      speechLang,
    ],
  );

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SitePreferencesInner>{children}</SitePreferencesInner>
    </I18nextProvider>
  );
}

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);
  if (!context) {
    throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  }
  return context;
}
