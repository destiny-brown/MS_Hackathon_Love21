"use client";

import { useEffect, useState } from "react";
import { Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type RecommendedEventsResponse } from "@/lib/api";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-HK", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

type RecommendedEventsProps = {
  onSignUp: (activityId: number) => Promise<void>;
  saving?: boolean;
};

export function RecommendedEvents({ onSignUp, saving = false }: RecommendedEventsProps) {
  const [data, setData] = useState<RecommendedEventsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getRecommendedEvents()
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load recommendations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Card className="border-brand-sea/20 bg-gradient-to-br from-brand-sea/5 via-white to-brand-cream/60">
        <CardContent className="py-8 text-sm text-muted-foreground" role="status">
          Finding events based on your volunteering…
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.enabled || !data.matches.length) {
    return null;
  }

  return (
    <Card className="border-brand-sea/25 bg-gradient-to-br from-brand-sea/8 via-white to-brand-cream/60">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Events picked for you</CardTitle>
          {data.ai_enhanced ? (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI match
            </Badge>
          ) : (
            <Badge variant="outline">Suggested</Badge>
          )}
        </div>
        <CardDescription>{data.headline}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.matches.map((match) => (
          <article key={match.id} className="rounded-2xl border border-brand-sand bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-brand-ink">{match.title}</h3>
                  <span className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-semibold text-brand-sea">
                    {match.score}% match
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateTime(match.starts_at)} · {match.location}
                </p>
                <p className="mt-2 text-sm text-brand-ink/75">{match.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-brand-ink/80">
                  {match.reasons.map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>
              {match.signed_up ? (
                <span className="inline-flex items-center rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-sea">
                  <Users className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Signed up
                </span>
              ) : (
                <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => onSignUp(match.id)}>
                  Sign up
                </Button>
              )}
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
