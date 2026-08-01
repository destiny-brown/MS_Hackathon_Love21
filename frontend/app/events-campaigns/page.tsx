import Link from "next/link";

import { Reveal } from "@/components/brand/Reveal";
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
      <Reveal>
        <PageHero
          title="Events"
          subtitle="Special events, campaign fundraising, and programme-specific drives."
        />
      </Reveal>
      <Reveal>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign, i) => (
                <Reveal key={campaign.title} delay={i * 0.08}>
                  <article className="rounded-2xl border border-brand-light bg-white p-6">
                    <h2 className="font-serif-display text-2xl text-brand-dark">{campaign.title}</h2>
                    <p className="mt-3 text-brand-dark/75">{campaign.description}</p>
                    <Link href="/donate" className="mt-5 inline-flex text-sm font-semibold text-brand-red hover:underline">
                      Support this campaign
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>

            <article className="rounded-2xl border border-brand-light bg-brand-light p-6">
              <h2 className="font-serif-display text-3xl text-brand-dark">Calendar and Programme Links</h2>
              <p className="mt-3 text-brand-dark/80">
                This section can include the public calendar and campaign timelines while keeping programme updates in sync.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link href="/get-involved" className="font-semibold text-brand-red hover:underline">View Programmes</Link>
                <Link href="/stories-media" className="font-semibold text-brand-red hover:underline">View Campaign News</Link>
                <Link href="/donate" className="font-semibold text-brand-red hover:underline">Donate</Link>
              </div>
            </article>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
