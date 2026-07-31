"use client";

import { Reveal } from "@/components/brand/Reveal";
import { FinancialRoots } from "@/components/impact/financial-roots";
import { ImpactCtaBar } from "@/components/impact/impact-cta-bar";
import { ImpactPillars } from "@/components/impact/impact-pillars";
import { ImpactStories } from "@/components/impact/impact-stories";
import { MetricBanner } from "@/components/impact/metric-banner";
import { SiteLayout } from "@/components/site/site-layout";

export default function ImpactDashboardPage() {
  return (
    <SiteLayout>
      <Reveal>
        <MetricBanner />
      </Reveal>
      <Reveal delay={0.05}>
        <FinancialRoots />
      </Reveal>
      <Reveal delay={0.05}>
        <ImpactPillars />
      </Reveal>
      <Reveal delay={0.05}>
        <ImpactStories />
      </Reveal>
      <div className="h-24 bg-brand-light" aria-hidden="true" />
      <Reveal>
        <ImpactCtaBar />
      </Reveal>
    </SiteLayout>
  );
}
