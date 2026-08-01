"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Blob } from "@/components/brand/Blob";
import { Reveal } from "@/components/brand/Reveal";
import { TriMark } from "@/components/brand/TriMark";
import { MediaStoryCard } from "@/components/learn/media-story-card";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import {
  fourDoors,
  impactStats,
  storySpotlight,
} from "@/lib/site-data";

const scrollViewport = { once: false, amount: 0.2 } as const;

// The "21 Years in Hong Kong" marquee band from the Get Involved page,
// placed here between the hero and the impact dashboard. Uses brand-red.
function YearsMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-brand-slate/30 bg-[#FBEAEA] py-3">
      <Blob className="left-1/4 top-1/2 h-24 w-24 -translate-y-1/2 bg-white/40" />
      <Blob className="right-1/4 top-1/2 h-16 w-16 -translate-y-1/2 bg-brand-red/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FBEAEA] via-transparent to-[#FBEAEA]" />
      <div className="l21-marquee-track">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex shrink-0 items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="mx-5 flex items-center gap-2.5 whitespace-nowrap">
                <span className="font-serif-display text-sm text-brand-dark sm:text-base">
                  21 Years in Hong Kong
                </span>
                <TriMark className="h-1.5 w-5 text-brand-red/50" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-slate">
                  Celebrating Ability
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountUp({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 70,
    damping: 22,
    mass: 0.8,
  });
  const display = useTransform(
    spring,
    (value) => `${Math.round(value).toLocaleString()}${suffix}`,
  );
  const [text, setText] = useState(`0${suffix}`);

  useEffect(() => {
    const unsubscribe = display.on("change", setText);
    return unsubscribe;
  }, [display]);

  useEffect(() => {
    if (inView) {
      motionValue.set(0);
      // Kick the spring on the next frame so re-entry always restarts from 0.
      requestAnimationFrame(() => motionValue.set(target));
    } else {
      motionValue.set(0);
    }
  }, [inView, motionValue, target]);

  return <span>{text}</span>;
}

