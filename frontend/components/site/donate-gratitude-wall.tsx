"use client";

import { useEffect, useState } from "react";

import { api, type GratitudeEntry } from "@/lib/api";

type GratitudeWallCard = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  photo?: string;
  featured?: boolean;
};

const staticMessages: GratitudeWallCard[] = [
  {
    id: "static-1",
    quote:
      "Thank you for the new football boots — I scored my first goal in them!",
    name: "Marcus",
    detail: "19 · Sports programme",
  },
  {
    id: "static-2",
    quote:
      "My mum smiled through my whole graduation speech. Because of you, I had one.",
    name: "Priya",
    detail: "24 · Vocational training",
    photo: "/images/donate/gratitude-3.png",
    featured: true,
  },
  {
    id: "static-3",
    quote: "I made three friends this year. We text every day now.",
    name: "Leo",
    detail: "16 · Community programme",
  },
  {
    id: "static-4",
    quote: "Learning to cook made me feel like an adult for the first time.",
    name: "Hana",
    detail: "21 · Nutrition programme",
    photo: "/images/donate/gratitude-2.png",
  },
  {
    id: "static-5",
    quote: "You helped me get a job interview. I got the job.",
    name: "Kelvin",
    detail: "23 · Vocational training",
    photo: "/images/donate/gratitude-1.png",
  },
  {
    id: "static-6",
    quote:
      "My son laughed with his whole body at swim class today. I hadn't heard that sound in months.",
    name: "Mrs. Chan",
    detail: "Parent",
    featured: true,
  },
  {
    id: "static-7",
    quote:
      'The dragon boat team calls me "Captain" now. I never thought that would be me.',
    name: "Wing",
    detail: "27 · Sports programme",
  },
  {
    id: "static-8",
    quote:
      "For the first time, people ask me for advice, not the other way round.",
    name: "Sabrina",
    detail: "25 · Mentorship programme",
  },
];

const cardRotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function formatApprovedDetail(entry: GratitudeEntry) {
  const approvedAt = entry.moderated_at || entry.submitted_at;
  return `Approved member message · ${new Date(approvedAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  )}`;
}

function toWallCard(entry: GratitudeEntry): GratitudeWallCard {
  return {
    id: `entry-${entry.id}`,
    quote: entry.message,
    name: entry.display_name || "Love 21 member",
    detail: formatApprovedDetail(entry),
    photo: entry.photo_url || undefined,
    featured: Boolean(entry.photo_url),
  };
}

function GratitudeCard({
  message,
  rotate,
}: {
  message: GratitudeWallCard;
  rotate: string;
}) {
  return (
    <div
      className={`group relative mx-3 shrink-0 rounded-3xl bg-white p-7 shadow-[0_2px_16px_rgba(26,26,26,0.04),0_0_0_1px_rgba(26,26,26,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_20px_40px_rgba(26,26,26,0.08),0_0_0_1px_rgba(232,84,62,0.08)] ${rotate} ${message.featured ? "w-[380px]" : "w-[320px]"} ${message.photo ? "pb-7 pt-5" : ""}`}
    >
      <div className="pointer-events-none absolute -top-2.5 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-2 rounded-sm bg-brand-red/10 opacity-70" />
      <div className="pointer-events-none absolute right-5 top-3.5">
        <div className="relative h-2.5 w-2.5 rounded-full bg-brand-red shadow-sm">
          <div className="absolute -top-1 left-1/2 h-1.5 w-px -translate-x-1/2 bg-black/10" />
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-3 font-serif-display text-6xl leading-none text-brand-red/10"
      >
        &ldquo;
      </span>

      {message.photo && (
        <div className="relative mb-5 overflow-hidden rounded-2xl bg-brand-light shadow-inner">
          <img
            src={message.photo}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(26,26,26,0.06)]" />
        </div>
      )}

      <p
        className={`relative z-10 font-serif-display leading-snug text-brand-dark ${message.featured ? "text-xl" : "text-[17px]"}`}
      >
        {message.quote}
      </p>

      <div className="relative z-10 mt-5 border-t border-brand-dark/5 pt-4">
        <p className="text-xs font-bold tracking-wide text-brand-red/90">
          {message.name}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-brand-dark/40">
          {message.detail}
        </p>
      </div>
    </div>
  );
}

