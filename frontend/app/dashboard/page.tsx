"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Plus, XCircle } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SupportOpportunityManager } from "@/components/support-opportunity-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, type GratitudeEntry, type Item } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";
import { Locale, t } from "@/lib/i18n";

export default function DashboardPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const { user, loading, error: authError } = useRequireRoles("admin");
  const [items, setItems] = useState<Item[]>([]);
  const [pendingEntries, setPendingEntries] = useState<GratitudeEntry[]>([]);
  const [metrics, setMetrics] = useState<{ active_members: number; monthly_recurring_donations: number; open_volunteer_roles: number } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [moderationMessage, setModerationMessage] = useState("");

  async function loadAdminData() {
    const [list, adminMetrics, gratitudeEntries] = await Promise.all([
      api.listItems(),
      api.adminMetrics(),
      api.listPendingGratitudeEntries(),
    ]);
    setItems(list);
    setMetrics(adminMetrics);
    setPendingEntries(gratitudeEntries);
  }

  useEffect(() => {
    if (user?.role !== "admin") return;
    loadAdminData().catch((err) => setError(err instanceof Error ? err.message : "Could not load dashboard"));
  }, [user]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.updateItem(editing.id, { title, description });
      } else {
        await api.createItem({ title, description });
      }
      setTitle("");
      setDescription("");
      setEditing(null);
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save item");
    }
  }

  function startEdit(item: Item) {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description || "");
  }

  async function remove(item: Item) {
    await api.deleteItem(item.id);
    await loadAdminData();
  }

  async function moderateEntry(entry: GratitudeEntry, status: "approved" | "rejected") {
    setModeratingId(entry.id);
    setError("");
    setModerationMessage("");
    try {
      await api.moderateGratitudeEntry(entry.id, status);
      setModerationMessage(`Gratitude entry ${status}.`);
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not moderate gratitude entry");
    } finally {
      setModeratingId(null);
    }
  }

  if (loading || !user || user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">
          Checking dashboard access...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t(locale, "dashboard")}</h1>
            <p className="text-sm text-muted-foreground">
              {t(locale, "signedInAs")} {user.email} · {user.role}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} onChange={setLocale} />
            <Button variant="outline" onClick={signOutToLogin}>{t(locale, "logout")}</Button>
          </div>
        </header>

        {authError ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{authError}</p> : null}
        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}
        {moderationMessage ? (
          <p className="rounded-md border border-brand-sea/30 bg-brand-sea/10 p-3 text-sm text-brand-ink" role="status">
            {moderationMessage}
          </p>
        ) : null}

        {metrics ? (
          <section className="grid gap-4 md:grid-cols-3" aria-label="Admin metrics">
            <Card>
              <CardHeader>
                <CardDescription>Active members</CardDescription>
                <CardTitle>{metrics.active_members}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Recurring donations</CardDescription>
                <CardTitle>{metrics.monthly_recurring_donations}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Open volunteer roles</CardDescription>
                <CardTitle>{metrics.open_volunteer_roles}</CardTitle>
              </CardHeader>
            </Card>
          </section>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Wall of Gratitude moderation</CardTitle>
            <CardDescription>
              Pending member submissions require admin approval before they appear on the public Wall of Gratitude.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingEntries.map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-brand-sand p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">Pending approval</p>
                      <h2 className="mt-1 font-semibold text-brand-ink">{entry.display_name || "Love 21 member"}</h2>
                      <p className="mt-2 text-sm leading-6 text-brand-ink/75">“{entry.message}”</p>
                      {entry.photo_url ? <p className="mt-2 break-all text-xs text-muted-foreground">Photo: {entry.photo_url}</p> : null}
                      <p className="mt-2 text-xs text-muted-foreground">Submitted {new Date(entry.submitted_at).toLocaleString()}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => moderateEntry(entry, "approved")}
                        disabled={moderatingId === entry.id}
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moderateEntry(entry, "rejected")}
                        disabled={moderatingId === entry.id}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
              {pendingEntries.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-brand-sand p-4 text-sm text-muted-foreground" role="status">
                  No pending gratitude entries right now.
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{editing ? t(locale, "edit") : t(locale, "createItem")}</CardTitle>
              <CardDescription>Accessible labels, visible focus states, and mobile-first spacing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t(locale, "title")}</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t(locale, "description")}</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit"><Plus className="mr-2 h-4 w-4" />{t(locale, "save")}</Button>
                  {editing ? (
                    <Button type="button" variant="outline" onClick={() => { setEditing(null); setTitle(""); setDescription(""); }}>
                      {t(locale, "cancel")}
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t(locale, "items")}</CardTitle>
              <CardDescription>This CRUD UI maps to the owned backend Item resource.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <article key={item.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-semibold">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description || "No description"}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>{t(locale, "edit")}</Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(item)}>{t(locale, "delete")}</Button>
                      </div>
                    </div>
                  </article>
                ))}
                {items.length === 0 ? <p className="text-sm text-muted-foreground">No items yet. Create one.</p> : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <SupportOpportunityManager />
      </div>
    </main>
  );
}