function ImpactDashboard() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, scrollViewport);
  const cardTilts = ["-rotate-1", "rotate-0", "rotate-1"];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-brand-slate/40 bg-brand-light px-4 py-14 sm:px-6 lg:px-8"
    >
      <Blob className="-top-16 left-1/2 h-64 w-64 -translate-x-1/2 bg-white/50" />
      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-center gap-2.5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-red"
        >
          <TriMark className="h-2 w-7" />
          Live Impact Dashboard
        </motion.p>
        <div className="grid gap-8 sm:grid-cols-3">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`rounded-[28px] bg-white/70 px-6 py-9 text-center shadow-sm shadow-brand-dark/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:rotate-0 hover:shadow-md ${cardTilts[index % cardTilts.length]}`}
            >
              <p className="font-serif-display text-5xl text-brand-dark sm:text-6xl">
                <CountUp
                  target={stat.target}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.13em] text-brand-slate">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FourDoors() {
  const cardAccents = ["bg-brand-red", "bg-brand-dark", "bg-brand-crimson", "bg-brand-dark"];

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
      <Blob className="-right-20 top-10 h-56 w-56 bg-brand-red/5" />
      <div className="relative mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.45 }}
          className="mb-3 text-center font-serif-display text-4xl text-brand-dark sm:text-5xl"
        >
          Where will you begin?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto mb-10 max-w-2xl text-center text-brand-slate"
        >
          Four doors into Love 21 — choose the path that matches how you want to
          support our Down syndrome, autistic, and neurodiverse community.
        </motion.p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fourDoors.map((door, index) => (
            <motion.div
              key={door.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={door.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-slate/50 bg-brand-light p-6 transition-shadow hover:shadow-[0_16px_40px_rgba(43,45,66,0.1)]"
              >
                <span
                  aria-hidden="true"
                  className={`absolute right-0 top-0 h-14 w-14 -translate-y-7 translate-x-7 rotate-45 opacity-10 transition-opacity group-hover:opacity-20 ${cardAccents[index % cardAccents.length]}`}
                />
                <h3 className="relative font-serif-display text-2xl text-brand-dark">
                  {door.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-brand-slate">
                  {door.description}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-brand-red">
                  Enter <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCarousel() {
  const [index, setIndex] = useState(0);
  const story = storySpotlight[index];
  const count = storySpotlight.length;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, scrollViewport);

  function prev() {
    setIndex((current) => (current - 1 + count) % count);
  }

  function next() {
    setIndex((current) => (current + 1) % count);
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-y border-brand-slate/30 bg-brand-light px-14 py-16 sm:px-16 lg:px-14"
    >
      <Blob className="-left-16 top-1/4 h-56 w-56 bg-brand-red/10" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
              Featured Stories
            </p>
            <h2 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">
              Ability in motion
            </h2>
          </motion.div>
        </div>

        <div className="relative">
          <motion.button
            type="button"
            onClick={prev}
            aria-label="Previous story"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="absolute left-0 top-1/2 z-10 inline-flex h-10 w-10 -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 items-center justify-center rounded-full border border-brand-slate/60 bg-transparent text-brand-dark transition hover:border-brand-red hover:text-brand-red"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.article
                key={story.name}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.35 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  if (info.offset.x > 80) prev();
                }}
                whileHover={{ y: -4 }}
                className="grid h-[600px] overflow-hidden rounded-2xl border border-brand-slate/40 bg-white shadow-[0_18px_45px_rgba(43,45,66,0.08)] sm:h-[620px] lg:h-[400px] lg:grid-cols-[1.1fr_0.9fr]"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className="relative h-[240px] shrink-0 lg:h-auto lg:min-h-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </motion.div>
                <div className="flex min-h-0 flex-col justify-center overflow-hidden p-7 sm:p-9">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                    className="line-clamp-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-red"
                  >
                    {story.tag}
                  </motion.p>
                  <motion.blockquote
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.14 }}
                    className="mt-4 line-clamp-6 font-serif-display text-2xl leading-snug text-brand-dark lg:line-clamp-5 sm:text-3xl"
                  >
                    “{story.quote}”
                  </motion.blockquote>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="mt-5 shrink-0 text-sm font-medium text-brand-slate"
                  >
                    {story.name}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.26 }}
                    className="shrink-0"
                  >
                    <Link
                      href={story.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-brand-red transition hover:text-brand-crimson"
                    >
                      Read Story <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            onClick={next}
            aria-label="Next story"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="absolute right-0 top-1/2 z-10 inline-flex h-10 w-10 translate-x-[calc(100%+0.75rem)] -translate-y-1/2 items-center justify-center rounded-full border border-brand-slate/60 bg-transparent text-brand-dark transition hover:border-brand-red hover:text-brand-red"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-5 flex justify-center gap-2"
        >
          {storySpotlight.map((item, i) => (
            <motion.button
              key={item.name}
              type="button"
              aria-label={`Go to story ${i + 1}`}
              onClick={() => setIndex(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-brand-red" : "bg-brand-slate/50 hover:bg-brand-slate"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Keyframes for the "21 Years in Hong Kong" marquee. */}
      <style>{`
        @keyframes l21-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .l21-marquee-track {
          display: flex;
          width: max-content;
          animation: l21-marquee 38s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .l21-marquee-track { animation: none; }
        }
      `}</style>

      {/* Section 1: Hero — full-bleed looping video */}
      <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] min-h-[88vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={scrollViewport}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/videos/love21.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-brand-dark/30"
            aria-hidden="true"
          />
        </motion.div>

        <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.5 }}
            className="font-serif-display text-5xl leading-[1.05] text-brand-red sm:text-6xl lg:text-7xl"
          >
            #SoMuchAbility
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg text-white/95 drop-shadow-sm sm:text-xl"
          >
            Empowering people with Down syndrome, autism, and neurodiversity in
            Hong Kong through sport, nutrition, family support, and holistic
            community care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-8"
          >
            <Button
              asChild
              className="bg-brand-red text-white hover:bg-brand-crimson"
            >
              <Link href="/our-story">
                Discover More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 1.5: 21 Years in Hong Kong — marquee, between the hero and the
          dashboard. No wave shape between the two — the pink band ends and
          the brand-light section starts cleanly, which reads better than the
          curved seam did. */}
      <YearsMarquee />

      {/* Section 2: Live Impact Public Dashboard */}
      <Reveal>
        <ImpactDashboard />
      </Reveal>

      {/* Section 3: Four-Door Navigation */}
      <Reveal>
        <FourDoors />
      </Reveal>

      {/* Section 4: Featured Story Spotlight */}
      <Reveal>
        <StoryCarousel />
      </Reveal>

      {/* Section 5: Celebrating Ability Philosophy */}
      <Reveal>
      <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
        <Blob className="left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-brand-red/5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <p className="flex items-center justify-center gap-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
            <TriMark className="h-2 w-7" />
            Celebrating Ability
          </p>
          <p className="mt-5 font-serif-display text-3xl leading-snug text-brand-dark sm:text-4xl">
            We focus entirely on what our community CAN do — unlocking potential
            through sports, nutrition, and lifelong empowerment.
          </p>
          <Link
            href="/get-involved"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-brand-slate transition hover:text-brand-red"
          >
            Explore Education & Support <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
      </Reveal>

      {/* Section 6: Newsletter (unchanged structure) */}
      <Reveal>
      <section className="relative overflow-hidden bg-brand-dark px-4 py-16 text-brand-light sm:px-6 lg:px-8">
        <Blob className="right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 bg-brand-red/10" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-red">
              Subscribe to our eNews
            </p>
            <h2 className="mt-2 font-serif-display text-4xl sm:text-5xl">
              Stay close to the mission
            </h2>
          </div>
          <NewsletterForm dark />
        </div>
      </section>
      </Reveal>
    </SiteLayout>
  );
}