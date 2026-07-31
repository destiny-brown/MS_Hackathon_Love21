import { MediaStoryCard } from "@/components/learn/media-story-card";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/media-stories";

export default function MediaPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Media"
        subtitle="Press coverage and community updates from Love 21 Foundation."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mediaPosts.map((post) => (
              <MediaStoryCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
