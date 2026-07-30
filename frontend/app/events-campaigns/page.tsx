import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const campaigns = [
  {
    title: "Beyond Limits Banquet",
    description: "Signature fundraising event supporting community programmes.",
  },
  {
    title: "Charity Raffle",
    description: "Community raffle campaign to fund sports, nutrition, and support activities.",
  },
  {
    title: "Programme-specific Drives",
    description: "Targeted support drives aligned with specific programme needs and calendar moments.",
  },
];

export default function EventsCampaignsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Events"
        subtitle="Special events, campaign fundraising, and programme-specific drives."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <article key={campaign.title} className="rounded-2xl border border-brand-sand bg-white p-6">
                <h2 className="font-serif-display text-2xl text-brand-ink">{campaign.title}</h2>
                <p className="mt-3 text-brand-ink/75">{campaign.description}</p>
                <Link href="/donate" className="mt-5 inline-flex text-sm font-semibold text-brand-coral hover:underline">
                  Support this campaign
                </Link>
              </article>
            ))}
          </div>

          <article className="rounded-2xl border border-brand-sand bg-brand-cream p-6">
            <h2 className="font-serif-display text-3xl text-brand-ink">Calendar and Programme Links</h2>
            <p className="mt-3 text-brand-ink/80">
              This section can include the public calendar and campaign timelines while keeping programme updates in sync.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/our-programmes" className="font-semibold text-brand-coral hover:underline">View Programmes</Link>
              <Link href="/media" className="font-semibold text-brand-coral hover:underline">View Campaign News</Link>
              <Link href="/donate" className="font-semibold text-brand-coral hover:underline">Donate</Link>
            </div>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
