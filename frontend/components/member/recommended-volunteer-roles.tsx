"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ScrollPanel } from "@/components/account/scroll-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type RecommendedVolunteerRolesResponse } from "@/lib/api";

type RecommendedVolunteerRolesProps = {
  onJoin: (slug: string) => Promise<void>;
  saving?: boolean;
};

export function RecommendedVolunteerRoles({ onJoin, saving = false }: RecommendedVolunteerRolesProps) {
  const { t } = useTranslation("dashboard");
  const [data, setData] = useState<RecommendedVolunteerRolesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getMemberRecommendedRoles()
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch(() => {
        if (!cancelled) setData(null);
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
        <CardContent className="py-6 text-sm text-muted-foreground" role="status">
          {t("recommendedRoles.loading")}
        </CardContent>
      </Card>
    );
  }

  if (!data?.enabled || !data.matches.length) return null;

  return (
    <Card className="border-brand-sea/25 bg-gradient-to-br from-brand-sea/8 via-white to-brand-cream/60">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-lg sm:text-xl">{t("recommendedRoles.title")}</CardTitle>
          {data.ai_enhanced ? (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t("recommendedRoles.aiMatch")}
            </Badge>
          ) : (
            <Badge variant="outline">{t("recommendedRoles.suggested")}</Badge>
          )}
        </div>
        <CardDescription>{data.headline}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollPanel label={t("recommendedRoles.scrollLabel")}>
          <div className="space-y-2 sm:space-y-3">
            {data.matches.map((match) => (
              <article key={match.role_id} className="rounded-xl border border-brand-sand bg-white p-3 sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-brand-ink">
                        {match.icon} {match.title}
                      </h3>
                      <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-semibold text-brand-sea">
                        {t("common.matchPercent", { score: match.score })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {match.when} · {match.where}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-ink/75">{match.desc}</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-brand-ink/80 sm:text-sm">
                      {match.reasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={saving}
                    onClick={() => onJoin(match.role_id)}
                  >
                    {t("common.join")}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </ScrollPanel>
      </CardContent>
    </Card>
  );
}
