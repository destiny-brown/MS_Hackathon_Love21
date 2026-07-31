"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { DonationOpportunities } from "@/components/site/donation-opportunities";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

function TriMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 14"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <circle cx="7" cy="7" r="4.5" />
      <circle cx="22" cy="7" r="4.5" />
      <circle cx="37" cy="7" r="4.5" />
    </svg>
  );
}

function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral ${className}`}
    >
      <TriMark className="h-2 w-7" />
      {children}
    </p>
  );
}

function CtaButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
}) {
  const styles = {
    solid:
      "bg-brand-coral text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] hover:bg-black",
    outline:
      "border border-black/15 text-brand-ink hover:border-black hover:bg-black hover:text-white",
    "outline-dark":
      "border border-white/30 text-white hover:border-white hover:bg-white hover:text-black",
  }[variant];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 ${styles}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </Link>
  );
}

const tierKeys = ["t100", "t250", "t500", "t1000"] as const;

export default function DonatePage() {
  const { t } = useTranslation("donate");

  return (
    <SiteLayout>
      <PageHero title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl">
          <Eyebrow>{t("transparency.eyebrow")}</Eyebrow>
          <h2 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">
            {t("transparency.title")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tierKeys.map((key, i) => (
              <div
                key={key}
                className={`rounded-2xl border border-brand-sand bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"}`}
              >
                <div className="font-serif-display text-2xl text-brand-coral">
                  {t(`tiers.${key}.amount`)}
                </div>
                <p className="mt-3 text-sm text-brand-ink/70">
                  {t(`tiers.${key}.impact`)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CtaButton href="/donate">{t("transparency.cta")}</CtaButton>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-4 text-brand-ink/80">
              <h2 className="font-serif-display text-4xl text-brand-ink">
                {t("body.title")}
              </h2>
              <p>{t("body.p1")}</p>
              <p>
                {t("body.p2")}
              </p>
            </div>
            <aside className="rounded-2xl border border-brand-sand bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
                {t("aside.eyebrow")}
              </p>
              <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">
                {t("aside.title")}
              </h2>
              <p className="mt-3 text-sm text-brand-ink/75">{t("aside.body")}</p>
            </aside>
          </div>

          <DonationOpportunities />

          <div className="border-t border-brand-sand pt-10 text-brand-ink/80">
            <h2 className="font-serif-display text-3xl text-brand-ink">
              {t("other.title")}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-brand-sand bg-white p-6">
                <h3 className="font-serif-display text-2xl text-brand-ink">
                  {t("other.paymeTitle")}
                </h3>
                <p className="mt-2 text-sm">{t("other.paymeBody")}</p>
                <Image
                  src="/images/love21-payme.png"
                  alt={t("other.paymeTitle", {
                    defaultValue: "Love 21 Foundation PayMe donation QR code",
                  })}
                  width={332}
                  height={383}
                  className="mx-auto mt-5 h-auto w-full max-w-72"
                  unoptimized
                />
                <p className="mt-4 text-xs text-brand-ink/65">{t("other.paymeNote")}</p>
              </article>

              <article className="space-y-4 rounded-2xl border border-brand-sand bg-white p-6">
                <h3 className="font-serif-display text-2xl text-brand-ink">
                  {t("other.bankTitle")}
                </h3>
                <p>
                  HSBC transfer: <strong>582-350526-838</strong>
                  <br />
                  FPS ID: <strong>164778151</strong>
                </p>
                <p>{t("other.chequeNote")}</p>
                <address className="not-italic">
                  1102, 11/F, Artisan Lab
                  <br />
                  21 Luk Hop Street, San Po Kong,
                  <br />
                  Kowloon, HK.
                </address>
              </article>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
