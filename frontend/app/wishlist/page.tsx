import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { WishlistOpportunities } from "@/components/site/wishlist-opportunities";

export default function WishlistPage() {
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
              Choose a wishlist need and contribute toward the exact item. This demo uses hardcoded wishlist totals,
              so Love 21 can connect a guest donation to the selected item without requiring an account.
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
