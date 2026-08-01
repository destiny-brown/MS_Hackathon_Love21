"use client";

import { SitePreferencesProvider } from "@/components/site/site-preferences";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // #region agent log
  fetch("http://127.0.0.1:7601/ingest/d47ed731-ca04-45bd-8a37-25df6741a4af", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "09a52b",
    },
    body: JSON.stringify({
      sessionId: "09a52b",
      runId: "post-fix",
      hypothesisId: "F",
      location: "components/providers.tsx:AppProviders",
      message: "Root AppProviders wrapping SitePreferencesProvider",
      data: { hasChildren: Boolean(children) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return <SitePreferencesProvider>{children}</SitePreferencesProvider>;
}
