"use client";

import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { WishlistOpportunities } from "@/components/site/wishlist-opportunities";
import { useTranslation } from "react-i18next";

export default function ShopPage() {
  const { t } = useTranslation("donate");

  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="shop.title" subtitleKey="shop.subtitle" ns="pages" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-3xl border border-brand-sand bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("shop.eyebrow")}</p>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-ink sm:text-4xl">{t("shop.heading")}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-brand-ink/75">{t("shop.body")}</p>
          </div>
          <div id="wishlist-items" className="scroll-mt-24">
            <WishlistOpportunities />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
