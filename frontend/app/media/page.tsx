"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Briefcase, HandHeart, Instagram, Medal, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ElfsightFeeds } from "@/components/media/elfsight-feeds";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const abilityCardIds = ["karate", "job-ready", "badminton"] as const;
const abilityImages: Record<typeof abilityCardIds[number], string> = {
  karate: "/media/assets/asian-karate-medals.png",
  "job-ready": "/media/assets/scmp-feature.png",
  badminton: "/media/assets/badminton-medals.png",
};
const abilityBadges: Record<typeof abilityCardIds[number], "award" | "briefcase" | "medal"> = {
  karate: "award",
  "job-ready": "briefcase",
  badminton: "medal",
};

const pressCardIds = [
  "beyond-limits",
  "raffle-2025",
  "dragon-boat",
  "long-happy-life",
] as const;

const pressLinks: Record<typeof pressCardIds[number], { image: string; link: string }> = {
  "beyond-limits": {
    image: "https://love21foundation.com/wp-content/uploads/2026/05/bey0nd-limit_sz-1-1024x604.png",
    link: "https://love21foundation.com/beyond-limits-banquet/",
  },
  "raffle-2025": {
    image: "https://love21foundation.com/wp-content/uploads/2025/11/raffleinstagram_nologo-1024x1024.png",
    link: "https://love21foundation.com/raffle2025-2/",
  },
  "dragon-boat": {
    image: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.51.15.png",
    link: "https://love21foundation.com/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
  },
  "long-happy-life": {
    image: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.59.49.png",
    link: "https://love21foundation.com/love-21s-open-secret-to-a-long-happy-life/",
  },
};

function BadgeIcon({ badge }: { badge: "award" | "briefcase" | "medal" }) {
  const className = "h-4 w-4 text-white";
  if (badge === "award") return <Award className={className} aria-hidden="true" />;
  if (badge === "briefcase") return <Briefcase className={className} aria-hidden="true" />;
  return <Medal className={className} aria-hidden="true" />;
}

export default function MediaPage() {
  const { t } = useTranslation("media");

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.media.title")}
        subtitle={t("hero.media.subtitle")}
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <Award className="h-8 w-8 text-brand-coral" aria-hidden="true" />
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">
              {t("sections.soMuchAbility.title")}
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-coral/40 to-brand-sand" />
          </div>
          <p className="mb-8 max-w-2xl text-brand-ink/75 sm:ml-11">
            {t("sections.soMuchAbility.introMedia")}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {abilityCardIds.map((id) => (
              <article
                key={id}
                className="group overflow-hidden rounded-3xl border border-brand-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-40 bg-brand-cream">
                  <Image
                    src={abilityImages[id]}
                    alt={t(`abilityCards.${id}.title`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -top-1 left-4 flex h-14 w-10 items-start justify-center bg-brand-coral pt-2 shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
                    <BadgeIcon badge={abilityBadges[id]} />
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg font-semibold text-brand-ink">
                    {t(`abilityCards.${id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink/70">
                    {t(`abilityCards.${id}.description`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-sand px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-brand-coral" aria-hidden="true" />
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">
              {t("sections.pressMoments.title")}
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-coral/40 to-brand-sand" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pressCardIds.map((id) => (
              <a
                key={id}
                href={pressLinks[id].link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl border border-brand-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-36 overflow-hidden bg-brand-cream">
                  <Image
                    src={pressLinks[id].image}
                    alt={t(`pressCards.${id}.title`)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-coral/80">
                    {t(`pressCards.${id}.date`)}
                  </span>
                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-brand-ink">
                    {t(`pressCards.${id}.title`)}
                  </h3>
                  <span className="mt-auto text-xs font-semibold text-brand-coral group-hover:underline">
                    {t("sections.pressMoments.readStory")}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-sand bg-brand-cream/40 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <Instagram className="h-8 w-8 text-brand-coral" aria-hidden="true" />
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">
              {t("sections.socialFeed.title")}
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-coral/40 to-brand-sand" />
          </div>
          <ElfsightFeeds />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-ink px-6 py-12 text-center text-white sm:px-8 sm:py-16">
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-brand-coral/10" aria-hidden="true" />
            <div className="relative z-10">
              <HandHeart className="mx-auto h-10 w-10 text-brand-coral" aria-hidden="true" />
              <h2 className="mt-4 font-serif-display text-2xl sm:text-3xl">
                {t("cta.readyTitle")}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                {t("cta.readyBodyMedia")}
              </p>
              <Link
                href="/get-involved"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-ink"
              >
                {t("cta.getInvolved")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
