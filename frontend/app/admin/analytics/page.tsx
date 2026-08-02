"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LookerStudioEmbed } from "@/components/looker-studio-embed";

const LOOKER_STUDIO_REPORT_URL =
  "https://datastudio.google.com/embed/reporting/7316b137-05d9-410b-b60b-77fda673c457/page/XCC5F";

export default function AdminAnalyticsPage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("analytics.title")}
        description={t("analytics.description")}
      />

      <div className="space-y-6">
        <LookerStudioEmbed
          reportUrl={LOOKER_STUDIO_REPORT_URL}
          title={t("analytics.trafficTitle")}
          height="700px"
        />

        <div className="rounded-2xl border border-brand-sand bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-ink">{t("analytics.aboutTitle")}</h2>
          <p className="mt-3 text-sm leading-6 text-brand-ink/70">
            {t("analytics.aboutBody")}
          </p>
        </div>
      </div>
    </>
  );
}
