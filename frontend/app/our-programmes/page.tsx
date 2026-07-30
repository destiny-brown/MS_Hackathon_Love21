import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { programmes } from "@/lib/site-data";

export default function OurProgrammesPage() {
  return (
    <SiteLayout>
      <PageHero title="OUR PROGRAMMES" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {programmes.map((programme) => (
            <article key={programme.title} className="border-b border-brand-sand pb-12 last:border-0">
              <h2 className="font-serif-display text-3xl text-brand-ink">{programme.title}</h2>
              <p className="mt-4 max-w-3xl text-brand-ink/80">{programme.description}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
