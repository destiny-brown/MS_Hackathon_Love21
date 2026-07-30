import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const resources = [
  {
    title: "Short Videos",
    description: "Neurodiversity education clips for families, volunteers, and community partners.",
    href: "/media",
  },
  {
    title: "Quizzes",
    description: "Quick learning checks to improve public understanding and inclusive practices.",
    href: "/media",
  },
  {
    title: "Weekly Puzzles",
    description: "Neurodiverse-friendly and general puzzles designed for shared learning and confidence.",
    href: "/members",
  },
  {
    title: "Resource Library",
    description: "Guides and programme references for nutrition, volunteering, and family support.",
    href: "/our-programmes",
  },
];

export default function LearnPlayPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Learn"
        subtitle="Flexible education resources for neurodiversity awareness, skill-building, and community engagement."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.title} className="rounded-2xl border border-brand-sand bg-white p-6">
              <h2 className="font-serif-display text-3xl text-brand-ink">{resource.title}</h2>
              <p className="mt-3 text-brand-ink/75">{resource.description}</p>
              <Link href={resource.href} className="mt-5 inline-flex text-sm font-semibold text-brand-coral hover:underline">
                Explore
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
