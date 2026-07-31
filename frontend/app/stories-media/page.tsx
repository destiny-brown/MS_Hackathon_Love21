import Image from "next/image";
import Link from "next/link";
import { Award, Briefcase, HandHeart, Medal, Newspaper, Share2, Trophy } from "lucide-react";

import { ElfsightFeeds } from "@/components/media/elfsight-feeds";
import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/media-stories";

import badmintonImage from "./assets/badminton-medals.png";
import karateImage from "./assets/asian-karate-medals.png";
import scmpImage from "./assets/scmp-feature.png";

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
    image:
      "https://love21foundation.com/wp-content/uploads/2026/05/bey0nd-limit_sz-1-1024x604.png",
    link: "https://love21foundation.com/beyond-limits-banquet/",
  },
  {
    id: "raffle-2025",
    title: "Love 21 Foundation Charity Raffle 2025",
    date: "Nov 2025",
    image:
      "https://love21foundation.com/wp-content/uploads/2025/11/raffleinstagram_nologo-1024x1024.png",
    link: "https://love21foundation.com/raffle2025-2/",
  },
  {
    id: "dragon-boat",
    title: "HK Yacht Club & Love 21 Team Up for Dragon Boating",
    date: "Sep 2021",
    image:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.51.15.png",
    link: "https://love21foundation.com/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
  },
  {
    id: "long-happy-life",
    title: "Love 21's Open Secret to a Long, Happy Life",
    date: "Nov 2021",
    image:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.59.49.png",
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
      <PageHero
        title="Stories & Media"
        subtitle="Stories, sports, nutrition and community — achievements, press coverage, and lived experiences in one place."
      />

      <section className="px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-coral/15 text-brand-coral">
              <Trophy className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">So Much Ability</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-coral/40 to-brand-sand" />
          </div>
          <p className="mb-8 max-w-2xl text-brand-ink/75 sm:ml-16">
            Not a disability story — an opportunity story, straight from #SoMuchAbility, Love 21&apos;s own campaign
            hashtag.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {abilityCards.map((card) => (
              <article
                key={card.id}
                className="group overflow-hidden rounded-3xl border border-brand-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-52 w-full bg-brand-cream">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                  <div className="absolute -top-1 left-4 flex h-14 w-10 items-start justify-center bg-brand-coral pt-2 shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
                    <BadgeIcon badge={card.badge} />
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="mb-2 text-lg font-semibold text-brand-ink">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-ink/70">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-coral/15 text-brand-coral">
              <Newspaper className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">Press &amp; Moments</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-coral/40 to-brand-sand" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pressCards.map((card) => (
              <a
                key={card.id}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl border border-brand-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-36 w-full overflow-hidden bg-brand-cream">
                  <Image src={card.image} alt={card.title} fill className="object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-coral/80">{card.date}</span>
                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-brand-ink">{card.title}</h3>
                  <span className="mt-auto text-xs font-semibold text-brand-coral group-hover:underline">Read the story →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-sand bg-brand-cream/40 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-coral/15 text-brand-coral">
              <Share2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">Social Feed</h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-brand-coral/40 to-brand-sand" />
          </div>
          <ElfsightFeeds />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-ink px-8 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-coral/10" aria-hidden="true" />
            <div className="relative z-10">
              <HandHeart className="mx-auto h-10 w-10 text-brand-coral" aria-hidden="true" />
              <h2 className="mt-4 font-serif-display text-2xl sm:text-3xl">Ready to Make a Difference?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Volunteer, donate, or partner with us — there&apos;s a place for you.
              </p>
              <Link
                href="/get-involved"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-ink"
              >
                Get Involved →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="rounded-2xl border border-brand-coral/30 bg-brand-cream/60 p-6 sm:p-8">
            <h2 className="font-serif-display text-2xl text-brand-ink">Learn through real experiences</h2>
            <p className="mt-2 text-brand-ink/75">
              These stories come from Love 21&apos;s media archive — press coverage, interviews, and community events.
              Pair them with our{" "}
              <Link href="/learn-play" className="font-semibold text-brand-coral hover:underline">
                Learn section
              </Link>{" "}
              to connect facts with lived experience.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Press &amp; Interviews</h2>
            <p className="mt-1 text-sm text-brand-ink/65">Click any cover to read the original article.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pressStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-brand-ink">Community Events</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {communityStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/learn-play/resources" className="text-sm font-semibold text-brand-coral hover:underline">
              Browse all stories in Learn →
            </Link>
            <Link href="/media" className="text-sm font-semibold text-brand-coral hover:underline">
              View full media archive →
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
