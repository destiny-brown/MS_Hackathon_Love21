import Link from "next/link";
import Script from "next/script";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faNewspaper,
  faShareAlt,
  faAward,
  faBriefcase,
  faMedal,
  faHandsHelping,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/media-stories";

// Import images from the same folder
import karateImage from "./assets/asian-karate-medals.png";
import scmpImage from "./assets/scmp-feature.png";
import badmintonImage from "./assets/badminton-medals.png";

const abilityCards = [
  {
    id: "karate",
    title: "Medals on the Asian Stage",
    description:
      "Love 21 athletes stood on the podium at the 22nd Asian Senior Karate Championship's Para-Karate division in Bali, medals around their necks after competing against the region's best.",
    image: karateImage,
    badge: "award",
  },
  {
    id: "job-ready",
    title: "Job-Ready, Proven",
    description:
      "Featured by the South China Morning Post for a job-training programme built to show employers our members are ready for real, purposeful work.",
    image: scmpImage,
    badge: "briefcase",
  },
  {
    id: "badminton",
    title: "Smashing It at Special Olympics",
    description:
      "Our badminton team swept the 50th Special Olympics Hong Kong Badminton Competition, bringing home 5 golds, 1 silver and 1 bronze.",
    image: badmintonImage,
    badge: "medal",
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

export default function StoriesMediaPage() {
  const pressStories = mediaPosts.filter(
    (p) => p.type === "press" || p.type === "interview",
  );
  const communityStories = mediaPosts.filter((p) => p.type === "event");

  return (
    <SiteLayout>
      <PageHero
        title="Stories & Media"
        subtitle="Stories, sports, nutrition & community — all in one place."
      />

      {/* ========== SO MUCH ABILITY ========== */}
      <section className="px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#d4a373]/20 text-[#d4a373]">
              <FontAwesomeIcon icon={faTrophy} className="text-xl" />
            </div>
            <h2 className="font-serif-display text-2xl font-semibold text-[#1e2b2f] sm:text-3xl">
              So Much Ability
            </h2>
            <div className="ml-4 h-[2px] flex-1 bg-gradient-to-r from-[#d4a373] to-[#e6dfd6]"></div>
          </div>
          <p className="mb-8 max-w-2xl font-light text-[#4a4a4a] sm:ml-16">
            Not a disability story — an opportunity story, straight from
            #SoMuchAbility, Love 21&apos;s own campaign hashtag.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {abilityCards.map((card) => (
              <div
                key={card.id}
                className="group overflow-hidden rounded-3xl border border-[#efebe5] bg-white/90 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 w-full bg-gradient-to-br from-[#e7ddcc] to-[#d9cdb8]">
                  <img
                    src={card.image.src}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute -top-1 left-4 h-14 w-10 bg-[#d4a373] shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
                    {card.badge === "award" ? (
                      <FontAwesomeIcon
                        icon={faAward}
                        className="absolute left-1/2 top-2 -translate-x-1/2 text-sm text-white"
                      />
                    ) : card.badge === "briefcase" ? (
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="absolute left-1/2 top-2 -translate-x-1/2 text-sm text-white"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="absolute left-1/2 top-2 -translate-x-1/2 text-sm text-white"
                      />
                    )}
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h4 className="mb-2 text-lg font-bold text-[#1e2b2f]">
                    {card.title}
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-[#4a4a4a]">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRESS & MOMENTS ========== */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#d4a373]/20 text-[#d4a373]">
              <FontAwesomeIcon icon={faNewspaper} className="text-xl" />
            </div>
            <h2 className="font-serif-display text-2xl font-semibold text-[#1e2b2f] sm:text-3xl">
              Press & Moments
            </h2>
            <div className="ml-4 h-[2px] flex-1 bg-gradient-to-r from-[#d4a373] to-[#e6dfd6]"></div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pressCards.map((card) => (
              <a
                key={card.id}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl border border-[#efebe5] bg-white/90 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-36 w-full overflow-hidden bg-[#efe9dd]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#a2794f]">
                    {card.date}
                  </span>
                  <h4 className="mb-2 line-clamp-2 text-sm font-bold text-[#1e2b2f]">
                    {card.title}
                  </h4>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#a2794f] transition group-hover:underline">
                    Read the story{" "}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[10px] transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SOCIAL FEED ========== */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#d4a373]/20 text-[#d4a373]">
              <FontAwesomeIcon icon={faShareAlt} className="text-xl" />
            </div>
            <h2 className="font-serif-display text-2xl font-semibold text-[#1e2b2f] sm:text-3xl">
              Social Feed
            </h2>
            <div className="ml-4 h-[2px] flex-1 bg-gradient-to-r from-[#d4a373] to-[#e6dfd6]"></div>
          </div>

          <div className="mb-6 rounded-3xl border border-[#edebe7] bg-white/90 p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="mb-4 flex items-center justify-between border-b border-[#eee9e2] pb-3">
              <span className="flex items-center gap-2 text-lg font-bold text-[#1e2b2f]">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-2xl text-[#c32aa3]"
                />
                Instagram
              </span>
              <small className="text-sm font-light text-[#7b7b7b]">
                @love21foundation
              </small>
            </div>
            <Script
              src="https://elfsightcdn.com/platform.js"
              strategy="lazyOnload"
            />
            <div
              className="elfsight-app-174d449a-45f4-407a-904d-43c1df129c77"
              data-elfsight-app-lazy
            />
          </div>

          <div className="rounded-3xl border border-[#edebe7] bg-white/90 p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="mb-4 flex items-center justify-between border-b border-[#eee9e2] pb-3">
              <span className="flex items-center gap-2 text-lg font-bold text-[#1e2b2f]">
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="text-2xl text-[#ff0000]"
                />
                YouTube
              </span>
              <small className="text-sm font-light text-[#7b7b7b]">
                Love 21
              </small>
            </div>
            <Script
              src="https://elfsightcdn.com/platform.js"
              strategy="lazyOnload"
            />
            <div
              className="elfsight-app-aacda520-0aaf-4df2-aab9-8cd974d52ca5"
              data-elfsight-app-lazy
            />
          </div>
        </div>
      </section>

      {/* ========== GET INVOLVED ========== */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[40px] bg-[#1e2b2f] px-8 py-12 text-center text-[#f5f3ee] sm:px-12 sm:py-14">
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#d4a373]/10"></div>
            <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-[#d4a373]/5"></div>
            <div className="relative z-10">
              <div className="mb-3 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a373]/20">
                  <FontAwesomeIcon
                    icon={faHandsHelping}
                    className="text-xl text-[#d4a373]"
                  />
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto mb-6 max-w-lg text-sm font-light leading-relaxed text-[#e6e2d8]">
                Volunteer, donate, or partner with us — there&apos;s a place for
                you.
              </p>
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-3 rounded-full bg-[#d4a373] px-8 py-3 text-base font-bold text-[#1e2b2f] transition duration-200 hover:scale-105 hover:bg-[#c08f5c] hover:shadow-lg"
              >
                Get Involved{" "}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LEARN SECTION ========== */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="rounded-2xl border border-[#d4a373] bg-[#faf8f5] p-6 sm:p-8">
            <h2 className="font-serif-display text-2xl text-[#1e2b2f]">
              Learn through real experiences
            </h2>
            <p className="mt-2 text-[#4a4a4a]">
              These stories come from Love 21&apos;s media archive — press
              coverage, interviews, and community events. Pair them with our{" "}
              <Link
                href="/learn-play"
                className="font-semibold text-[#d4a373] transition hover:underline"
              >
                Learn section
              </Link>{" "}
              to connect facts with lived experience.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-[#1e2b2f]">
              Press & Interviews
            </h2>
            <p className="mt-1 text-sm text-[#4a4a4a]">
              Click any cover to read the original article.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pressStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif-display text-3xl text-[#1e2b2f]">
              Community Events
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {communityStories.map((post) => (
                <MediaStoryCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/learn-play/resources"
              className="text-sm font-semibold text-[#d4a373] transition hover:underline"
            >
              Browse all stories in Learn →
            </Link>
            <Link
              href="/media"
              className="text-sm font-semibold text-[#d4a373] transition hover:underline"
            >
              View full media archive →
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
