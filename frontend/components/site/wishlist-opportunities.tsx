"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";

export function WishlistOpportunities() {
  const [items, setItems] = useState<SupportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const wishlistItems = await api.listSupportOpportunities("wishlist");
        if (!cancelled && wishlistItems.length > 0) {
          setItems(wishlistItems);
          return;
        }

        const allItems = await api.listSupportOpportunities();
        const inferredWishlistItems = allItems.filter(
          (entry) =>
            entry.kind === "wishlist" ||
            entry.purchase_url !== null ||
            entry.quantity_needed !== null ||
            entry.quantity_secured !== null,
        );

        if (!cancelled) {
          setItems(inferredWishlistItems);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load the wishlist");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-brand-dark/70" role="status">Loading wishlist…</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-light bg-white p-6">
        <p className="font-semibold text-brand-dark">The wishlist is temporarily unavailable.</p>
        <p className="mt-2 text-sm text-brand-dark/70">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-brand-dark/70">Love 21’s current needs will be shared here soon.</p>;
  }

  return (
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
                <strong className="text-brand-ink">{item.quantity_secured ?? 0}</strong> of{" "}
                <strong className="text-brand-ink">{item.quantity_needed}</strong> secured
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
              {item.purchase_url ? (
                <Button asChild variant="outline">
                  <a href={item.purchase_url} target="_blank" rel="noreferrer">
                    Buy this item
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
              <Button asChild>
                <Link href={`/donate?item=${encodeURIComponent(item.slug)}`}>
                  <HeartHandshake className="mr-2 h-4 w-4" aria-hidden="true" />
                  Contribute toward this
                </Link>
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
