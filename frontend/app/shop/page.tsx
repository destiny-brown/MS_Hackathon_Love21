import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { WishlistOpportunities } from "@/components/site/wishlist-opportunities";

export default function ShopPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Wishlist"
        subtitle="Give practical tools that help Love 21 members train, learn, create, and show what they can do."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Practical support</p>
            <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Help remove a barrier</h2>
            <p className="mt-4 text-brand-ink/75">
              Purchase a requested item directly when a supplier link is available, or contribute any amount toward
              the goal. Love 21 updates each total as items and contributions are secured.
            </p>
          </div>
          <WishlistOpportunities />
        </div>
      </section>
    </SiteLayout>
  );
}
