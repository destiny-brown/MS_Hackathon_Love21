"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";
import { donationFormUrl } from "@/lib/donation-form-url";
import { seededWishlistItems } from "@/lib/wishlist-seed";

const DONATION_DELIVERY_MAP_URL =
  "https://www.google.com/maps/search/Love+21+Foundation+Hong+Kong";

export function WishlistOpportunities() {
  const { t } = useTranslation("donate");
  const [items, setItems] = useState<SupportOpportunity[]>(seededWishlistItems);
  const [refreshing, setRefreshing] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      try {
        const wishlistItems = await api.listSupportOpportunities("wishlist");
        if (!active) return;

        if (wishlistItems.length > 0) {
          setItems(wishlistItems);
          setUsingFallback(false);
          return;
        }

        const allItems = await api.listSupportOpportunities();
        if (!active) return;

        const inferredWishlistItems = allItems.filter((entry) => entry.kind === "wishlist");
        if (inferredWishlistItems.length > 0) {
          setItems(inferredWishlistItems);
          setUsingFallback(false);
        }
      } catch {
        if (!active) return;
        setItems(seededWishlistItems);
        setUsingFallback(true);
      } finally {
        if (active) setRefreshing(false);
      }
    }

    void loadWishlist();

    return () => {
      active = false;
    };
  }, []);

  if (!items.length) {
    return <p className="text-brand-dark/70">{t("wishlist.emptySoon")}</p>;
  }

  return (
    <div className="space-y-4">
      {refreshing ? (
        <p className="text-sm text-brand-dark/60" role="status">
          {t("wishlist.loading")}
        </p>
      ) : usingFallback ? (
        <p className="rounded-xl border border-brand-sand bg-brand-cream/40 px-4 py-3 text-sm text-brand-ink/70">
          {t("wishlist.fallbackNotice")}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm">
            <div className="relative h-52 w-full bg-brand-cream">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Wishlist need</p>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">{item.title}</h2>
              <p className="mt-3 text-brand-ink/75">{item.description}</p>
              <p className="mt-4 rounded-xl bg-brand-cream p-4 text-sm font-medium text-brand-ink">{item.impact_statement}</p>
              {item.quantity_needed !== null ? (
                <p className="mt-4 text-sm text-brand-ink/70">
                  {t("wishlist.securedOf", {
                    secured: item.quantity_secured ?? 0,
                    needed: item.quantity_needed,
                  })}
                </p>
              ) : null}
              <SupportProgress
                className="mt-4"
                label={item.title}
                fundedAmount={item.funded_amount_hkd}
                targetAmount={item.target_amount_hkd}
                progressPercent={item.progress_percent}
              />
              <div className="mt-auto flex flex-col gap-3 pt-6">
                <Button asChild variant="outline">
                  <a href={DONATION_DELIVERY_MAP_URL} target="_blank" rel="noreferrer">
                    {t("wishlist.buy")}
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild>
                  <Link href={donationFormUrl({ item: item.slug })}>
                    <HeartHandshake className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("wishlist.contribute")}
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
