"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Blob } from "@/components/brand/Blob";
import { Reveal } from "@/components/brand/Reveal";
import { SiteLayout } from "@/components/site/site-layout";
import { useTranslatedMemberStory } from "@/lib/i18n/translated-data";
import { tx } from "@/lib/i18n/translate";
import type { MemberStory } from "@/lib/member-stories";

export function MemberStoryDetail({ story }: { story: MemberStory }) {
  const { t } = useTranslation("media");
  const translated = useTranslatedMemberStory(story.slug, story);
  const hasBody = Boolean(translated.body?.trim());
  const paragraphs = hasBody ? translated.body!.split("\n\n").filter(Boolean) : [];
  const title =
    translated.title ??
    tx(t, `memberStories.stories.${story.slug}.title`, `${translated.name}'s Story`);
  const backLabel = tx(t, "memberStories.backCta", "◄ Back to Stories & Media");

  return (
    <SiteLayout>
      <article className="relative overflow-hidden">
        {/* ---------- Hero ---------- */}
        <header className="relative isolate overflow-hidden border-b border-brand-light/80 bg-gradient-to-b from-[#FFF5F0] via-[#F4F6FB] to-brand-light px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
          <Blob className="story-bubble -left-10 top-6 h-44 w-44 bg-[#FFD4C2]/70 sm:h-56 sm:w-56" />
          <Blob className="story-bubble story-bubble-delay -right-8 top-16 h-40 w-40 bg-brand-red/25 sm:h-52 sm:w-52" />
          <Blob className="story-bubble story-bubble-delay-2 left-1/3 top-0 h-36 w-36 bg-[#B8C5E8]/55 sm:h-48 sm:w-48" />
          <div
            aria-hidden="true"
            className="story-bubble pointer-events-none absolute bottom-8 right-1/4 h-24 w-24 rounded-full bg-[#FFE0D1]/60 blur-2xl sm:h-32 sm:w-32"
          />
          <div
            aria-hidden="true"
            className="story-bubble story-bubble-delay pointer-events-none absolute bottom-4 left-[12%] h-16 w-16 rounded-full bg-[#C5D0F0]/50 blur-xl"
          />

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            <Link
              href="/stories-media#member-stories"
              className="mb-8 text-sm font-semibold text-brand-red transition hover:underline"
            >
              {tx(t, "memberStories.backLink", "◄ Back to Stories & Media")}
            </Link>

            <Reveal>
              <div className="relative mb-8">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#FFD4C2]/80 via-white/40 to-[#B8C5E8]/70 blur-sm"
                />
                <div className="relative h-36 w-36 overflow-hidden rounded-full border-[3px] border-white shadow-[0_12px_40px_rgba(43,45,66,0.18)] sm:h-44 sm:w-44">
                  <Image
                    src={translated.bgImage}
                    alt={translated.name}
                    fill
                    className="object-cover"
                    sizes="176px"
                    priority
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-red/80">
                {tx(t, "memberStories.label", "Member Story")}
              </p>
              <h1 className="mt-3 max-w-3xl font-serif-display text-4xl leading-tight text-brand-dark sm:text-5xl lg:text-[3.25rem]">
                {title}
              </h1>
            </Reveal>
          </div>
        </header>

        {/* ---------- Body ---------- */}
        <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 top-24 h-64 w-64 rounded-full bg-[#FFD4C2]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-[#B8C5E8]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-32 left-[8%] h-40 w-40 rounded-full bg-brand-red/10 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            {hasBody ? (
              <>
                <Reveal>
                  <aside className="relative mb-12 overflow-hidden rounded-3xl border border-brand-light bg-white/90 px-6 py-8 shadow-[0_10px_36px_rgba(43,45,66,0.06)] sm:px-10 sm:py-10">
                    <div
                      aria-hidden="true"
                      className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FFD4C2]/70 blur-[2px]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-[#B8C5E8]/55"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute right-10 top-4 h-10 w-10 rounded-full bg-brand-red/20"
                    />
                    <blockquote className="relative z-10">
                      <p className="font-serif-display text-xl leading-snug text-brand-dark sm:text-2xl">
                        <span className="italic">&ldquo;{translated.quote}&rdquo;</span>
                      </p>
                      <footer className="mt-4 text-sm font-semibold text-brand-red/80">
                        — {translated.name}
                      </footer>
                    </blockquote>
                  </aside>
                </Reveal>

                <div className="space-y-6 text-lg leading-relaxed text-brand-dark/80">
                  {paragraphs.map((paragraph, index) => (
                    <Reveal key={`${story.slug}-p-${index}`} delay={Math.min(index * 0.05, 0.2)}>
                      <p>{paragraph}</p>
                    </Reveal>
                  ))}
                </div>
              </>
            ) : (
              <Reveal>
                <div className="rounded-3xl border border-brand-light bg-white/80 px-8 py-16 text-center shadow-sm">
                  <p className="font-serif-display text-2xl text-brand-dark sm:text-3xl">
                    {tx(t, "memberStories.comingSoon", "Full Story Coming Soon")}
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-dark/70">
                    {t("memberStories.comingSoonBody", {
                      name: translated.name,
                      defaultValue: `We're preparing ${translated.name}'s full story. In the meantime, explore more member voices and media on our Stories & Media page.`,
                    })}
                  </p>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <div className="mt-14 flex justify-center border-t border-brand-light/80 pt-10">
                <Link
                  href="/stories-media#member-stories"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-slate/30 bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:border-brand-red hover:bg-brand-red hover:text-white"
                >
                  {backLabel}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </article>
    </SiteLayout>
  );
}
