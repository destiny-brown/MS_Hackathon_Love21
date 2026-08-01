"use client";

import { Reveal } from "@/components/brand/Reveal";
import { FinancialRoots } from "@/components/impact/financial-roots";
import { ImpactPillars } from "@/components/impact/impact-pillars";
import { ImpactStories } from "@/components/impact/impact-stories";
import { MetricBanner } from "@/components/impact/metric-banner";
import { PageSectionNav, type PageSectionNavItem } from "@/components/site/page-section-nav";
import { SiteLayout } from "@/components/site/site-layout";

const sectionNavItems: PageSectionNavItem[] = [
  { id: "impact-growth", label: "Growth", labelKey: "sectionNav.growth" },
  { id: "impact-financials", label: "Financials", labelKey: "sectionNav.financials" },
  { id: "impact-pillars", label: "5 Pillars", labelKey: "sectionNav.pillars" },
  { id: "impact-stories", label: "Stories", labelKey: "sectionNav.stories" },
];

export default function ImpactDashboardPage() {
  return (
    <SiteLayout>
      {/* Tall-enough sentinel with cancelling negative margin so sticky nav
          only appears after a short scroll (when the site header is leaving),
          without adding empty space above The Growing Forest. */}
      <div
        id="impact-dashboard-hero"
        className="pointer-events-none relative -mb-14 h-14 w-full"
        aria-hidden="true"
      />

      <PageSectionNav items={sectionNavItems} ns="impact" heroSelector="#impact-dashboard-hero" />

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
    </SiteLayout>
  );
}
