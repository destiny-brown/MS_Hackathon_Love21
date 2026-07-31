import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const sections = [
  {
    title: "Board of Directors",
    description: "Meet the leaders guiding Love 21's strategy, stewardship, and governance.",
    href: "/board-of-directors",
  },
  {
    title: "Staff",
    description: "Learn about the team delivering programmes and community support.",
    href: "/staff",
  },
  {
    title: "Annual Reports",
    description: "Transparent reporting and financial stewardship updates.",
    href: "/our-finance",
  },
  {
    title: "Contact Us",
    description: "Reach the team for partnerships, support, and community enquiries.",
    href: "/contact-us",
  },
];

export default function AboutGovernancePage() {
  return (
    <SiteLayout>
      <PageHero
        title="About Us"
        subtitle="Core organisation information, leadership, transparency, and contact channels."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-brand-light bg-white p-6">
              <h2 className="font-serif-display text-3xl text-brand-dark">{section.title}</h2>
              <p className="mt-3 text-brand-dark/75">{section.description}</p>
              <Link href={section.href} className="mt-5 inline-flex text-sm font-semibold text-brand-red hover:underline">
                Open Section
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
