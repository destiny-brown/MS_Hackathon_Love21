"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LookerStudioEmbed } from "@/components/looker-studio-embed";

const LOOKER_STUDIO_REPORT_URL =
  "https://datastudio.google.com/embed/reporting/7316b137-05d9-410b-b60b-77fda673c457/page/XCC5F";

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="Website traffic, engagement, and impact metrics from Google Analytics via Looker Studio."
      />

      <div className="space-y-6">
        <LookerStudioEmbed
          reportUrl={LOOKER_STUDIO_REPORT_URL}
          title="Website Traffic Overview"
          height="700px"
        />

        <div className="rounded-2xl border border-brand-sand bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-ink">About this data</h2>
          <p className="mt-3 text-sm leading-6 text-brand-ink/70">
            This dashboard shows Love 21 Foundation website traffic, including visitor demographics, page views,
            and engagement metrics. Data is updated automatically from Google Analytics via Looker Studio.
          </p>
        </div>
      </div>
    </>
  );
}
