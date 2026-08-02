"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminNavItems } from "@/lib/admin-nav";
import { api, AdminOverview, AdminVolunteerActivityRegistration } from "@/lib/api";

export default function AdminDashboardPage() {
  const { t } = useTranslation("admin");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [registrations, setRegistrations] = useState<AdminVolunteerActivityRegistration[]>([]);

  async function loadDashboard() {
    const [overviewData, registrationData] = await Promise.all([
      api.adminOverview(),
      api.listAdminVolunteerActivityRegistrations(),
    ]);
    setOverview(overviewData);
    setRegistrations(registrationData);
  }

  useEffect(() => {
    loadDashboard().catch(() => {
      setOverview(null);
      setRegistrations([]);
    });
  }, []);

  const workspaceItems = adminNavItems.filter((item) => !item.exact);

  return (
    <>
      <AdminPageHeader
        title={t("home.title")}
        description={t("home.description")}
      />

      <section aria-label={t("home.atAGlance")} className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">{t("home.events")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.event_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">{t("home.volunteerProgrammes")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.volunteer_program_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">{t("home.activeSubscribers")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.active_subscriber_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">{t("home.newsletterList")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.subscriber_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">{t("home.learnQuestions")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.learn_question_count ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/40">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">{t("home.learnResources")}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{overview?.learn_resource_count ?? "—"}</p>
          </CardContent>
        </Card>
      </section>

      <section aria-label={t("home.registrationsTitle")} className="mb-8">
        <Card className="border-brand-sand bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-ink/55">{t("home.registrationsTitle")}</h2>
                <p className="mt-2 text-sm text-brand-ink/65">{t("home.registrationsDescription")}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => loadDashboard().catch(() => undefined)}>{t("home.refresh")}</Button>
                <Button asChild type="button" variant="outline">
                  <Link href="/admin/volunteers">{t("home.viewAll")}</Link>
                </Button>
              </div>
            </div>
            {registrations.length === 0 ? (
              <p className="mt-5 rounded-lg border border-dashed border-brand-sand p-5 text-sm text-brand-ink/60">{t("home.noRegistrations")}</p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-wide text-brand-ink/45">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t("home.who")}</th>
                      <th className="px-3 py-2 font-medium">{t("home.activity")}</th>
                      <th className="px-3 py-2 font-medium">{t("home.when")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.slice(0, 5).map((registration) => (
                      <tr key={registration.id} className="border-b last:border-0">
                        <td className="px-3 py-3">
                          <div className="font-medium text-brand-ink">{registration.user_email}</div>
                          <div className="text-xs capitalize text-brand-ink/50">{registration.user_role}</div>
                        </td>
                        <td className="px-3 py-3 text-brand-ink/75">{registration.activity_name}</td>
                        <td className="px-3 py-3 text-brand-ink/60">{new Date(registration.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-label={t("home.workspaces")}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-ink/55">{t("home.workspaces")}</h2>
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
                <h3 className="mt-4 text-lg font-semibold text-brand-ink">{t(item.labelKey)}</h3>
                <p className="mt-1 text-sm leading-6 text-brand-ink/65">{t(item.descriptionKey)}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
