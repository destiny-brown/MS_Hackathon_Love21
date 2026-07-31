import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { WishlistOpportunities } from "@/components/site/wishlist-opportunities";

export default function ShopPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Wishlist"
        subtitle="Help provide practical tools that Love 21 members need for training, learning, creativity, and everyday participation."
        primaryAction={{ label: "View wishlist items", href: "#wishlist-items" }}
        secondaryAction={{ label: "Donate instead", href: "/donate" }}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-3xl border border-brand-sand bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Practical support</p>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">Help remove a barrier</h2>
            <p className="mt-4 max-w-3xl leading-7 text-brand-ink/75">
              You can buy an item directly when a supplier link is available, or contribute any amount toward the goal.
              Love 21 updates each total as items and contributions are secured.
            </p>
          </div>
          <div id="wishlist-items" className="scroll-mt-24">
            <WishlistOpportunities />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
