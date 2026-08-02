"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Gift, HeartHandshake, Plus, Search } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { ScrollPanel } from "@/components/account/scroll-panel";
import { SupportProgress, formatHkd } from "@/components/site/support-progress";
import { CaptainsCorner } from "@/components/supporter/captains-corner";
import { RecommendedEvents } from "@/components/supporter/recommended-events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, Activity, SupporterDashboard } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";
import { intlLocaleForSite } from "@/lib/i18n/intl-locale";
import { cn } from "@/lib/utils";

type DashboardTab = "impact" | "volunteer";

function StatCard({ icon: Icon, label, value, help }: { icon: typeof Gift; label: string; value: string; help: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 sm:gap-4 sm:p-6">
        <div className="rounded-full bg-brand-cream p-2.5 text-brand-coral sm:p-3">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-1 text-xl sm:text-2xl">{value}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{help}</p>
        </div>
      </CardHeader>
    </Card>
  );
}

function ActivityCalendar({
  activities,
  intlLocale,
  emptyMessage,
}: {
  activities: Activity[];
  intlLocale: string;
  emptyMessage: string;
}) {
  function formatDateTime(value: string) {
    return new Intl.DateTimeFormat(intlLocale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function formatMonth(value: string) {
    return new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(new Date(value));
  }

  const grouped = activities.reduce<Record<string, Activity[]>>((acc, activity) => {
    const month = formatMonth(activity.starts_at);
    acc[month] = [...(acc[month] ?? []), activity];
    return acc;
  }, {});

  return (
    <div className="space-y-3 sm:space-y-4">
      {Object.entries(grouped).map(([month, entries]) => (
        <section key={month}>
          <h3 className="text-sm font-semibold text-brand-ink sm:text-base">{month}</h3>
          <ol className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
            {entries.map((activity) => (
              <li key={activity.id} className="rounded-xl border border-brand-sand bg-white p-3 sm:p-4">
                <p className="text-sm font-semibold text-brand-ink">{activity.title}</p>
                <p className="mt-1 text-xs text-brand-ink/70 sm:text-sm">{formatDateTime(activity.starts_at)}</p>
                <p className="mt-1 text-xs text-brand-ink/70 sm:text-sm">{activity.location}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
      {!activities.length ? <p className="text-sm text-muted-foreground">{emptyMessage}</p> : null}
    </div>
  );
}

export default function SupporterDashboardPage() {
  const { t, i18n } = useTranslation("dashboard");
  const intlLocale = intlLocaleForSite(i18n.language);
  const { user, loading, error: authError } = useRequireRoles("supporter");
  const [dashboard, setDashboard] = useState<SupporterDashboard | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hoursActivityId, setHoursActivityId] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("impact");
  const [eventSearch, setEventSearch] = useState("");

  function formatDateTime(value: string) {
    return new Intl.DateTimeFormat(intlLocale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }

  async function loadSupporterData() {
    const [dashboardData, activityData] = await Promise.all([api.supporterDashboard(), api.listActivities()]);
    setDashboard(dashboardData);
    setActivities(activityData);
  }

  useEffect(() => {
    if (user?.role !== "supporter") return;
    loadSupporterData().catch((err) => setError(err instanceof Error ? err.message : t("supporter.loadError")));
  }, [user, t]);

  const signedUpActivities = useMemo(
    () =>
      dashboard?.signed_up_activities
        .map((signup) => signup.activity)
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()) ?? [],
    [dashboard],
  );

  const availableActivities = useMemo(() => activities.filter((item) => !item.signed_up), [activities]);

  const filteredActivities = useMemo(() => {
    const query = eventSearch.trim().toLowerCase();
    if (!query) return availableActivities;
    return availableActivities.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  }, [availableActivities, eventSearch]);

  async function signUp(activityId: number) {
    setSaving(true);
    setError("");
    try {
      await api.signUpForActivity(activityId);
      await loadSupporterData();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("supporter.signUpError"));
    } finally {
      setSaving(false);
    }
  }

  async function logHours(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.logVolunteerHours({
        activity_id: hoursActivityId ? Number(hoursActivityId) : null,
        hours: Number(hours),
        notes: notes || null,
      });
      setHours("");
      setNotes("");
      setHoursActivityId("");
      await loadSupporterData();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("supporter.logHoursError"));
    } finally {
      setSaving(false);
    }
  }

  const impactPanel = dashboard ? (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("supporter.giving.title")}</CardTitle>
          <CardDescription>{t("supporter.giving.description")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollPanel label={t("supporter.giving.scrollLabel")}>
            <div className="space-y-2 sm:space-y-3">
              {dashboard.donations.map((donation) => (
                <article key={donation.id} className="rounded-xl border p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-brand-ink sm:text-base">
                        {formatHkd(donation.amount_hkd)} ·{" "}
                        {donation.frequency === "monthly" ? t("common.monthly") : t("common.oneTime")}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {donation.support_opportunity?.title ?? t("common.generalSupport")} ·{" "}
                        {new Date(donation.created_at).toLocaleDateString(intlLocale)}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-sea">
                      {donation.status}
                    </span>
                  </div>
                  {donation.support_opportunity ? (
                    <SupportProgress
                      className="mt-3"
                      label={donation.support_opportunity.title}
                      fundedAmount={donation.support_opportunity.funded_amount_hkd}
                      targetAmount={donation.support_opportunity.target_amount_hkd}
                      progressPercent={donation.support_opportunity.progress_percent}
                    />
                  ) : null}
                </article>
              ))}
              {!dashboard.donations.length ? (
                <p className="text-sm text-muted-foreground">{t("supporter.giving.empty")}</p>
              ) : null}
            </div>
          </ScrollPanel>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("supporter.impact.title")}</CardTitle>
          <CardDescription>{t("supporter.impact.description")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollPanel label={t("supporter.impact.scrollLabel")}>
            <div className="space-y-2 sm:space-y-3">
              {dashboard.impact_items.map((item, index) => (
                <article key={`${item.title}-${index}`} className="rounded-xl bg-brand-cream p-3 sm:p-4">
                  <p className="text-sm font-semibold text-brand-ink">{item.message}</p>
                  <p className="mt-1 text-xs text-brand-ink/70 sm:text-sm">
                    {t("common.connectedFunded", {
                      amount: formatHkd(item.amount_hkd),
                      percent: item.progress_percent,
                    })}
                  </p>
                </article>
              ))}
              {!dashboard.impact_items.length ? (
                <p className="text-sm text-muted-foreground">{t("supporter.impact.empty")}</p>
              ) : null}
            </div>
          </ScrollPanel>
        </CardContent>
      </Card>
    </div>
  ) : null;

  const volunteerPanel = dashboard ? (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("supporter.volunteering.title")}</CardTitle>
          <CardDescription>{t("supporter.volunteering.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <ScrollPanel label={t("supporter.volunteering.calendarLabel")}>
            <ActivityCalendar
              activities={signedUpActivities}
              intlLocale={intlLocale}
              emptyMessage={t("supporter.volunteering.calendarEmpty")}
            />
          </ScrollPanel>

          <form onSubmit={logHours} className="space-y-3 rounded-xl border border-brand-sand p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-brand-ink sm:text-base">{t("supporter.volunteering.logHoursTitle")}</h3>
            <div className="space-y-2">
              <Label htmlFor="hours-activity">{t("supporter.volunteering.activityOptional")}</Label>
              <select
                id="hours-activity"
                value={hoursActivityId}
                onChange={(event) => setHoursActivityId(event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t("supporter.volunteering.manualOption")}</option>
                {signedUpActivities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hours">{t("supporter.volunteering.hours")}</Label>
                <Input id="hours" type="number" min={0.25} max={24} step={0.25} value={hours} onChange={(e) => setHours(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-notes">{t("supporter.volunteering.notes")}</Label>
                <Input id="hours-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("supporter.volunteering.notesPlaceholder")} />
              </div>
            </div>
            <Button type="submit" size="sm" disabled={saving || !hours} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              {t("supporter.volunteering.addHours")}
            </Button>
          </form>

          <div>
            <h3 className="text-sm font-semibold text-brand-ink sm:text-base">{t("supporter.volunteering.hoursHistory")}</h3>
            <ScrollPanel label={t("supporter.volunteering.hoursHistoryLabel")} className="mt-2">
              <div className="space-y-2">
                {dashboard.volunteer_hours.map((entry) => (
                  <article key={entry.id} className="rounded-xl border p-3 text-sm">
                    <p className="font-semibold text-brand-ink">
                      {t("common.hoursCount", { count: entry.hours })} · {entry.activity?.title ?? t("common.manualLog")}
                    </p>
                    <p className="mt-1 text-muted-foreground">{entry.notes ?? t("common.noNotes")}</p>
                  </article>
                ))}
                {!dashboard.volunteer_hours.length ? (
                  <p className="text-sm text-muted-foreground">{t("supporter.volunteering.hoursEmpty")}</p>
                ) : null}
              </div>
            </ScrollPanel>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("supporter.events.title")}</CardTitle>
          <CardDescription>{t("supporter.events.openEvents", { count: availableActivities.length })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              placeholder={t("supporter.events.searchPlaceholder")}
              className="h-9 bg-white pl-9 text-sm"
              aria-label={t("supporter.events.searchAria")}
            />
          </div>
          <ScrollPanel label={t("supporter.events.scrollLabel")}>
            <div className="space-y-2 sm:space-y-3">
              {filteredActivities.map((activity) => (
                <article key={activity.id} className="rounded-xl border p-3 sm:p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-brand-ink sm:text-base">{activity.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {formatDateTime(activity.starts_at)} · {activity.location}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-brand-ink/75">{activity.description}</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => signUp(activity.id)} disabled={saving}>
                      {t("common.signUp")}
                    </Button>
                  </div>
                </article>
              ))}
              {!filteredActivities.length ? (
                <p className="text-sm text-muted-foreground">
                  {eventSearch ? t("supporter.events.noMatch") : t("supporter.events.empty")}
                </p>
              ) : null}
            </div>
          </ScrollPanel>
        </CardContent>
      </Card>
    </div>
  ) : null;

  if (loading || !user || user.role !== "supporter") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">
          {t("supporter.checkingAccess")}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("supporter.eyebrow")}</p>
            <h1 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl lg:text-5xl">{t("supporter.title")}</h1>
            <p className="mt-2 text-sm text-brand-ink/75">
              {t("common.signedInAs", { email: user.email })}{" "}
              <Trans
                i18nKey="supporter.signedInHint"
                ns="dashboard"
                components={{
                  link: <Link href="/our-volunteer" className="text-brand-coral hover:underline" />,
                }}
              />
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Link href="/">{t("common.site")}</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={signOutToLogin}>
              {t("common.logOut")}
            </Button>
          </div>
        </header>

        <CaptainsCorner />

        <RecommendedEvents saving={saving} onSignUp={signUp} />

        {authError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {authError}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!dashboard ? (
          <p className="rounded-2xl border border-brand-sand bg-white p-5 text-sm text-muted-foreground" role="status">
            {t("common.loadingDashboard")}
          </p>
        ) : (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4" aria-label={t("supporter.summaryAria")}>
              <StatCard icon={Gift} label={t("supporter.stats.totalGiven")} value={formatHkd(dashboard.total_given_hkd)} help={t("supporter.stats.totalGivenHelp")} />
              <StatCard icon={HeartHandshake} label={t("supporter.stats.recurring")} value={dashboard.recurring_status} help={t("supporter.stats.recurringHelp")} />
              <StatCard icon={Clock3} label={t("supporter.stats.volunteerHours")} value={t("common.hoursUnit", { count: dashboard.total_volunteer_hours })} help={t("supporter.stats.volunteerHoursHelp")} />
              <StatCard icon={CalendarDays} label={t("supporter.stats.activities")} value={String(dashboard.signed_up_activities.length)} help={t("supporter.stats.activitiesHelp")} />
            </section>

            <div className="lg:hidden">
              <div className="flex rounded-xl border border-brand-sand bg-white p-1" role="tablist" aria-label={t("supporter.tabs.ariaLabel")}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "impact"}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-medium",
                    activeTab === "impact" ? "bg-brand-coral text-white" : "text-brand-ink/70",
                  )}
                  onClick={() => setActiveTab("impact")}
                >
                  {t("supporter.tabs.impact")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "volunteer"}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-medium",
                    activeTab === "volunteer" ? "bg-brand-coral text-white" : "text-brand-ink/70",
                  )}
                  onClick={() => setActiveTab("volunteer")}
                >
                  {t("supporter.tabs.volunteer")}
                </button>
              </div>
              <div className="mt-4">{activeTab === "impact" ? impactPanel : volunteerPanel}</div>
            </div>

            <div className="hidden space-y-6 lg:block">
              {impactPanel}
              {volunteerPanel}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
