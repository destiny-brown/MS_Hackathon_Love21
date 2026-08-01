"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, type LearnResource, type LearnResourceInput } from "@/lib/api";

const emptyResource: LearnResourceInput = {
  slug: "",
  title: "",
  date_label: "",
  cover_image_url: "",
  source_url: "",
  source_label: "",
  topics: [],
  learning_hook: "",
  audience: "all",
  resource_type: "press",
  origin: "external",
  show_on_learn: true,
  show_on_stories: false,
  status: "draft",
};

export function LearnResourcesAdminPanel() {
  const [resources, setResources] = useState<LearnResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<LearnResourceInput>(emptyResource);

  async function loadResources() {
    setLoading(true);
    try {
      setResources(await api.listAdminLearnResources());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load resources");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadResources();
  }, []);

  async function createResource() {
    setBusyId(-1);
    setError("");
    try {
      await api.createAdminLearnResource({
        ...draft,
        topics: draft.topics?.length ? draft.topics : draft.topics,
      });
      setMessage("Resource created.");
      setDraft(emptyResource);
      setShowCreate(false);
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create resource");
    } finally {
      setBusyId(null);
    }
  }

  async function updateResource(id: number, payload: Partial<LearnResourceInput>) {
    setBusyId(id);
    setError("");
    try {
      await api.updateAdminLearnResource(id, payload);
      setMessage("Resource updated.");
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update resource");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteResource(id: number) {
    if (!window.confirm("Delete this resource?")) return;
    setBusyId(id);
    try {
      await api.deleteAdminLearnResource(id);
      setMessage("Resource deleted.");
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete resource");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-ink/65">Manage articles and links shown on Learn → Resources.</p>
        <Button type="button" size="sm" onClick={() => setShowCreate((v) => !v)}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {showCreate ? "Cancel" : "Add resource"}
        </Button>
      </div>

      {showCreate ? (
        <Card className="border-brand-sea/30">
          <CardHeader>
            <CardTitle>New resource</CardTitle>
            <CardDescription>Published resources appear on the public Learn resources page when show on Learn is enabled.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label="Slug" value={draft.slug} onChange={(slug) => setDraft((d) => ({ ...d, slug }))} />
            <Field label="Title" value={draft.title} onChange={(title) => setDraft((d) => ({ ...d, title }))} />
            <Field label="Date label" value={draft.date_label} onChange={(date_label) => setDraft((d) => ({ ...d, date_label }))} />
            <Field label="Source label" value={draft.source_label} onChange={(source_label) => setDraft((d) => ({ ...d, source_label }))} />
            <Field label="Cover image URL" value={draft.cover_image_url} onChange={(cover_image_url) => setDraft((d) => ({ ...d, cover_image_url }))} className="sm:col-span-2" />
            <Field label="Source URL" value={draft.source_url} onChange={(source_url) => setDraft((d) => ({ ...d, source_url }))} className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <Label htmlFor="resource-hook">Learning hook</Label>
              <Textarea id="resource-hook" value={draft.learning_hook} onChange={(e) => setDraft((d) => ({ ...d, learning_hook: e.target.value }))} rows={2} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="resource-topics">Topics (comma-separated)</Label>
              <Input
                id="resource-topics"
                value={draft.topics?.join(", ") || ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    topics: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  }))
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="resource-audience">Audience</Label>
              <select
                id="resource-audience"
                value={draft.audience}
                onChange={(e) => setDraft((d) => ({ ...d, audience: e.target.value }))}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
              </select>
            </div>
            <Button type="button" onClick={createResource} disabled={busyId === -1} className="sm:col-span-2 sm:w-auto">
              Create draft
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading resources…</p>
      ) : resources.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-sand p-8 text-center text-sm text-muted-foreground">
          No resources yet.
        </p>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <article key={resource.id} className="flex flex-col gap-4 rounded-2xl border border-brand-sand bg-white p-4 sm:flex-row sm:items-start">
              <img src={resource.cover_image_url} alt="" className="h-20 w-32 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={resource.status === "published" ? "success" : "secondary"}>{resource.status}</Badge>
                  <Badge variant="outline">{resource.origin}</Badge>
                  <Badge variant="outline">{resource.audience}</Badge>
                </div>
                <h3 className="mt-2 font-semibold text-brand-ink">{resource.title}</h3>
                <p className="mt-1 text-sm text-brand-ink/65">{resource.learning_hook}</p>
                <p className="mt-2 truncate text-xs text-muted-foreground">{resource.source_url}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {resource.status === "draft" ? (
                  <Button type="button" size="sm" disabled={busyId === resource.id} onClick={() => updateResource(resource.id, { status: "published" })}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    Publish
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" disabled={busyId === resource.id} onClick={() => updateResource(resource.id, { status: "draft" })}>
                    Unpublish
                  </Button>
                )}
                <Button type="button" size="sm" variant="ghost" disabled={busyId === resource.id} onClick={() => deleteResource(resource.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
    </div>
  );
}

function Alert({ children, tone }: { children: React.ReactNode; tone: "error" | "success" }) {
  return (
    <p
      className={
        tone === "error"
          ? "rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          : "rounded-xl border border-brand-sea/30 bg-brand-sea/10 p-3 text-sm text-brand-ink"
      }
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
