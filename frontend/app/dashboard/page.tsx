"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { GratitudeModerationPanel } from "@/components/admin/gratitude-moderation-panel";
import { SupportOpportunityManager } from "@/components/support-opportunity-manager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, type Item } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";

export default function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common", "admin"]);
  const { user, loading, error: authError } = useRequireRoles("admin");
  const [items, setItems] = useState<Item[]>([]);
  const [metrics, setMetrics] = useState<{
    active_members: number;
    monthly_recurring_donations: number;
    open_volunteer_roles: number;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState("");

  async function loadAdminData() {
    const [list, adminMetrics] = await Promise.all([
      api.listItems(),
      api.adminMetrics(),
    ]);
    setItems(list);
    setMetrics(adminMetrics);
  }

  useEffect(() => {
    if (user?.role !== "admin") return;
    loadAdminData().catch((err) =>
      setError(err instanceof Error ? err.message : "Could not load dashboard"),
    );
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

  if (loading || !user || user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p
          className="rounded-md border p-4 text-sm text-muted-foreground"
          role="status"
        >
          {t("legacy.checkingAccess")}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("common:dashboard")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("common.signedInAs", { email: user.email })} · {user.role}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={signOutToLogin}>
              {t("common.logOut")}
            </Button>
          </div>
        </header>

        {authError ? (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {authError}
          </p>
        ) : null}
        {error ? (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {metrics ? (
          <section
            className="grid gap-4 md:grid-cols-3"
            aria-label="Admin metrics"
          >
            <Card>
              <CardHeader>
                <CardDescription>{t("legacy.activeMembers")}</CardDescription>
                <CardTitle>{metrics.active_members}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>{t("legacy.recurringDonations")}</CardDescription>
                <CardTitle>{metrics.monthly_recurring_donations}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>{t("legacy.openVolunteerRoles")}</CardDescription>
                <CardTitle>{metrics.open_volunteer_roles}</CardTitle>
              </CardHeader>
            </Card>
          </section>
        ) : null}

        <GratitudeModerationPanel />

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                {editing ? t("admin:events.editTitle") : t("admin:events.createTitle")}
              </CardTitle>
              <CardDescription>
                {t("legacy.accessibleLabels")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("admin:events.titleLabel")}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("admin:events.descriptionLabel")}
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    {editing ? t("admin:events.update") : t("admin:events.create")}
                  </Button>
                  {editing ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(null);
                        setTitle("");
                        setDescription("");
                      }}
                    >
                      {t("admin:events.cancel")}
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("admin:events.allEvents")}</CardTitle>
              <CardDescription>
                This CRUD UI maps to the owned backend Item resource.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <article key={item.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-semibold">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description || t("legacy.noDescription")}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(item)}
                        >
                          {t("admin:events.edit")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(item)}
                        >
                          {t("admin:events.delete")}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("legacy.noItems")}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <SupportOpportunityManager />
      </div>
    </main>
  );
}
