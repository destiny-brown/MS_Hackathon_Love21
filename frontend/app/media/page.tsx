import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { mediaPosts } from "@/lib/site-data";

export default function MediaPage() {
  return (
    <SiteLayout>
      <PageHero title="Media" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2">
            {mediaPosts.map((post) => (
              <article key={post.title} className="rounded-2xl border border-brand-sand bg-white p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-brand-ink/55">{post.date}</p>
                <h2 className="mt-2 text-xl font-semibold text-brand-ink">{post.title}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
