import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { boardMembers } from "@/lib/site-data";

export default function BoardOfDirectorsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="BOARD OF DIRECTORS"
        subtitle="Our Board of Directors is comprised of caring individuals from diverse professional backgrounds in Hong Kong, who bring their various talents and passion to support and strengthen Love 21."
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
