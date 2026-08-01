"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Gift, HeartHandshake, Plus, Users } from "lucide-react";

import { SupportProgress, formatHkd } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, Activity, SupporterDashboard } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-HK", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en-HK", { month: "long", year: "numeric" }).format(new Date(value));
}

function StatCard({ icon: Icon, label, value, help }: { icon: typeof Gift; label: string; value: string; help: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="rounded-full bg-brand-cream p-3 text-brand-coral">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-1 text-2xl">{value}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{help}</p>
        </div>
      </CardHeader>
    </Card>
  );
}

function ActivityCalendar({ activities }: { activities: Activity[] }) {
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, activity) => {
    const month = formatMonth(activity.starts_at);
    acc[month] = [...(acc[month] ?? []), activity];
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([month, entries]) => (
        <section key={month} aria-labelledby={`calendar-${month.replace(/\s+/g, "-").toLowerCase()}`}>
          <h3 id={`calendar-${month.replace(/\s+/g, "-").toLowerCase()}`} className="font-semibold text-brand-ink">
            {month}
          </h3>
          <ol className="mt-3 space-y-3">
            {entries.map((activity) => (
              <li key={activity.id} className="rounded-2xl border border-brand-sand bg-white p-4">
                <p className="text-sm font-semibold text-brand-ink">{activity.title}</p>
                <p className="mt-1 text-sm text-brand-ink/70">{formatDateTime(activity.starts_at)}</p>
                <p className="mt-1 text-sm text-brand-ink/70">{activity.location}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
      {!activities.length ? <p className="text-sm text-muted-foreground">Sign up for an activity to see it here.</p> : null}
    </div>
  );
}

export default function SupporterDashboardPage() {
  const { user, loading } = useCurrentUser();
  const [dashboard, setDashboard] = useState<SupporterDashboard | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hoursActivityId, setHoursActivityId] = useState<string>("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadSupporterData() {
    const [dashboardData, activityData] = await Promise.all([api.supporterDashboard(), api.listActivities()]);
    setDashboard(dashboardData);
    setActivities(activityData);
  }

  useEffect(() => {
    if (user?.role !== "supporter") return;
    loadSupporterData().catch((err) => setError(err instanceof Error ? err.message : "Could not load supporter dashboard"));
  }, [user]);

  const signedUpActivities = useMemo(
    () => dashboard?.signed_up_activities.map((signup) => signup.activity).sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()) ?? [],
    [dashboard],
  );
  const totalActivities = dashboard?.signed_up_activities.length ?? 0;

  async function signUp(activity: Activity) {
    setSaving(true);
    setError("");
    try {
      await api.signUpForActivity(activity.id);
      await loadSupporterData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up for this activity");
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
      setError(err instanceof Error ? err.message : "Could not log volunteer hours");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">Loading your dashboard…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Supporter dashboard</p>
            <h1 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Your Love 21 impact</h1>
            <p className="mt-2 text-sm text-brand-ink/75">
              Signed in as {user.email} · track donations, volunteer hours, and activity sign-ups here. Browse open roles on{" "}
              <a href="/our-volunteer" className="text-brand-coral underline-offset-2 hover:underline">Our Volunteer</a>.
            </p>
          </div>
        </header>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        {!dashboard ? (
          <p className="rounded-2xl border border-brand-sand bg-white p-5 text-sm text-muted-foreground" role="status">Loading your dashboard…</p>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4" aria-label="Supporter summary">
              <StatCard icon={Gift} label="Total given" value={formatHkd(dashboard.total_given_hkd)} help="Mock and seeded gifts attributed to this account." />
              <StatCard icon={HeartHandshake} label="Recurring status" value={dashboard.recurring_status} help="Monthly mock gifts appear as recurring support." />
              <StatCard icon={Clock3} label="Volunteer hours" value={`${dashboard.total_volunteer_hours} hrs`} help="Activity-attached and manual logs combined." />
              <StatCard icon={CalendarDays} label="Activities" value={String(totalActivities)} help="Signed-up activities in your calendar." />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>My giving</CardTitle>
                  <CardDescription>Donation history, total giving, and recurring status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.donations.map((donation) => (
                      <article key={donation.id} className="rounded-2xl border p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-brand-ink">{formatHkd(donation.amount_hkd)} · {donation.frequency === "monthly" ? "Monthly" : "One-time"}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {donation.support_opportunity?.title ?? "General Love 21 support"} · {new Date(donation.created_at).toLocaleDateString("en-HK")}
                            </p>
                          </div>
                          <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-sea">{donation.status}</span>
                        </div>
                        {donation.support_opportunity ? (
                          <SupportProgress
                            className="mt-4"
                            label={donation.support_opportunity.title}
                            fundedAmount={donation.support_opportunity.funded_amount_hkd}
                            targetAmount={donation.support_opportunity.target_amount_hkd}
                            progressPercent={donation.support_opportunity.progress_percent}
                          />
                        ) : null}
                      </article>
                    ))}
                    {!dashboard.donations.length ? <p className="text-sm text-muted-foreground">No donations recorded yet.</p> : null}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact</CardTitle>
                  <CardDescription>How your giving connects back to wishlist items and activities.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.impact_items.map((item, index) => (
                      <article key={`${item.title}-${index}`} className="rounded-2xl bg-brand-cream p-4">
                        <p className="font-semibold text-brand-ink">{item.message}</p>
                        <p className="mt-1 text-sm text-brand-ink/70">{formatHkd(item.amount_hkd)} connected to this priority · {item.progress_percent}% funded now</p>
                      </article>
                    ))}
                    {!dashboard.impact_items.length ? (
                      <p className="text-sm text-muted-foreground">Make a designated gift to see a personal impact acknowledgement here.</p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card>
                <CardHeader>
                  <CardTitle>My volunteering</CardTitle>
                  <CardDescription>Signed-up activities, calendar view, and total hours.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-brand-ink">Calendar</h3>
                    <div className="mt-3">
                      <ActivityCalendar activities={signedUpActivities} />
                    </div>
                  </div>

                  <form onSubmit={logHours} className="space-y-4 rounded-2xl border border-brand-sand p-4">
                    <h3 className="font-semibold text-brand-ink">Log volunteer hours</h3>
                    <div className="space-y-2">
                      <Label htmlFor="hours-activity">Activity (optional)</Label>
                      <select
                        id="hours-activity"
                        value={hoursActivityId}
                        onChange={(event) => setHoursActivityId(event.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Manual log / no activity</option>
                        {signedUpActivities.map((activity) => (
                          <option key={activity.id} value={activity.id}>{activity.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[0.35fr_0.65fr]">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Hours</Label>
                        <Input id="hours" type="number" min={0.25} max={24} step={0.25} value={hours} onChange={(event) => setHours(event.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hours-notes">Notes</Label>
                        <Input id="hours-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What did you help with?" />
                      </div>
                    </div>
                    <Button type="submit" disabled={saving || !hours}>
                      <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add hours
                    </Button>
                  </form>

                  <div>
                    <h3 className="font-semibold text-brand-ink">Hours history</h3>
                    <div className="mt-3 space-y-3">
                      {dashboard.volunteer_hours.map((entry) => (
                        <article key={entry.id} className="rounded-2xl border p-4 text-sm">
                          <p className="font-semibold text-brand-ink">{entry.hours} hours · {entry.activity?.title ?? "Manual log"}</p>
                          <p className="mt-1 text-muted-foreground">{entry.notes ?? "No notes"}</p>
                        </article>
                      ))}
                      {!dashboard.volunteer_hours.length ? <p className="text-sm text-muted-foreground">No hours logged yet.</p> : null}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity sign-up</CardTitle>
                  <CardDescription>Choose upcoming activities to add them to your supporter calendar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <article key={activity.id} className="rounded-2xl border p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-brand-ink">{activity.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(activity.starts_at)} · {activity.location}</p>
                            <p className="mt-2 text-sm text-brand-ink/75">{activity.description}</p>
                          </div>
                          {activity.signed_up ? (
                            <span className="inline-flex items-center rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-sea">
                              <Users className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                              Signed up
                            </span>
                          ) : (
                            <Button type="button" variant="outline" size="sm" onClick={() => signUp(activity)} disabled={saving}>
                              Sign up
                            </Button>
                          )}
                        </div>
                      </article>
                    ))}
                    {!activities.length ? <p className="text-sm text-muted-foreground">No activities are scheduled yet.</p> : null}
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
