"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Apple,
  Download,
  Flame,
  HeartHandshake,
  Lock,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/site-layout";
import {
  donorBadges,
  donorImpactStats,
  donorMetamorphosis,
  donorProfile,
  impactFeed,
  pillarAllocation,
  type DonorBadge,
} from "@/lib/donor-dashboard-data";

function BadgeIcon({ icon }: { icon: DonorBadge["icon"] }) {
  const className = "h-5 w-5";
  switch (icon) {
    case "trophy":
      return <Trophy className={className} />;
    case "flame":
      return <Flame className={className} />;
    case "apple":
      return <Apple className={className} />;
    default:
      return <Lock className={className} />;
  }
}

function AllocationDonut() {
  let cursor = 0;
  const segments = pillarAllocation.map((item) => {
    const start = cursor;
    cursor += item.value;
    return { ...item, start, end: cursor };
  });
  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.end}%`)
    .join(", ");

  return (
    <div className="relative mx-auto h-44 w-44">
      <div
        className="h-full w-full rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
        role="img"
        aria-label="Pillar allocation donut chart"
      />
      <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white text-center">
        <p className="font-serif-display text-2xl text-brand-ink">5</p>
        <p className="text-[10px] uppercase tracking-[0.14em] text-brand-ink/55">
          Pillars
        </p>
      </div>
    </div>
  );
}

export default function MyDonationsPage() {
  return (
    <SiteLayout>
      {/* Header banner */}
      <section className="border-b border-brand-sand bg-gradient-to-br from-white via-brand-cream to-brand-sand/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">
              <HeartHandshake className="h-3.5 w-3.5" />
              Personal Donor Dashboard
            </p>
            <h1 className="mt-3 font-serif-display text-3xl text-brand-ink sm:text-4xl">
              Welcome back, {donorProfile.name}!
            </h1>
            <p className="mt-2 max-w-xl text-brand-ink/70">
              {donorProfile.welcomeQuote}
            </p>
          </motion.div>
          <Button
            asChild
            className="shrink-0 bg-brand-coral text-white hover:bg-brand-coral/90"
          >
            <Link href="/donate">Make a New Donation</Link>
          </Button>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Top stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-sea">
                Total Direct Impact
              </p>
              <p className="mt-3 font-serif-display text-4xl text-brand-ink">
                ${donorImpactStats.totalDonated.toLocaleString()}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-serif-display text-2xl text-[#E86A45]">
                    {donorImpactStats.sessionsUnlocked}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand-ink/55">
                    Sessions Unlocked
                  </p>
                </div>
                <div>
                  <p className="font-serif-display text-2xl text-[#2A7A7B]">
                    {donorImpactStats.mealsFunded}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand-ink/55">
                    Meals Funded
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">
                    Metamorphosis Level
                  </p>
                  <h2 className="mt-2 font-serif-display text-2xl text-brand-ink sm:text-3xl">
                    Level {donorMetamorphosis.level}: {donorMetamorphosis.title}
                  </h2>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={donorMetamorphosis.badgeImage}
                  alt=""
                  className="h-14 w-14 object-contain"
                />
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-brand-ink/65">
                  <span>Progress</span>
                  <span>
                    {donorMetamorphosis.progressPercent}% to{" "}
                    {donorMetamorphosis.nextTier}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-brand-sand/50">
                  <motion.div
                    className="h-full rounded-full bg-[#E86A45]"
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${donorMetamorphosis.progressPercent}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.article>
          </div>

          {/* Middle grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-sea">
                Pillar Allocation
              </p>
              <h2 className="mt-2 font-serif-display text-2xl text-brand-ink">
                Where your gifts grow
              </h2>
              <div className="mt-6">
                <AllocationDonut />
                <ul className="mt-6 space-y-2">
                  {pillarAllocation.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-2 text-brand-ink/80">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold text-brand-ink">
                        {item.value}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm"
            >
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">
                <Sparkles className="h-3.5 w-3.5" />
                Achievements & Badges
              </p>
              <h2 className="mt-2 font-serif-display text-2xl text-brand-ink">
                Collectible milestones
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {donorBadges.map((badge) => {
                  const unlocked = badge.status === "unlocked";
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-xl border p-4 ${
                        unlocked
                          ? "border-brand-sand bg-brand-cream/50"
                          : "border-dashed border-brand-sand bg-white opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            unlocked
                              ? "bg-[#E86A45]/15 text-[#E86A45]"
                              : "bg-brand-sand/40 text-brand-ink/45"
                          }`}
                        >
                          <BadgeIcon icon={badge.icon} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-brand-ink">
                            {badge.title}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-brand-ink/50">
                            {unlocked ? "Unlocked" : "In Progress"}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-brand-ink/70">
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          </div>

          {/* Bottom feed + tax */}
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.85fr]">
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-sea">
                My Impact Story Feed
              </p>
              <h2 className="mt-2 font-serif-display text-2xl text-brand-ink">
                Real updates from your giving
              </h2>
              <ol className="mt-6 space-y-4">
                {impactFeed.map((item, i) => (
                  <li key={item.id} className="relative flex gap-4 pl-2">
                    <div className="flex flex-col items-center">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#E86A45]" />
                      {i < impactFeed.length - 1 ? (
                        <span className="mt-1 w-px flex-1 bg-brand-sand" />
                      ) : null}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-brand-ink/50">
                        {item.date}
                      </p>
                      <p className="mt-1 font-semibold text-brand-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-brand-ink/75">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.article>

            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 p-6 text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #2A7A7B 0%, #1A2B3D 100%)",
              }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Quick Action
                </p>
                <h2 className="mt-2 font-serif-display text-3xl">
                  2026 Tax Receipts
                </h2>
                <p className="mt-3 text-sm text-white/80">
                  Download a combined PDF of your official receipts for this
                  giving year.
                </p>
              </div>
              <Button
                type="button"
                className="mt-8 border border-white/35 bg-white/15 text-white shadow-none backdrop-blur-md hover:bg-white/25 hover:text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download All Receipts (PDF)
              </Button>
            </motion.aside>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
