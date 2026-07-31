"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Gift, HeartHandshake } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SupportProgress } from "@/components/site/support-progress";
import { Button } from "@/components/ui/button";
import { api, SupportOpportunity } from "@/lib/api";

export function WishlistOpportunities() {
  const { t } = useTranslation("donate");
  const [items, setItems] = useState<SupportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listSupportOpportunities("wishlist")
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : t("wishlist.error")))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return <p className="text-brand-ink/70" role="status">{t("wishlist.loading")}</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-sand bg-white p-6">
        <p className="font-semibold text-brand-ink">{t("wishlist.unavailableTitle")}</p>
        <p className="mt-2 text-sm text-brand-ink/70">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-brand-ink/70">{t("wishlist.emptySoon")}</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="flex h-full flex-col rounded-2xl border border-brand-sand bg-white p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-brand-coral">
            <Gift className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-serif-display text-3xl text-brand-ink">{item.title}</h2>
          <p className="mt-3 text-brand-ink/75">{item.description}</p>
          <p className="mt-4 text-sm font-medium text-brand-ink">{item.impact_statement}</p>
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
            {item.purchase_url ? (
              <Button asChild variant="outline">
                <a href={item.purchase_url} target="_blank" rel="noreferrer">
                  {t("wishlist.buy")}
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            {item.moonclerk_url ? (
              <>
                <p className="text-xs text-brand-ink/65">
                  {t("wishlist.remarkMoonclerk", { title: item.title })}
                </p>
                <Button asChild>
                  <a href={item.moonclerk_url} target="_blank" rel="noreferrer">
                    <HeartHandshake className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("wishlist.contribute")}
                  </a>
                </Button>
              </>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
