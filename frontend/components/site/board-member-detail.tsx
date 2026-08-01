"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/site/site-layout";
import { useTranslatedBoardMember } from "@/lib/i18n/translated-data";
import { boardMemberImage, type BoardMember } from "@/lib/site-data";

const FALLBACK_SRC = "/images/board/templateicon.png";

export function BoardMemberDetail({ member }: { member: BoardMember }) {
  const { t } = useTranslation("governance");
  const translated = useTranslatedBoardMember(member.slug, member);
  const [src, setSrc] = useState(boardMemberImage(member));

  return (
    <SiteLayout>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/board-of-directors" className="text-sm text-brand-red hover:underline">
            {t("pages.board.backLink", { defaultValue: "← Board of Directors" })}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden lg:max-w-none">
              <Image
                src={src}
                alt={translated.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={() => {
                  if (src !== FALLBACK_SRC) setSrc(FALLBACK_SRC);
                }}
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-red/80">
                {translated.role ?? member.role ?? "Board Member"}
              </p>
              <h1 className="mt-2 font-serif-display text-4xl text-brand-dark sm:text-5xl">
                {translated.name}
              </h1>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-brand-dark/80">
                {translated.bio.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
