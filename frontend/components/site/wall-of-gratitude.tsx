"use client";

import { useEffect, useState } from "react";

import { api, type GratitudeEntry } from "@/lib/api";

export function WallOfGratitude() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listPublicGratitudeEntries()
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load gratitude entries"));
  }, []);

  return (
    <section
      id="home-gratitude"
      className="scroll-mt-24 bg-brand-cream px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="gratitude-wall-title"
    >      <div className="mx-auto max-w-6xl space-y-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-coral">Wall of Gratitude</p>
          <h2 id="gratitude-wall-title" className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
            Thanks from the Love 21 community
          </h2>
          <p className="mt-4 text-brand-ink/75">
            Approved member messages appear here after admin review, keeping the public wall kind, safe, and celebratory.
          </p>
        </div>

        {error ? <p className="rounded-2xl border border-brand-coral/30 bg-white p-4 text-sm text-brand-coral" role="alert">{error}</p> : null}

        <div className="grid gap-5 md:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-3xl border border-brand-sand bg-white p-6 shadow-sm">
              {entry.photo_url ? (
                <img src={entry.photo_url} alt="" className="mb-4 h-16 w-16 rounded-full object-cover" />
              ) : null}
              <p className="font-serif-display text-2xl leading-snug text-brand-ink">“{entry.message}”</p>
              <p className="mt-4 text-sm font-semibold text-brand-coral">{entry.display_name || "Love 21 member"}</p>
            </article>
          ))}
        </div>

        {entries.length === 0 && !error ? (
          <p className="rounded-2xl border border-brand-sand bg-white p-5 text-center text-sm text-brand-ink/70" role="status">
            Gratitude messages will appear here once approved.
          </p>
        ) : null}
      </div>
    </section>
  );
}
