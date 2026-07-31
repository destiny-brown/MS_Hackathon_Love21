"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/site/site-layout";
import { useTranslatedBoardMember } from "@/lib/i18n/translated-data";
import type { BoardMember } from "@/lib/site-data";

export function BoardMemberDetail({ member }: { member: BoardMember }) {
  const { t } = useTranslation("governance");
  const translated = useTranslatedBoardMember(member.slug, member);

  return (
    <SiteLayout>
      <section className="border-b border-brand-sand bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/board-of-directors" className="text-sm text-brand-coral hover:underline">
            {t("pages.board.backLink", { defaultValue: "← Board of Directors" })}
          </Link>
          <h1 className="mt-4 font-serif-display text-4xl text-brand-ink">{translated.name}</h1>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-lg leading-relaxed text-brand-ink/80">
            {translated.bio.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
