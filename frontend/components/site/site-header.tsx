"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { AccessibilityMenu } from "@/components/site/accessibility-menu";
import { LanguageSwitcherInline } from "@/components/site/language-switcher-inline";
import { MobileSiteMenu } from "@/components/site/mobile-site-menu";
import { SiteAccountNav } from "@/components/site/site-account-nav";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import { navKeyByHref } from "@/lib/i18n/nav";
import { mainNav } from "@/lib/site-data";

export function SiteHeader() {
  const { t } = useTranslation("common");
  const { user } = useCurrentUser();

  return (
    <header className="relative z-50 border-b border-brand-light/80 bg-brand-light/90 backdrop-blur-sm">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="inline-flex shrink-0 items-center" aria-label="Love 21 home">
          <Image
            src="/images/love21_logo.png"
            alt="Love 21 Foundation"
            width={144}
            height={48}
            className="h-9 w-auto sm:h-12"
            priority
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-6 text-sm font-medium text-brand-dark lg:flex"
          aria-label="Main navigation"
        >
          {mainNav.map((item) => {
            const key = navKeyByHref[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md transition-colors hover:text-brand-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {key ? t(key) : item.label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="whitespace-nowrap rounded-md font-semibold text-[#d4a373] transition-colors hover:text-brand-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <AccessibilityMenu />
          <LanguageSwitcherInline />
          <SiteAccountNav />
          <Button asChild size="sm" className="shrink-0 font-semibold">
            <Link href="/donate">{t("nav.donate")}</Link>
          </Button>
          <MobileSiteMenu />
        </div>
      </div>
    </header>
  );
}
