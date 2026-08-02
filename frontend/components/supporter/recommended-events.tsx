"use client";

import { useEffect, useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ScrollPanel } from "@/components/account/scroll-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type RecommendedEventsResponse } from "@/lib/api";
import { intlLocaleForSite } from "@/lib/i18n/intl-locale";

type RecommendedEventsProps = {
  onSignUp: (activityId: number) => Promise<void>;
  saving?: boolean;
};

export function RecommendedEvents({ onSignUp, saving = false }: RecommendedEventsProps) {
  const { t, i18n } = useTranslation("dashboard");
  const [data, setData] = useState<RecommendedEventsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const intlLocale = intlLocaleForSite(i18n.language);

  function formatDateTime(value: string) {
    return new Intl.DateTimeFormat(intlLocale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }

  useEffect(() => {
    let cancelled = false;
    api
      .getRecommendedEvents()
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("recommendedEvents.loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  if (loading) {
    return (
      <Card className="border-brand-sea/20 bg-gradient-to-br from-brand-sea/5 via-white to-brand-cream/60">
        <CardContent className="py-6 text-sm text-muted-foreground sm:py-8" role="status">
          {t("recommendedEvents.loading")}
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.enabled || !data.matches.length) {
    return null;
  }

  return (
    <Card className="border-brand-sea/25 bg-gradient-to-br from-brand-sea/8 via-white to-brand-cream/60">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-lg sm:text-xl">{t("recommendedEvents.title")}</CardTitle>
          {data.ai_enhanced ? (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t("recommendedEvents.aiMatch")}
            </Badge>
          ) : (
            <Badge variant="outline">{t("recommendedEvents.suggested")}</Badge>
          )}
        </div>
        <CardDescription>{data.headline}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollPanel label={t("recommendedEvents.scrollLabel")}>
          <div className="space-y-2 sm:space-y-3">
            {data.matches.map((match) => (
              <article key={match.id} className="rounded-xl border border-brand-sand bg-white p-3 sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-brand-ink">{match.title}</h3>
                      <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-semibold text-brand-sea">
                        {t("common.matchPercent", { score: match.score })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {formatDateTime(match.starts_at)} · {match.location}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-ink/75">{match.description}</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-brand-ink/80 sm:text-sm">
                      {match.reasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                  {match.signed_up ? (
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-brand-cream px-3 py-1.5 text-xs font-semibold text-brand-sea sm:w-auto">
                      <Users className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      {t("common.signedUp")}
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={saving}
                      onClick={() => onSignUp(match.id)}
                    >
                      {t("common.signUp")}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </ScrollPanel>
      </CardContent>
    </Card>
  );
}
