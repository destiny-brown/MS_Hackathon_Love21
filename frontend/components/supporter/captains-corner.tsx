"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CaptainMascot } from "@/components/learn/captain-mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, type CaptainsCorner } from "@/lib/api";
import type { CaptainMood } from "@/lib/captain-character";

function moodForStreak(streak: number): CaptainMood {
  if (streak >= 4) return "cheering";
  if (streak > 0) return "happy";
  return "idle";
}

type CaptainsCornerProps = {
  audience?: "supporter" | "member";
};

export function CaptainsCorner({ audience = "supporter" }: CaptainsCornerProps) {
  const { t } = useTranslation("dashboard");
  const [data, setData] = useState<CaptainsCorner | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const request =
      audience === "member" ? api.getMemberCaptainsCorner() : api.getCaptainsCorner();
    request
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("captainsCorner.loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [audience, t]);

  if (loading) {
    return (
      <Card className="border-brand-coral/20 bg-gradient-to-br from-brand-coral/5 via-white to-brand-sea/5">
        <CardContent className="py-6 text-sm text-muted-foreground sm:py-8" role="status">
          {t("captainsCorner.loading")}
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-brand-sand">
        <CardContent className="py-6 text-sm text-muted-foreground">
          {error || t("captainsCorner.unavailable")}
        </CardContent>
      </Card>
    );
  }

  const { play_state: play, captain_message: message, ai_enhanced: aiEnhanced } = data;
  const mood = moodForStreak(play.current_streak);

  return (
    <Card className="overflow-hidden border-brand-coral/25 bg-gradient-to-br from-brand-coral/8 via-white to-brand-cream/60">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center justify-center lg:justify-start">
            <CaptainMascot mood={mood} size={96} pulse={play.current_streak >= 3} label={t("captainsCorner.captainLabel")} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">{t("captainsCorner.title")}</p>
              {aiEnhanced ? (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {t("captainsCorner.aiBadge")}
                </Badge>
              ) : (
                <Badge variant="outline">{t("captainsCorner.captainBadge")}</Badge>
              )}
            </div>

            <p className="mt-2 text-base leading-7 text-brand-ink sm:mt-3 sm:text-lg sm:leading-8">{message}</p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="inline-flex items-center rounded-full border border-brand-sand bg-white px-2.5 py-1 font-medium text-brand-ink sm:px-3 sm:py-1.5">
                {t("captainsCorner.dayLocation", { day: play.day_number, location: play.location_label })}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-900 sm:px-3 sm:py-1.5">
                <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                {t("captainsCorner.streak", { count: play.current_streak })}
              </span>
              <span className="inline-flex rounded-full border border-brand-sand bg-white px-2.5 py-1 text-brand-ink/70 sm:px-3 sm:py-1.5">
                {t("captainsCorner.movesLeft", { count: play.events_remaining })}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <Button asChild size="sm" className="sm:h-10">
                <Link href="/learn-play/21-moves">{t("captainsCorner.continueMoves")}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="sm:h-10">
                <Link href="/learn-play">{t("captainsCorner.exploreLearn")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
