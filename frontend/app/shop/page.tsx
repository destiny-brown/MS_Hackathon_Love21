"use client";

import { useTranslation } from "react-i18next";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { WishlistOpportunities } from "@/components/site/wishlist-opportunities";

export default function ShopPage() {
  const { t } = useTranslation("donate");

  return (
    <SiteLayout>
      <PageHero title={t("shop.title")} subtitle={t("shop.subtitle")} />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
              {t("shop.eyebrow")}
            </p>
            <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
              {t("shop.heading")}
            </h2>
            <p className="mt-4 text-brand-ink/75">{t("shop.body")}</p>
          </div>
          <WishlistOpportunities />
        </div>
      </section>
    </SiteLayout>
  );
}
