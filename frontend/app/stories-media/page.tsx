import Image from "next/image";
import Link from "next/link";
import { Award, Briefcase, HandHeart, HeartHandshake, Medal, Newspaper, Share2, Trophy, Youtube } from "lucide-react";

import { Reveal } from "@/components/brand/Reveal";
import { ElfsightFeeds } from "@/components/media/elfsight-feeds";
import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { PageSectionNav, type PageSectionNavItem } from "@/components/site/page-section-nav";
import { SiteLayout } from "@/components/site/site-layout";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { mediaPosts } from "@/lib/media-stories";

import badmintonImage from "./assets/badminton-medals.png";
import karateImage from "./assets/asian-karate-medals.png";
import scmpImage from "./assets/scmp-feature.png";

const sectionNavItems: PageSectionNavItem[] = [
  { id: "so-much-ability", label: "Ability" },
  { id: "member-stories", label: "Stories" },
  { id: "press-moments", label: "Press" },
  { id: "social-feed", label: "Social" },
  { id: "youtube", label: "Youtube" },
];

const abilityCards = [
  {
    id: "karate",
    title: "Medals on the Asian Stage",
    description:
      "Love 21 athletes stood on the podium at the 22nd Asian Senior Karate Championship's Para-Karate division in Bali, medals around their necks after competing against the region's best.",
    image: karateImage,
    badge: "award" as const,
  },
  {
    id: "job-ready",
    title: "Job-Ready, Proven",
    description:
      "Featured by the South China Morning Post for a job-training programme built to show employers our members are ready for real, purposeful work.",
    image: scmpImage,
    badge: "briefcase" as const,
  },
  {
    id: "badminton",
    title: "Smashing It at Special Olympics",
    description:
      "Our badminton team swept the 50th Special Olympics Hong Kong Badminton Competition, bringing home 5 golds, 1 silver and 1 bronze.",
    image: badmintonImage,
    badge: "medal" as const,
  },
];

const pressCards = [
  {
    id: "beyond-limits",
    title: "Tables & Seats Now Open for Beyond Limits Banquet",
    date: "May 2026",
    image: "/images/press/beyondlimits.png",
    link: "https://love21foundation.com/beyond-limits-banquet/",
  },
  {
    id: "raffle-2025",
    title: "Love 21 Foundation Charity Raffle 2025",
    date: "Nov 2025",
    image: "/images/press/rafflebanner.png",
    link: "https://love21foundation.com/raffle2025-2/",
  },
  {
    id: "dragon-boat",
    title: "HK Yacht Club & Love 21 Team Up for Dragon Boating",
    date: "Sep 2021",
    image: "/images/press/dragonboat.png",
    link: "https://love21foundation.com/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
  },
  {
    id: "long-happy-life",
    title: "Love 21's Open Secret to a Long, Happy Life",
    date: "Nov 2021",
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
  const pressStories = mediaPosts.filter((post) => post.type === "press" || post.type === "interview");
  const communityStories = mediaPosts.filter((post) => post.type === "event");

  return (
    <SiteLayout>
      <Reveal>
        <PageHero id="stories-media-hero" title="Stories & Media" className="border-b-0 pb-8" />
      </Reveal>

      <PageSectionNav items={sectionNavItems} heroSelector="#stories-media-hero" />

      <Reveal>
      <section id="so-much-ability" className="scroll-mt-24 bg-white px-4 pb-12 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
              <Trophy className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">So Much Ability</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
          </div>
          <p className="mb-8 max-w-2xl text-brand-dark/75 sm:ml-16">
            Not a disability story — an{" "}
            <span className="font-serif-display italic text-brand-red">opportunity</span>{" "}
            story, straight from{" "}
            <span className="font-serif-display italic text-brand-red">#SoMuchAbility</span>, Love 21&apos;s own campaign
            hashtag.
          </p>

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

      <section id="member-stories" className="scroll-mt-24 bg-brand-light px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
              <HeartHandshake className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">Member Stories</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
          </div>
          <p className="mb-8 max-w-2xl text-brand-dark/75 sm:ml-16">
            Voices from{" "}
            <span className="font-serif-display italic text-brand-red">families and members</span>
            {" "}— the everyday moments that make Love 21 feel like{" "}
            <span className="font-serif-display italic text-brand-red">home</span>.
          </p>

          <TestimonialCarousel />
        </div>
      </section>

      <section id="press-moments" className="scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
              <Newspaper className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">Press &amp; Moments</h2>
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
                  <span className="mt-auto text-xs font-semibold text-brand-red group-hover:underline">Read the story →</span>
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
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">Social Feed</h2>
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
            <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">Youtube</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-red/40 to-brand-light" />
          </div>
          <ElfsightFeeds platforms={["youtube"]} />
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-dark px-8 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-red/10" aria-hidden="true" />
            <div className="relative z-10">
              <HandHeart className="mx-auto h-10 w-10 text-brand-red" aria-hidden="true" />
              <h2 className="mt-4 font-serif-display text-2xl sm:text-3xl">Ready to Make a Difference?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Volunteer, donate, or partner with us — there&apos;s a place for you.
              </p>
              <Link
                href="/get-involved"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-dark"
              >
                Get Involved →
              </Link>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="rounded-2xl border border-brand-red/30 bg-brand-light/60 p-6 sm:p-8">
            <h2 className="font-serif-display text-2xl text-brand-dark">Learn through real experiences</h2>
            <p className="mt-2 text-brand-dark/75">
              These stories come from Love 21&apos;s media archive — press coverage, interviews, and community events.
              Pair them with our{" "}
              <Link href="/learn-play" className="font-semibold text-brand-red hover:underline">
                Learn section
              </Link>{" "}
              to connect facts with lived experience.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-dark">Press &amp; Interviews</h2>
            <p className="mt-1 text-sm text-brand-dark/65">Click any cover to read the original article.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pressStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-dark">Community Events</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {communityStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/learn-play/resources" className="text-sm font-semibold text-brand-red hover:underline">
              Browse all stories in Learn →
            </Link>
          </div>
        </div>
      </section>
      </Reveal>
    </SiteLayout>
  );
}
