import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { shopProducts } from "@/lib/site-data";

export default function ShopPage() {
  return (
    <SiteLayout>
      <PageHero title="SHOP" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shopProducts.map((product) => (
            <article key={product.name} className="rounded-2xl border border-brand-sand bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-lg bg-brand-sand/40">
                <span className="text-2xl text-brand-ink/30">♥</span>
              </div>
              <h2 className="text-lg font-semibold text-brand-ink">{product.name}</h2>
              <p className="mt-2 text-brand-coral">{product.price}</p>
              <Button className="mt-4" size="sm">
                Buy
              </Button>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
