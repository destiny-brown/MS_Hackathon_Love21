"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, MemberDashboard, VolunteerActivity } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";

function StatCard({ label, value, help }: { label: string; value: string; help: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <p className="text-xs text-muted-foreground">{help}</p>
      </CardHeader>
    </Card>
  );
}

export default function MemberDashboardPage() {
  const { user, loading, error: authError } = useRequireRoles("member");
  const [dashboard, setDashboard] = useState<MemberDashboard | null>(null);
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadMemberData() {
    const [dashboardData, activityData] = await Promise.all([
      api.memberDashboard(),
      api.listVolunteerActivities(),
    ]);
    setDashboard(dashboardData);
    setActivities(activityData);
  }

  useEffect(() => {
    if (user?.role !== "member") return;
    loadMemberData().catch((err) => setError(err instanceof Error ? err.message : "Could not load member dashboard"));
  }, [user]);

  const registeredActivities = useMemo(
    () => dashboard?.registered_activities ?? [],
    [dashboard],
  );

  async function signUp(slug: string) {
    setSaving(true);
    setError("");
    try {
      await api.signUpForVolunteerActivity(slug);
      await loadMemberData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register for this activity");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user || user.role !== "member") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">
          Checking member access…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Member dashboard</p>
            <h1 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Your Love 21 activities</h1>
            <p className="mt-2 text-sm text-brand-ink/75">
              Signed in as {user.email} · see programmes you have joined and discover new volunteer roles.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/member/profile">Profile & gratitude</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to site</Link>
            </Button>
            <Button variant="outline" onClick={signOutToLogin}>
              Log out
            </Button>
          </div>
        </header>

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
            Loading your dashboard…
          </p>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3" aria-label="Member summary">
              <StatCard
                label="Joined activities"
                value={String(dashboard.total_registrations)}
                help="Volunteer roles and programmes you are registered for."
              />
              <StatCard
                label="Active registrations"
                value={String(dashboard.upcoming_registrations)}
                help="Open registrations on your member account."
              />
              <StatCard
                label="Explore more"
                value={String(activities.filter((item) => !item.signed_up).length)}
                help="Additional volunteer roles you can still join."
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-brand-coral" aria-hidden="true" />
                    My joined activities
                  </CardTitle>
                  <CardDescription>Programmes and volunteer roles linked to your member account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {registeredActivities.map((registration) => (
                    <article key={registration.id} className="rounded-2xl border border-brand-sand bg-white p-4">
                      <p className="font-semibold text-brand-ink">{registration.activity_name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Registered {new Date(registration.created_at).toLocaleDateString("en-HK")} · {registration.status}
                      </p>
                    </article>
                  ))}
                  {!registeredActivities.length ? (
                    <p className="text-sm text-muted-foreground">
                      You have not joined any activities yet. Browse open roles below or visit{" "}
                      <Link href="/our-volunteer" className="text-brand-coral hover:underline">
                        Our Volunteer
                      </Link>
                      .
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-sea" aria-hidden="true" />
                    Join an activity
                  </CardTitle>
                  <CardDescription>Open volunteer roles you can add to your member dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.map((activity) => (
                    <article key={activity.role_id} className="rounded-2xl border p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-brand-ink">
                            {activity.icon} {activity.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {activity.when} · {activity.where}
                          </p>
                          <p className="mt-2 text-sm text-brand-ink/75">{activity.desc}</p>
                        </div>
                        {activity.signed_up ? (
                          <span className="inline-flex items-center rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-sea">
                            <Users className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                            Joined
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={saving}
                            onClick={() => signUp(activity.role_id)}
                          >
                            Join
                          </Button>
                        )}
                      </div>
                    </article>
                  ))}
                  {!activities.length ? (
                    <p className="text-sm text-muted-foreground">No volunteer activities are available right now.</p>
                  ) : null}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
