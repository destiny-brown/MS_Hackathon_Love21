import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { stats } from "@/lib/site-data";

const campaignProgress = [
  { campaign: "Beyond Limits Banquet", progress: 72 },
  { campaign: "Charity Raffle", progress: 56 },
  { campaign: "Programme Support Drive", progress: 41 },
];

const achievements = [
  "Community milestone growth across sports, nutrition, and family support programmes",
  "Anonymous donor contribution achievements updated in aggregate",
  "Volunteer impact measured by monthly hours and class participation",
];

export default function ImpactDashboardPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Impact"
        subtitle="Public dashboard showing milestones, campaign momentum, and community-wide progress."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-brand-sand bg-white p-5">
                <p className="font-serif-display text-4xl text-brand-sea">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.12em] text-brand-ink/70">{stat.label}</p>
              </article>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="font-serif-display text-3xl text-brand-ink">Campaign Progress</h2>
            {campaignProgress.map((entry) => (
              <article key={entry.campaign} className="rounded-2xl border border-brand-sand bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-brand-ink">{entry.campaign}</p>
                  <p className="text-sm text-brand-ink/70">{entry.progress}%</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-brand-sand/40">
                  <div className="h-2 rounded-full bg-brand-coral" style={{ width: `${entry.progress}%` }} />
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-brand-sand bg-white p-6">
            <h2 className="font-serif-display text-3xl text-brand-ink">Donor Achievements (Aggregated)</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-brand-ink/80">
              {achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