function GratitudeMarqueeRow({
  items,
  direction,
}: {
  items: GratitudeWallCard[];
  direction: "left" | "right";
}) {
  const track = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div
        className={`flex w-max ${direction === "left" ? "animate-[wog-scroll_50s_linear_infinite]" : "animate-[wog-scroll_50s_linear_infinite_reverse]"}`}
      >
        {track.map((msg, index) => (
          <GratitudeCard
            key={`${msg.id}-${index}`}
            message={msg}
            rotate={cardRotations[index % cardRotations.length]}
          />
        ))}
      </div>
    </div>
  );
}

export function DonateGratitudeWall() {
  const [approvedEntries, setApprovedEntries] = useState<GratitudeEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listPublicGratitudeEntries()
      .then(setApprovedEntries)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Could not load gratitude entries",
        ),
      );
  }, []);

  const messages = [...approvedEntries.map(toWallCard), ...staticMessages];
  const rowOne = messages.slice(0, 4);
  const rowTwo = messages.slice(4);

  return (
    <section className="relative overflow-hidden border-y border-brand-light bg-brand-light/30">
      <style>{`
        @keyframes wog-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes wog-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        .wog-row:hover .animate-[wog-scroll_50s_linear_infinite],
        .wog-row:hover .animate-[wog-scroll_50s_linear_infinite_reverse] {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[wog-scroll_50s_linear_infinite],
          .animate-[wog-scroll_50s_linear_infinite_reverse] {
            animation: none;
          }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif-display text-[400px] leading-none text-brand-red/[0.03] sm:text-[500px]"
      >
        &ldquo;
      </span>
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-red/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-brand-light blur-3xl" />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[15%] animate-[wog-float_8s_ease-in-out_infinite] text-lg text-brand-red/[0.06]"
      >
        ♥
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[60%] animate-[wog-float_8s_ease-in-out_2s_infinite] text-sm text-brand-red/[0.05]"
      >
        ♥
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-[30%] animate-[wog-float_8s_ease-in-out_4s_infinite] text-xl text-brand-red/[0.05]"
      >
        ♥
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[20%] left-[12%] animate-[wog-float_8s_ease-in-out_1s_infinite] text-base text-brand-red/[0.06]"
      >
        ♥
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[3%] top-[70%] animate-[wog-float_8s_ease-in-out_3s_infinite] text-xs text-brand-red/[0.05]"
      >
        ♥
      </span>

      <div className="relative z-10 px-4 pt-20 text-center sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto mb-6 h-0.5 w-16 bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
          <p className="flex justify-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-coral">
            Wall of Gratitude
          </p>
          <h2 className="mt-3 font-serif-display text-4xl leading-[1.1] text-brand-dark sm:text-5xl">
            Every gift becomes
            <br />
            someone&apos;s <em className="text-brand-red">good day</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-dark/60">
            These are real moments from the Love 21 community — made possible by
            donors who chose to show up. Your gift doesn&apos;t just fund
            programmes. It funds <em className="text-brand-dark/80">firsts</em>.
          </p>
        </div>
      </div>

      {error ? (
        <div className="relative z-10 mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-8">
          <p
            className="rounded-2xl border border-brand-coral/30 bg-white p-4 text-sm text-brand-coral"
            role="alert"
          >
            {error}
          </p>
        </div>
      ) : null}

      <div className="relative z-10 mt-14 space-y-5">
        <div className="wog-row">
          <GratitudeMarqueeRow items={rowOne} direction="left" />
        </div>
        <div className="wog-row">
          <GratitudeMarqueeRow items={rowTwo} direction="right" />
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-14 max-w-3xl px-4 pb-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-brand-red/10 bg-white/80 px-8 py-7 shadow-sm backdrop-blur-sm">
          <p className="max-w-md text-sm leading-relaxed text-brand-dark/60">
            <strong className="text-brand-dark">
              Your name could be the reason someone&apos;s story changes.
            </strong>{" "}
            Every message on this wall started with a single decision to give.
          </p>
          <a
            href="/donate#donation-form"
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-red/90"
          >
            Become a donor
          </a>
        </div>
      </div>

      <p className="relative z-10 px-4 pb-16 pt-8 text-center text-xs text-brand-dark/30 sm:px-6 lg:px-8">
        <span className="mb-2 block text-brand-red/30">♥</span>
        Messages and photos shared with permission from members and families.
        <br />
        Names shortened for privacy.
      </p>
    </section>
  );
}
