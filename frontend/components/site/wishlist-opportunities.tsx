"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Gift, HeartHandshake } from "lucide-react";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";

export function WishlistOpportunities() {
  const [items, setItems] = useState<SupportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listSupportOpportunities("wishlist")
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the wishlist"))
      .finally(() => setLoading(false));
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
        <article key={item.id} className="flex h-full flex-col rounded-2xl border border-brand-light bg-white p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand-red">
            <Gift className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-serif-display text-3xl text-brand-dark">{item.title}</h2>
          <p className="mt-3 text-brand-dark/75">{item.description}</p>
          <p className="mt-4 text-sm font-medium text-brand-dark">{item.impact_statement}</p>
          {item.quantity_needed !== null ? (
            <p className="mt-4 text-sm text-brand-dark/70">
              <strong className="text-brand-dark">{item.quantity_secured ?? 0}</strong> of{" "}
              <strong className="text-brand-dark">{item.quantity_needed}</strong> secured
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
        </article>
      ))}
    </div>
  );
}
