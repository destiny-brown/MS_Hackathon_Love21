"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { communityQuotes } from "@/lib/community-quotes";

const ROTATE_MS = 7000;

export function CommunityQuotesWall() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const quote = communityQuotes[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % communityQuotes.length);
        setVisible(true);
      }, 300);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-brand-sand bg-brand-ink text-white shadow-sm">
      <div className="border-b border-white/10 bg-white/5 px-5 py-3 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">From the community</p>
      </div>

      <div className="relative px-5 py-8 sm:px-8 sm:py-10">
        <blockquote
          className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <p className="font-serif-display text-2xl leading-snug sm:text-3xl">&ldquo;{quote.quote}&rdquo;</p>
          <footer className="mt-4 text-sm text-white/55">{quote.attribution}</footer>
        </blockquote>

        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <a
            href={quote.storyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-coral hover:underline"
          >
            Read the full story →
          </a>
          <Link href="/learn-play/21-moves" className="font-semibold text-white/80 hover:text-white hover:underline">
            Play today&apos;s 21 Moves
          </Link>
          <Link href={quote.programmeHref} className="font-semibold text-white/80 hover:text-white hover:underline">
            {quote.programmeLabel} →
          </Link>
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          {communityQuotes.map((q, i) => (
            <button
              key={q.id}
              type="button"
              aria-label={`Show quote ${i + 1}`}
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  setIndex(i);
                  setVisible(true);
                }, 150);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-coral" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
