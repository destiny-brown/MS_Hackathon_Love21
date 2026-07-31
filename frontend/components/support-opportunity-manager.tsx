"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Archive, Plus, RotateCcw } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  api,
  OpportunityKind,
  OpportunityStatus,
  SupportOpportunity,
  SupportOpportunityInput,
} from "@/lib/api";

type FormState = {
  kind: OpportunityKind;
  title: string;
  description: string;
  impact_statement: string;
  target_amount_hkd: string;
  funded_amount_hkd: string;
  moonclerk_url: string;
  purchase_url: string;
  quantity_needed: string;
  quantity_secured: string;
  status: OpportunityStatus;
  display_order: string;
};

const emptyForm: FormState = {
  kind: "campaign",
  title: "",
  description: "",
  impact_statement: "",
  target_amount_hkd: "",
  funded_amount_hkd: "0",
  moonclerk_url: "https://app.moonclerk.com/pay/2805gcehxjca",
  purchase_url: "",
  quantity_needed: "",
  quantity_secured: "",
  status: "active",
  display_order: "0",
};

function toFormState(opportunity: SupportOpportunity): FormState {
  return {
    kind: opportunity.kind,
    title: opportunity.title,
    description: opportunity.description,
    impact_statement: opportunity.impact_statement,
    target_amount_hkd: String(opportunity.target_amount_hkd),
    funded_amount_hkd: String(opportunity.funded_amount_hkd),
    moonclerk_url: opportunity.moonclerk_url ?? "",
    purchase_url: opportunity.purchase_url ?? "",
    quantity_needed: opportunity.quantity_needed === null ? "" : String(opportunity.quantity_needed),
    quantity_secured: opportunity.quantity_secured === null ? "" : String(opportunity.quantity_secured),
    status: opportunity.status,
    display_order: String(opportunity.display_order),
  };
}

function toPayload(form: FormState): SupportOpportunityInput {
  const isWishlist = form.kind === "wishlist";
  return {
    kind: form.kind,
    title: form.title,
    description: form.description,
    impact_statement: form.impact_statement,
    target_amount_hkd: Number(form.target_amount_hkd),
    funded_amount_hkd: Number(form.funded_amount_hkd),
    moonclerk_url: form.moonclerk_url || null,
    purchase_url: isWishlist && form.purchase_url ? form.purchase_url : null,
    quantity_needed: isWishlist && form.quantity_needed ? Number(form.quantity_needed) : null,
    quantity_secured: isWishlist && form.quantity_secured ? Number(form.quantity_secured) : null,
    status: form.status,
    display_order: Number(form.display_order),
  };
}

export function SupportOpportunityManager() {
  const [opportunities, setOpportunities] = useState<SupportOpportunity[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const entries = await api.listAdminSupportOpportunities();
    setOpportunities(entries);
  }, []);

  useEffect(() => {
    load()
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load support opportunities"))
      .finally(() => setLoading(false));
  }, [load]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = toPayload(form);
      if (editingId === null) {
        await api.createSupportOpportunity(payload);
      } else {
        await api.updateSupportOpportunity(editingId, payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this opportunity");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(opportunity: SupportOpportunity) {
    setEditingId(opportunity.id);
    setForm(toFormState(opportunity));
    document.getElementById("support-opportunity-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function toggleArchive(opportunity: SupportOpportunity) {
    setError("");
    try {
      await api.updateSupportOpportunity(opportunity.id, {
        status: opportunity.status === "active" ? "archived" : "active",
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this opportunity");
    }
  }

  return (
    <section className="space-y-6" aria-labelledby="support-manager-heading">
      <div>
        <h2 id="support-manager-heading" className="text-2xl font-bold tracking-tight">
          Donations and wishlist
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish opportunities and keep public funding progress up to date after reconciling MoonClerk and in-kind gifts.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card id="support-opportunity-form">
          <CardHeader>
            <CardTitle>{editingId === null ? "Add opportunity" : "Edit opportunity"}</CardTitle>
            <CardDescription>Use positive, ability-focused language and verified funding figures.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="support-kind">Type</Label>
                <select
                  id="support-kind"
                  value={form.kind}
                  onChange={(event) => updateField("kind", event.target.value as OpportunityKind)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="campaign">Campaign</option>
                  <option value="cause">Cause</option>
                  <option value="wishlist">Wishlist</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-title">Title</Label>
                <Input
                  id="support-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  maxLength={200}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-description">Description</Label>
                <Textarea
                  id="support-description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-impact">Impact statement</Label>
                <Textarea
                  id="support-impact"
                  value={form.impact_statement}
                  onChange={(event) => updateField("impact_statement", event.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-target">Target (HKD)</Label>
                  <Input
                    id="support-target"
                    type="number"
                    min={1}
                    step={1}
                    value={form.target_amount_hkd}
                    onChange={(event) => updateField("target_amount_hkd", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-funded">Funded (HKD)</Label>
                  <Input
                    id="support-funded"
                    type="number"
                    min={0}
                    step={1}
                    value={form.funded_amount_hkd}
                    onChange={(event) => updateField("funded_amount_hkd", event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-moonclerk">MoonClerk checkout URL</Label>
                <Input
                  id="support-moonclerk"
                  type="url"
                  value={form.moonclerk_url}
                  onChange={(event) => updateField("moonclerk_url", event.target.value)}
                  placeholder="https://app.moonclerk.com/pay/..."
                />
              </div>

              {form.kind === "wishlist" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="support-purchase">Retailer purchase URL (optional)</Label>
                    <Input
                      id="support-purchase"
                      type="url"
                      value={form.purchase_url}
                      onChange={(event) => updateField("purchase_url", event.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="support-needed">Quantity needed</Label>
                      <Input
                        id="support-needed"
                        type="number"
                        min={1}
                        step={1}
                        value={form.quantity_needed}
                        onChange={(event) => updateField("quantity_needed", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-secured">Quantity secured</Label>
                      <Input
                        id="support-secured"
                        type="number"
                        min={0}
                        step={1}
                        value={form.quantity_secured}
                        onChange={(event) => updateField("quantity_secured", event.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-status">Visibility</Label>
                  <select
                    id="support-status"
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value as OpportunityStatus)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-order">Display order</Label>
                  <Input
                    id="support-order"
                    type="number"
                    min={0}
                    step={1}
                    value={form.display_order}
                    onChange={(event) => updateField("display_order", event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  {saving ? "Saving…" : editingId === null ? "Publish opportunity" : "Save changes"}
                </Button>
                {editingId !== null ? (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published and archived opportunities</CardTitle>
            <CardDescription>Progress here is reused on Donate, Wishlist, and Impact.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <article key={opportunity.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {opportunity.kind} · {opportunity.status}
                      </p>
                      <h3 className="mt-1 font-semibold">{opportunity.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(opportunity)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleArchive(opportunity)}>
                        {opportunity.status === "active" ? (
                          <Archive className="mr-2 h-4 w-4" aria-hidden="true" />
                        ) : (
                          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {opportunity.status === "active" ? "Archive" : "Restore"}
                      </Button>
                    </div>
                  </div>
                  <SupportProgress
                    className="mt-4"
                    label={opportunity.title}
                    fundedAmount={opportunity.funded_amount_hkd}
                    targetAmount={opportunity.target_amount_hkd}
                    progressPercent={opportunity.progress_percent}
                  />
                </article>
              ))}
              {!loading && !opportunities.length ? (
                <p className="text-sm text-muted-foreground">No support opportunities yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
