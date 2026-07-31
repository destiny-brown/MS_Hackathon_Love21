import Link from "next/link";

import { CommunityQuotesWall } from "@/components/learn/community-quotes-wall";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const resources = [
  {
    title: "21 Moves",
    description:
      "Bust today's myth, practise a real inclusion skill, and journey across Hong Kong with Captain 21.",
    href: "/learn-play/21-moves",
    badge: "Daily",
  },
  {
    title: "Myth vs Fact Quiz",
    description:
      "A quick 10-question quiz to test what you know about autism, Down syndrome, ADHD, and inclusive practices.",
    href: "/learn-play/quiz",
    badge: "Quiz",
  },
  {
    title: "Short Videos",
    description: "Neurodiversity education clips for families, volunteers, and community partners.",
    href: "/learn-play/short-videos",
    badge: "Video",
  },
  {
    title: "Resources",
    description:
      "Love 21 archive and further reading — real stories and curated neurodiversity articles.",
    href: "/learn-play/resources",
    badge: "Stories",
  },
];

export default function LearnPlayPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Learn"
        subtitle="Educate through shared experiences — bust myths, hear from the community, and go deeper with real stories."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <CommunityQuotesWall />

          <p className="max-w-3xl text-center text-base text-brand-ink/70 sm:mx-auto">
            Every myth we bust connects to a real Love 21 story — and a way to{" "}
            <Link href="/get-involved" className="font-semibold text-brand-coral hover:underline">
              get involved
            </Link>
            .
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {resources.map((resource) => (
              <article key={resource.title} className="rounded-2xl border border-brand-sand bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif-display text-3xl text-brand-ink">{resource.title}</h2>
                  <span className="shrink-0 rounded-full bg-brand-coral/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-coral">
                    {resource.badge}
                  </span>
                </div>
                <p className="mt-3 text-brand-ink/75">{resource.description}</p>
                <Link
                  href={resource.href}
                  className="mt-5 inline-flex text-sm font-semibold text-brand-coral hover:underline"
                >
                  Explore
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
