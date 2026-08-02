"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Search, Sparkles, Users } from "lucide-react";

import { ScrollPanel } from "@/components/account/scroll-panel";
import { RecommendedVolunteerRoles } from "@/components/member/recommended-volunteer-roles";
import { CaptainsCorner } from "@/components/supporter/captains-corner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api, MemberDashboard, VolunteerActivity } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ActivityTab = "browse" | "joined";

function StatCard({ label, value, help }: { label: string; value: string; help: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <p className="text-xs text-muted-foreground">{help}</p>
      </CardHeader>
    </Card>
  );
}

function JoinedActivityCard({
  name,
  createdAt,
  status,
}: {
  name: string;
  createdAt: string;
  status: string;
}) {
  return (
    <article className="rounded-xl border border-brand-sand bg-white p-3 sm:p-4">
      <p className="font-semibold text-brand-ink">{name}</p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Joined {new Date(createdAt).toLocaleDateString("en-HK")} · {status}
      </p>
    </article>
  );
}

function VolunteerRoleCard({
  activity,
  saving,
  onJoin,
}: {
  activity: VolunteerActivity;
  saving: boolean;
  onJoin: (slug: string) => void;
}) {
  return (
    <article className="rounded-xl border border-brand-sand bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-brand-ink">
            <span aria-hidden="true">{activity.icon} </span>
            {activity.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {activity.when} · {activity.where}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-brand-ink/75">{activity.desc}</p>
        </div>
        <div className="flex shrink-0 sm:pt-0.5">
          {activity.signed_up ? (
            <span className="inline-flex w-full items-center justify-center rounded-full bg-brand-cream px-3 py-1.5 text-xs font-semibold text-brand-sea sm:w-auto">
              <Users className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Joined
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={saving}
              onClick={() => onJoin(activity.role_id)}
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MemberDashboardPage() {
  const { user, loading, error: authError } = useRequireRoles("member");
  const [dashboard, setDashboard] = useState<MemberDashboard | null>(null);
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActivityTab>("browse");
  const [search, setSearch] = useState("");
  const [showJoinedInBrowse, setShowJoinedInBrowse] = useState(false);

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

  const registeredActivities = useMemo(() => dashboard?.registered_activities ?? [], [dashboard]);

  const availableActivities = useMemo(
    () => activities.filter((item) => !item.signed_up),
    [activities],
  );

  const filteredBrowseActivities = useMemo(() => {
    const pool = showJoinedInBrowse ? activities : availableActivities;
    const query = search.trim().toLowerCase();
    if (!query) return pool;
    return pool.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.where.toLowerCase().includes(query) ||
        item.when.toLowerCase().includes(query),
    );
  }, [activities, availableActivities, search, showJoinedInBrowse]);

  async function signUp(slug: string) {
    setSaving(true);
    setError("");
    try {
      await api.signUpForVolunteerActivity(slug);
      await loadMemberData();
      setActiveTab("joined");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register for this activity");
    } finally {
      setSaving(false);
    }
  }

  const joinedPanel = (
    <ScrollPanel label="Joined activities list">
      <div className="space-y-2 sm:space-y-3">
        {registeredActivities.map((registration) => (
          <JoinedActivityCard
            key={registration.id}
            name={registration.activity_name}
            createdAt={registration.created_at}
            status={registration.status}
          />
        ))}
        {!registeredActivities.length ? (
          <div className="rounded-xl border border-dashed border-brand-sand bg-white/70 p-4 text-center text-sm text-muted-foreground">
            <p>No joined activities yet.</p>
            <Button
              type="button"
              variant="link"
              className="mt-1 h-auto p-0 text-brand-coral"
              onClick={() => setActiveTab("browse")}
            >
              Browse open roles
            </Button>
          </div>
        ) : null}
      </div>
    </ScrollPanel>
  );

  const browsePanel = (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search roles…"
          className="h-9 bg-white pl-9 text-sm"
          aria-label="Search volunteer roles"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {filteredBrowseActivities.length} role{filteredBrowseActivities.length === 1 ? "" : "s"}
          {!showJoinedInBrowse ? " available" : ""}
        </span>
        <button
          type="button"
          className="font-medium text-brand-coral hover:underline"
          onClick={() => setShowJoinedInBrowse((value) => !value)}
        >
          {showJoinedInBrowse ? "Hide joined" : `Show joined (${activities.length - availableActivities.length})`}
        </button>
      </div>
      <ScrollPanel label="Available volunteer roles">
        <div className="space-y-2 sm:space-y-3">
          {filteredBrowseActivities.map((activity) => (
            <VolunteerRoleCard key={activity.role_id} activity={activity} saving={saving} onJoin={signUp} />
          ))}
          {!filteredBrowseActivities.length ? (
            <p className="rounded-xl border border-dashed border-brand-sand bg-white/70 p-4 text-center text-sm text-muted-foreground">
              {search ? "No roles match your search." : "No open roles right now."}
            </p>
          ) : null}
        </div>
      </ScrollPanel>
      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
        <Link href="/our-volunteer">
          Full volunteer page
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );

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
    <main className="min-h-screen bg-brand-cream px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Member dashboard</p>
            <h1 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl lg:text-5xl">
              Your Love 21 activities
            </h1>
            <p className="mt-2 text-sm text-brand-ink/75">
              Signed in as <span className="break-all">{user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Link href="/member/profile">Profile</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Link href="/">Site</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={signOutToLogin}>
              Log out
            </Button>
          </div>
        </header>

        <CaptainsCorner audience="member" />

        <RecommendedVolunteerRoles saving={saving} onJoin={signUp} />

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
            <section className="grid gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Member summary">
              <StatCard
                label="Joined"
                value={String(dashboard.total_registrations)}
                help="Programmes on your account."
              />
              <StatCard
                label="Active"
                value={String(dashboard.upcoming_registrations)}
                help="Current registrations."
              />
              <StatCard
                label="Open roles"
                value={String(availableActivities.length)}
                help="You can still join these."
              />
            </section>

            {/* Mobile tabs */}
            <div className="lg:hidden">
              <div className="flex rounded-xl border border-brand-sand bg-white p-1" role="tablist" aria-label="Activity sections">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "browse"}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === "browse" ? "bg-brand-coral text-white" : "text-brand-ink/70",
                  )}
                  onClick={() => setActiveTab("browse")}
                >
                  Browse ({availableActivities.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "joined"}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === "joined" ? "bg-brand-coral text-white" : "text-brand-ink/70",
                  )}
                  onClick={() => setActiveTab("joined")}
                >
                  Joined ({registeredActivities.length})
                </button>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-3">
                  {activeTab === "browse" ? (
                    <>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-brand-sea" aria-hidden="true" />
                        Join an activity
                      </CardTitle>
                      <CardDescription>Scroll to browse open roles.</CardDescription>
                    </>
                  ) : (
                    <>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarDays className="h-5 w-5 text-brand-coral" aria-hidden="true" />
                        My joined activities
                      </CardTitle>
                      <CardDescription>Programmes linked to your account.</CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent>{activeTab === "browse" ? browsePanel : joinedPanel}</CardContent>
              </Card>
            </div>

            {/* Desktop two-column with scroll panels */}
            <section className="hidden gap-6 lg:grid lg:grid-cols-2">
              <Card className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-brand-coral" aria-hidden="true" />
                    My joined activities
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {registeredActivities.length}
                    </span>
                  </CardTitle>
                  <CardDescription>Programmes linked to your member account.</CardDescription>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col pt-0">{joinedPanel}</CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-sea" aria-hidden="true" />
                    Join an activity
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {availableActivities.length} open
                    </span>
                  </CardTitle>
                  <CardDescription>Browse open volunteer roles — scroll for more.</CardDescription>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col pt-0">{browsePanel}</CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
