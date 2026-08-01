"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, type GratitudeEntry } from "@/lib/api";

const statusStyles: Record<GratitudeEntry["status"], string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  rejected: "border-rose-200 bg-rose-50 text-rose-800",
};

export function GratitudeModerationPanel() {
  const [pendingEntries, setPendingEntries] = useState<GratitudeEntry[]>([]);
  const [historyEntries, setHistoryEntries] = useState<GratitudeEntry[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadEntries() {
    setLoading(true);
    try {
      const [pending, history] = await Promise.all([
        api.listPendingGratitudeEntries(),
        api.listAdminGratitudeEntries(),
      ]);
      setPendingEntries(pending);
      setHistoryEntries(history);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load pending entries",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  async function moderateEntry(
    entry: GratitudeEntry,
    status: "approved" | "rejected",
  ) {
    setModeratingId(entry.id);
    setError("");
    setMessage("");
    try {
      await api.moderateGratitudeEntry(entry.id, status);
      setMessage(`Entry ${status}.`);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update entry");
    } finally {
      setModeratingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending submissions</CardTitle>
          <CardDescription>
            Approve or reject new member entries before they appear on the
            public Wall of Gratitude.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {message ? (
            <p
              className="rounded-md border border-brand-sea/30 bg-brand-sea/10 p-3 text-sm text-brand-ink"
              role="status"
            >
              {message}
            </p>
          ) : null}

          {loading ? (
            <p className="text-sm text-muted-foreground" role="status">
              Loading pending entries…
            </p>
          ) : pendingEntries.length === 0 ? (
            <p
              className="rounded-2xl border border-dashed border-brand-sand p-6 text-sm text-muted-foreground"
              role="status"
            >
              No pending gratitude entries right now.
            </p>
          ) : (
            pendingEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-brand-sand bg-white p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">
                      Pending approval
                    </p>
                    <h2 className="mt-1 font-semibold text-brand-ink">
                      {entry.display_name || "Love 21 member"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-brand-ink/75">
                      “{entry.message}”
                    </p>
                    {entry.photo_url ? (
                      <p className="mt-2 break-all text-xs text-muted-foreground">
                        Photo: {entry.photo_url}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Submitted {new Date(entry.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => moderateEntry(entry, "approved")}
                      disabled={moderatingId === entry.id}
                    >
                      <CheckCircle2
                        className="mr-1.5 h-4 w-4"
                        aria-hidden="true"
                      />
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
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moderation history</CardTitle>
          <CardDescription>
            See every gratitude entry and whether it was approved, rejected, or
            is still pending.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground" role="status">
              Loading history…
            </p>
          ) : historyEntries.length === 0 ? (
            <p
              className="rounded-2xl border border-dashed border-brand-sand p-6 text-sm text-muted-foreground"
              role="status"
            >
              No gratitude entries have been submitted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {historyEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-brand-sand bg-white p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-coral">
                          {entry.display_name || "Love 21 member"}
                        </p>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusStyles[entry.status]}`}
                        >
                          {entry.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-brand-ink/75">
                        “{entry.message}”
                      </p>
                      {entry.photo_url ? (
                        <p className="mt-2 break-all text-xs text-muted-foreground">
                          Photo: {entry.photo_url}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Submitted{" "}
                        {new Date(entry.submitted_at).toLocaleString()}
                        {entry.moderated_at
                          ? ` · Moderated ${new Date(entry.moderated_at).toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                    {entry.status === "pending" ? (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => moderateEntry(entry, "approved")}
                          disabled={moderatingId === entry.id}
                        >
                          <CheckCircle2
                            className="mr-1.5 h-4 w-4"
                            aria-hidden="true"
                          />
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moderateEntry(entry, "rejected")}
                          disabled={moderatingId === entry.id}
                        >
                          <XCircle
                            className="mr-1.5 h-4 w-4"
                            aria-hidden="true"
                          />
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
