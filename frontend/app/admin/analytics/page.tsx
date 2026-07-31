"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { LookerStudioEmbed } from "@/components/looker-studio-embed";

// Looker Studio Report URL
const LOOKER_STUDIO_REPORT_URL =
  "https://datastudio.google.com/embed/reporting/7316b137-05d9-410b-b60b-77fda673c457/page/XCC5F";

export default function AdminAnalyticsPage() {
  const router = useRouter();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Website traffic, engagement, and impact metrics
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-[#d4a373] hover:underline flex items-center gap-1"
            >
              ← Back to Admin
            </Link>
          </div>

          <div className="space-y-6">
            <LookerStudioEmbed
              reportUrl={LOOKER_STUDIO_REPORT_URL}
              title="Website Traffic Overview"
              height="700px"
            />

            <div className="rounded-lg border border-[#edebe7] bg-white/90 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#1e2b2f]">
                <i className="fas fa-info-circle mr-2 text-[#d4a373]"></i>
                About This Data
              </h3>
              <p className="text-sm text-[#4a4a4a]">
                This analytics dashboard shows Love 21 Foundation website
                traffic, including visitor demographics, page views, and
                engagement metrics. Data is updated automatically from Google
                Analytics via Looker Studio.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
