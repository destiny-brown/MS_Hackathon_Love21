"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { LookerStudioEmbed } from "@/components/looker-studio-embed";
import { api, type AdminMetrics } from "@/lib/api";

const LOOKER_STUDIO_REPORT_URL =
  "https://datastudio.google.com/embed/reporting/7316b137-05d9-410b-b60b-77fda673c457/page/XCC5F";

const METRIC_LABELS: { key: keyof AdminMetrics; label: string }[] = [
  { key: "captain_chats_30d", label: "Captain21 chats (30d)" },
  { key: "volunteer_matches_30d", label: "Volunteer matches (30d)" },
  { key: "donate_cta_clicks_30d", label: "Donate CTA clicks (30d)" },
  { key: "locale_changes_30d", label: "Locale changes (30d)" },
  { key: "newsletter_subscribers", label: "Newsletter subscribers" },
  { key: "upcoming_events", label: "Upcoming events" },
  { key: "open_volunteer_roles", label: "Open volunteer roles" },
  { key: "active_members", label: "Active members" },
];

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminMetrics()
      .then(setMetrics)
      .catch((err) => {
        setMetricsError(err instanceof Error ? err.message : "Sign in as admin to view Postgres metrics.");
      });
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Looker Studio traffic plus Love 21 product events from Postgres
              </p>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm text-[#d4a373] hover:underline"
            >
              ← Back to Admin
            </Link>
          </div>

          <div className="space-y-6">
            <section className="rounded-lg border border-[#edebe7] bg-white/90 p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-[#1e2b2f]">Product analytics (Postgres)</h2>
              <p className="mb-4 text-sm text-[#4a4a4a]">
                Rollups from <code className="text-xs">analytics_events</code> and admin tables. Sign in at{" "}
                <Link href="/login" className="text-[#d4a373] hover:underline">
                  /login
                </Link>{" "}
                as <strong>admin@love21.demo</strong> to load live counts.
              </p>
              {metricsError && <p className="mb-4 text-sm text-amber-700">{metricsError}</p>}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {METRIC_LABELS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-xl border border-[#edebe7] bg-[#faf9f7] px-4 py-3"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-[#4a4a4a]/80">
                      {label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#1e2b2f]">
                      {metrics ? metrics[key].toLocaleString() : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <LookerStudioEmbed
              reportUrl={LOOKER_STUDIO_REPORT_URL}
              title="Website Traffic Overview (Looker Studio)"
              height="700px"
            />

            <div className="rounded-lg border border-[#edebe7] bg-white/90 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#1e2b2f]">About this data</h3>
              <p className="text-sm text-[#4a4a4a]">
                Looker Studio shows site traffic from Google Analytics. Postgres rollups capture
                on-site actions tracked via <code className="text-xs">POST /events</code> — donate
                CTAs, Captain21, volunteer matching, locale changes, and newsletter sign-ups.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
