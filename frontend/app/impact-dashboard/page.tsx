"use client";

import { useEffect } from "react";

import { FinancialRoots } from "@/components/impact/financial-roots";
import { ImpactCtaBar } from "@/components/impact/impact-cta-bar";
import { ImpactPillars } from "@/components/impact/impact-pillars";
import { ImpactStories } from "@/components/impact/impact-stories";
import { MetricBanner } from "@/components/impact/metric-banner";
import { SiteLayout } from "@/components/site/site-layout";

export default function ImpactDashboardPage() {
  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7601/ingest/d47ed731-ca04-45bd-8a37-25df6741a4af", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "ce1b9c",
      },
      body: JSON.stringify({
        sessionId: "ce1b9c",
        runId: "post-fix",
        hypothesisId: "C",
        location: "impact-dashboard/page.tsx:mount",
        message: "Impact dashboard module mounted",
        data: { route: "/impact-dashboard", emptyImpactPageRemoved: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);
  // #endregion

  return (
    <SiteLayout>
      <MetricBanner />
      <FinancialRoots />
      <ImpactPillars />
      <ImpactStories />
      <div className="h-24 bg-brand-cream" aria-hidden="true" />
      <ImpactCtaBar />
    </SiteLayout>
  );
}
