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

  return (
    <section
      ref={ref}
      className="border-y border-lavender/40 bg-platinum px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-punch"
        >
          Live Impact Dashboard
        </motion.p>
        <div className="grid gap-8 sm:grid-cols-3">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="text-center"
            >
              <p className="font-serif-display text-5xl text-indigo sm:text-6xl">
                <CountUp
                  target={stat.target}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.13em] text-lavender">
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
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.45 }}
          className="mb-3 text-center font-serif-display text-4xl text-indigo sm:text-5xl"
        >
          Where will you begin?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto mb-10 max-w-2xl text-center text-lavender"
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
                className="flex h-full flex-col rounded-2xl border border-lavender/50 bg-platinum p-6 transition-shadow hover:shadow-[0_16px_40px_rgba(43,45,66,0.1)]"
              >
                <h3 className="font-serif-display text-2xl text-indigo">
                  {door.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-lavender">
                  {door.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-punch">
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
      className="border-y border-lavender/30 bg-platinum px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-punch">
              Featured Stories
            </p>
            <h2 className="mt-2 font-serif-display text-4xl text-indigo sm:text-5xl">
              Ability in motion
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="flex gap-2"
          >
            <motion.button
              type="button"
              onClick={prev}
              aria-label="Previous story"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lavender/60 bg-white text-indigo transition hover:border-punch hover:text-punch"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              type="button"
              onClick={next}
              aria-label="Next story"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lavender/60 bg-white text-indigo transition hover:border-punch hover:text-punch"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>

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
              className="grid overflow-hidden rounded-2xl border border-lavender/40 bg-white shadow-[0_18px_45px_rgba(43,45,66,0.08)] lg:grid-cols-[1.1fr_0.9fr]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="relative min-h-[240px] lg:min-h-[360px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.image}
                  alt={story.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </motion.div>
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                  className="text-sm font-semibold uppercase tracking-[0.16em] text-punch"
                >
                  {story.tag}
                </motion.p>
                <motion.blockquote
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.14 }}
                  className="mt-4 font-serif-display text-2xl leading-snug text-indigo sm:text-3xl"
                >
                  “{story.quote}”
                </motion.blockquote>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="mt-5 text-sm font-medium text-lavender"
                >
                  {story.name}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.26 }}
                >
                  <Link
                    href={story.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-punch transition hover:text-flag"
                  >
                    Read Story <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          </AnimatePresence>
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
                i === index ? "bg-punch" : "bg-lavender/50 hover:bg-lavender"
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
            className="absolute inset-0 bg-[#2B2D42]/30"
            aria-hidden="true"
          />
        </motion.div>

        <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.5 }}
            className="font-serif-display text-5xl leading-[1.05] text-[#EF233C] sm:text-6xl lg:text-7xl"
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
              className="bg-[#EF233C] text-white hover:bg-[#D90429]"
            >
              <Link href="/our-story">
                Discover More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Live Impact Public Dashboard */}
      <ImpactDashboard />

      {/* Section 3: Four-Door Navigation */}
      <FourDoors />

      {/* Section 4: Featured Story Spotlight */}
      <StoryCarousel />

      {/* Section 5: Celebrating Ability Philosophy */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-punch">
            Celebrating Ability
          </p>
          <p className="mt-5 font-serif-display text-3xl leading-snug text-indigo sm:text-4xl">
            We focus entirely on what our community CAN do — unlocking potential
            through sports, nutrition, and lifelong empowerment.
          </p>
          <Link
            href="/our-programmes"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-lavender transition hover:text-punch"
          >
            Explore Education & Support <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Section 6: Newsletter (unchanged structure) */}
      <section className="bg-brand-ink px-4 py-16 text-brand-cream sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-coral">
              Subscribe to our eNews
            </p>
            <h2 className="mt-2 font-serif-display text-4xl sm:text-5xl">
              Stay close to the mission
            </h2>
          </div>
          <NewsletterForm dark />
        </div>
      </section>
    </SiteLayout>
  );
}
