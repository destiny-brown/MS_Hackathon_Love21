"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { LookerStudioEmbed } from "@/components/looker-studio-embed";
import { SiteHeader } from "@/components/site/site-header";

const LOOKER_STUDIO_REPORT_URL =
  "https://datastudio.google.com/embed/reporting/7316b137-05d9-410b-b60b-77fda673c457/page/XCC5F";

export default function TrafficPage() {
  const { t } = useTranslation("pages");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#1e2b2f]">{t("traffic.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("traffic.subtitle")}</p>
          </div>

          <div className="space-y-6">
            <LookerStudioEmbed
              reportUrl={LOOKER_STUDIO_REPORT_URL}
              title="Website Traffic Overview"
              height="700px"
            />

            <div className="rounded-lg border border-[#edebe7] bg-white/90 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#1e2b2f]">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-[#d4a373]" />
                {t("traffic.aboutTitle")}
              </h3>
              <p className="text-sm text-[#4a4a4a]">{t("traffic.aboutBody")}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
