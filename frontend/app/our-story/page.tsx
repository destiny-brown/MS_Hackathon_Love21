import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function OurStoryPage() {
  return (
    <SiteLayout>
      <PageHero title="OUR STORY" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-lg text-brand-ink/80">
          <p>
            LOVE 21 is a charity dedicated to empowering the Down syndrome and autistic community in Hong Kong through
            sport, nutrition, and holistic support programmes.
          </p>
          <p>
            Since the launch of our comprehensive nutrition programme in 2021, we&apos;ve provided one-on-one nutritional
            support on top of the sports classes that we&apos;ve offered.
          </p>
          <p>
            We&apos;ve also recently expanded into providing counselling support for the parents of our community.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
