"use client";

import { FinancialRoots } from "@/components/impact/financial-roots";
import { ImpactCtaBar } from "@/components/impact/impact-cta-bar";
import { ImpactPillars } from "@/components/impact/impact-pillars";
import { ImpactStories } from "@/components/impact/impact-stories";
import { MetricBanner } from "@/components/impact/metric-banner";
import { SiteLayout } from "@/components/site/site-layout";

export default function ImpactDashboardPage() {
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
