"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Award, Briefcase, HandHeart, HeartHandshake, Medal, Newspaper, Share2, Trophy, Youtube } from "lucide-react";

import { Reveal } from "@/components/brand/Reveal";
import { ElfsightFeeds } from "@/components/media/elfsight-feeds";
import { MediaStoryCard } from "@/components/learn/media-story-card";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { PageSectionNav, type PageSectionNavItem } from "@/components/site/page-section-nav";
import { SiteLayout } from "@/components/site/site-layout";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { mediaPosts } from "@/lib/media-stories";

import badmintonImage from "./assets/badminton-medals.png";
import karateImage from "./assets/asian-karate-medals.png";
import scmpImage from "./assets/scmp-feature.png";

const sectionNavItems: PageSectionNavItem[] = [
  { id: "so-much-ability", label: "Ability", labelKey: "sectionNav.ability" },
  { id: "member-stories", label: "Stories", labelKey: "sectionNav.stories" },
  { id: "press-moments", label: "Press", labelKey: "sectionNav.press" },
  { id: "social-feed", label: "Social", labelKey: "sectionNav.social" },
  { id: "youtube", label: "Youtube", labelKey: "sectionNav.youtube" },
];

const abilityCardMeta = [
  { id: "karate", image: karateImage, badge: "award" as const },
  { id: "job-ready", image: scmpImage, badge: "briefcase" as const },
  { id: "badminton", image: badmintonImage, badge: "medal" as const },
];

const pressCardMeta = [
  {
    id: "beyond-limits",
    image: "/images/press/beyondlimits.png",
    link: "https://love21foundation.com/beyond-limits-banquet/",
  },
  {
    id: "raffle-2025",
    image: "/images/press/rafflebanner.png",
    link: "https://love21foundation.com/raffle2025-2/",
  },
  {
    id: "dragon-boat",
    image: "/images/press/dragonboat.png",
    link: "https://love21foundation.com/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
  },
  {
    id: "long-happy-life",
    image: "/images/press/longhappylife.png",
    link: "https://love21foundation.com/love-21s-open-secret-to-a-long-happy-life/",
  },
];

function BadgeIcon({ badge }: { badge: "award" | "briefcase" | "medal" }) {
  const className = "h-4 w-4 text-white";
  if (badge === "award") return <Award className={className} aria-hidden="true" />;
  if (badge === "briefcase") return <Briefcase className={className} aria-hidden="true" />;
  return <Medal className={className} aria-hidden="true" />;
}

export default function StoriesMediaPage() {
  const { t } = useTranslation("media");
  const pressStories = mediaPosts.filter((post) => post.type === "press" || post.type === "interview");
  const communityStories = mediaPosts.filter((post) => post.type === "event");

  const abilityCards = useMemo(
    () =>
      abilityCardMeta.map((card) => ({
        ...card,
        title: t(`abilityCards.${card.id}.title`),
        description: t(`abilityCards.${card.id}.description`),
      })),
    [t],
  );

  const pressCards = useMemo(
    () =>
      pressCardMeta.map((card) => ({
        ...card,
        title: t(`pressCards.${card.id}.title`),
        date: t(`pressCards.${card.id}.date`),
      })),
    [t],
  );

  return (
    <SiteLayout>
      <Reveal>
        <TranslatedPageHero
          id="stories-media-hero"
          titleKey="storiesMedia.title"
          className="border-b-0 pb-8"
        />
      </Reveal>

      <PageSectionNav items={sectionNavItems} ns="media" heroSelector="#stories-media-hero" />

      <Reveal>
        <section id="so-much-ability" className="scroll-mt-24 bg-white px-4 pb-12 pt-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                <Trophy className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">{t("sections.soMuchAbility.title")}</h2>
              <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
            </div>
            <p className="mb-8 max-w-2xl text-brand-dark/75 sm:ml-16">{t("sections.soMuchAbility.introMedia")}</p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {abilityCards.map((card) => (
                <article
                  key={card.id}
                  className="group overflow-hidden rounded-3xl border border-brand-light bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-52 w-full bg-brand-light">
                    <Image src={card.image} alt={card.title} fill className="object-cover" />
                    <div className="absolute -top-1 left-4 flex h-14 w-10 items-start justify-center bg-brand-red pt-2 shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
                      <BadgeIcon badge={card.badge} />
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="mb-2 text-lg font-semibold text-brand-dark">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-brand-dark/70">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="member-stories" className="scroll-mt-24 bg-brand-light px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                <HeartHandshake className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">{t("sections.memberStories.title")}</h2>
              <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
            </div>
            <p className="mb-8 max-w-2xl text-brand-dark/75 sm:ml-16">{t("sections.memberStories.intro")}</p>

            <TestimonialCarousel />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="press-moments" className="scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                <Newspaper className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">{t("sections.pressMoments.title")}</h2>
              <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pressCards.map((card) => (
                <a
                  key={card.id}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-3xl border border-brand-light bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-brand-light">
                    <Image src={card.image} alt={card.title} fill className="object-cover transition group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <span className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-red/80">{card.date}</span>
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-brand-dark">{card.title}</h3>
                    <span className="mt-auto text-xs font-semibold text-brand-red group-hover:underline">{t("sections.pressMoments.readStory")}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
      <section id="social-feed" className="scroll-mt-24 border-t border-brand-light bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
              <Share2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">{t("sections.socialFeed.title")}</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
          </div>
          <ElfsightFeeds platforms={["instagram"]} />
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section id="youtube" className="scroll-mt-24 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
              <Youtube className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">{t("sectionNav.youtube")}</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
          </div>
          <ElfsightFeeds platforms={["youtube"]} />
        </div>
      </section>
      </Reveal>

      <Reveal>
        <section className="bg-white px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white px-8 py-12 text-center text-brand-dark sm:px-12 sm:py-14">
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-red/10" aria-hidden="true" />
              <div className="relative z-10">
                <HandHeart className="mx-auto h-10 w-10 text-brand-red" aria-hidden="true" />
                <h2 className="mt-4 font-serif-display text-2xl sm:text-3xl">{t("cta.readyTitle")}</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-dark/70">{t("cta.readyBodyMedia")}</p>
                <Link
                  href="/get-involved"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  {t("cta.getInvolved")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-white px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif-display text-2xl text-brand-dark">{t("sections.learnExperiences.title")}</h2>
            <p className="mt-2 text-brand-dark/75">
              {t("sections.learnExperiences.body")}{" "}
              <Link href="/learn-play" className="font-semibold text-brand-red hover:underline">
                {t("sections.learnExperiences.learnLink")}
              </Link>{" "}
              {t("sections.learnExperiences.bodyEnd")}
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-white px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif-display text-3xl text-brand-dark">{t("sections.pressInterviews.title")}</h2>
            <p className="mt-1 text-sm text-brand-dark/65">{t("sections.pressInterviews.subtitle")}</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pressStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            <div>
              <h2 className="font-serif-display text-3xl text-brand-dark">{t("sections.communityEvents.title")}</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {communityStories.map((post) => (
                  <MediaStoryCard key={post.slug} post={post} />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/learn-play/resources" className="text-sm font-semibold text-brand-red hover:underline">
                {t("cta.browseStories")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
