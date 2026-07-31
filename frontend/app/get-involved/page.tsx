import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { programmes } from "@/lib/site-data";

const pathways = [
  {
    title: "Families",
    description: "Member registration for joining classes and support activities.",
    href: "/members",
  },
  {
    title: "Volunteers",
    description: "Self-signup path for individual volunteers and weekly class support.",
    href: "/our-volunteer",
  },
  {
    title: "Corporate",
    description: "CSR and corporate volunteering pathways through structured partnerships.",
    href: "/join-us",
  },
  {
    title: "Donate",
    description: "Back campaigns and causes that create more opportunities for every ability to shine.",
    href: "/donate",
  },
  {
    title: "Wishlist",
    description: "Fund or purchase practical tools that help members train, learn, and create.",
    href: "/shop",
  },
];

export default function GetInvolvedPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Get Involved"
        subtitle="Explore our programmes first, then choose how you want to get involved and support the Love 21 community."
      />

      <section className="border-b border-brand-sand bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Programmes</p>
              <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">What We Do</h2>
            </div>
            <p className="max-w-2xl text-sm text-brand-ink/70">
              Each programme area connects directly to actions for families, volunteers, corporate partners, and donors.
            </p>
          </div>

          <div className="space-y-6">
            {programmes.map((programme) => (
              <article key={programme.title} className="rounded-2xl border border-brand-sand p-6">
                <h3 className="font-serif-display text-3xl text-brand-ink">{programme.title}</h3>
                <p className="mt-3 max-w-4xl text-brand-ink/80">{programme.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link href="/members" className="font-semibold text-brand-coral hover:underline">Join as Family</Link>
                  <Link href="/our-volunteer" className="font-semibold text-brand-coral hover:underline">Volunteer</Link>
                  <Link href="/join-us" className="font-semibold text-brand-coral hover:underline">Corporate CSR</Link>
                  <Link href="/donate" className="font-semibold text-brand-coral hover:underline">Donate to this area</Link>
                  <Link href="/shop" className="font-semibold text-brand-coral hover:underline">Wishlist support</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-serif-display text-4xl text-brand-ink sm:text-5xl">Choose Your Pathway</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <article key={pathway.title} className="rounded-2xl border border-brand-sand bg-white p-6">
              <h2 className="font-serif-display text-2xl text-brand-ink">{pathway.title}</h2>
              <p className="mt-3 text-brand-ink/75">{pathway.description}</p>
              <Link href={pathway.href} className="mt-5 inline-flex text-sm font-semibold text-brand-coral hover:underline">
                Open Pathway
              </Link>
            </article>
          ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
