"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { useTranslatedBoardMembers } from "@/lib/i18n/translated-data";

export default function BoardOfDirectorsPage() {
  const { t } = useTranslation("governance");
  const boardMembers = useTranslatedBoardMembers();

  return (
    <SiteLayout>
      <PageHero
        title={t("pages.board.title", { defaultValue: "BOARD OF DIRECTORS" })}
        subtitle={t("pages.board.subtitle", {
          defaultValue:
            "Our Board of Directors is comprised of caring individuals from diverse professional backgrounds in Hong Kong, who bring their various talents and passion to support and strengthen Love 21.",
        })}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boardMembers.map((member) => (
            <Link
              key={member.slug}
              href={`/board-of-directors/${member.slug}`}
              className="rounded-2xl border border-brand-sand bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-brand-ink">{member.name}</h2>
              <p className="mt-2 text-sm text-brand-ink/70">{member.bio.slice(0, 120)}…</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
