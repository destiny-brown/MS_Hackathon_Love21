"use client";

import type { ReactNode } from "react";

import { SitePreferencesProvider } from "@/components/site/site-preferences";

export function AppProviders({ children }: { children: ReactNode }) {
  return <SitePreferencesProvider>{children}</SitePreferencesProvider>;
}
