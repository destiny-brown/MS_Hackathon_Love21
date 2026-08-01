import Image from "next/image";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { WISHLIST_ITEMS, getWishlistProgressPercent } from "@/lib/wishlist-items";

export function WishlistOpportunities() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {WISHLIST_ITEMS.map((item) => {
        const progressPercent = getWishlistProgressPercent(item);

        return (
          <article
            key={item.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-52 w-full bg-brand-cream">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Wishlist need</p>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">{item.title}</h2>
              <p className="mt-3 leading-7 text-brand-ink/75">{item.shortDescription}</p>
              <p className="mt-4 rounded-xl bg-brand-cream p-4 text-sm font-medium leading-6 text-brand-ink">
                {item.impact}
              </p>
              <p className="mt-4 text-sm text-brand-ink/70">
                <strong className="text-brand-ink">{item.securedCount}</strong> of{" "}
                <strong className="text-brand-ink">{item.totalCount}</strong> secured
              </p>
              <SupportProgress
                className="mt-4"
                label={item.title}
                fundedAmount={item.amountRaised}
                targetAmount={item.goalAmount}
                progressPercent={progressPercent}
              />
              <div className="mt-auto pt-6">
                <Button asChild className="w-full">
                  <Link href={`/donate?item=${encodeURIComponent(item.id)}&amount=${item.unitCost}#donation-form`}>
                    <HeartHandshake className="mr-2 h-4 w-4" aria-hidden="true" />
                    Contribute toward this
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
