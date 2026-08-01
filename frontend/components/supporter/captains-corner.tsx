"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";

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

export function CaptainsCorner() {
  const [data, setData] = useState<CaptainsCorner | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getCaptainsCorner()
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load Captain's Corner");
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
      <Card className="border-brand-coral/20 bg-gradient-to-br from-brand-coral/5 via-white to-brand-sea/5">
        <CardContent className="py-8 text-sm text-muted-foreground" role="status">
          Loading Captain&apos;s Corner…
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-brand-sand">
        <CardContent className="py-6 text-sm text-muted-foreground">
          {error || "Captain's Corner is unavailable right now."}
        </CardContent>
      </Card>
    );
  }

  const { play_state: play, captain_message: message, ai_enhanced: aiEnhanced } = data;
  const mood = moodForStreak(play.current_streak);

  return (
    <Card className="overflow-hidden border-brand-coral/25 bg-gradient-to-br from-brand-coral/8 via-white to-brand-cream/60">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center justify-center lg:justify-start">
            <CaptainMascot mood={mood} size={112} pulse={play.current_streak >= 3} label="Captain 21" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">Captain&apos;s Corner</p>
              {aiEnhanced ? (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Captain + AI
                </Badge>
              ) : (
                <Badge variant="outline">Captain</Badge>
              )}
            </div>

            <p className="mt-3 text-lg leading-8 text-brand-ink">{message}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-sand bg-white px-3 py-1.5 font-medium text-brand-ink">
                Day {play.day_number} · {play.location_label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-900">
                <Flame className="h-4 w-4" aria-hidden="true" />
                Streak {play.current_streak}
              </span>
              <span className="inline-flex rounded-full border border-brand-sand bg-white px-3 py-1.5 text-brand-ink/70">
                Best {play.best_streak}
              </span>
              <span className="inline-flex rounded-full border border-brand-sand bg-white px-3 py-1.5 text-brand-ink/70">
                {play.events_remaining} move{play.events_remaining === 1 ? "" : "s"} left today
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/learn-play/21-moves">Continue 21 Moves</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn-play">Explore Learn</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
