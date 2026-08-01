"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { adminNavItems } from "@/lib/admin-nav";
import { api, AdminOverview } from "@/lib/api";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    api.adminOverview().then(setOverview).catch(() => setOverview(null));
  }, []);

  const workspaceItems = adminNavItems.filter((item) => !item.exact);

  return (
    <>
      <AdminPageHeader
        title="Staff console"
        description="Choose a workspace below to manage Love 21 content, campaigns, and community updates."
      />

      <section aria-label="At a glance" className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Events</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.event_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Volunteer programmes</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.volunteer_program_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Active subscribers</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.active_subscriber_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Newsletter list</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.subscriber_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Learn questions</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.learn_question_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Learn resources</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.learn_resource_count ?? "—"}</p>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Workspaces">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-ink/55">Workspaces</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {workspaceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-brand-sand bg-white p-5 shadow-sm transition hover:border-brand-coral/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-xl bg-brand-coral/10 p-3 text-brand-coral">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-brand-ink/30 transition group-hover:translate-x-0.5 group-hover:text-brand-coral"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-brand-ink">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-brand-ink/65">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
