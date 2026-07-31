"use client";

import { SitePreferencesProvider } from "@/components/site/site-preferences";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SitePreferencesProvider>{children}</SitePreferencesProvider>;
}
