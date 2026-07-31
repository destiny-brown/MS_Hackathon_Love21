"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { AccessibilityMenu } from "@/components/site/accessibility-menu";
import { LanguageSwitcherInline } from "@/components/site/language-switcher-inline";
import { Button } from "@/components/ui/button";
import { navKeyByHref } from "@/lib/i18n/nav";
import { mainNav } from "@/lib/site-data";

export function SiteHeader() {
  const { t } = useTranslation("common");

  return (
    <header className="sticky top-0 z-[60] isolate border-b border-brand-sand/80 bg-brand-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex shrink-0 items-center" aria-label="Love 21 home">
          <Image
            src="/images/love21_logo.png"
            alt="Love 21 Foundation"
            width={144}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 text-sm font-medium lg:flex" aria-label="Main navigation">
          {mainNav.map((item) => {
            const key = navKeyByHref[item.href];
            return (
              <Link key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-brand-coral">
                {key ? t(key) : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <AccessibilityMenu />
          <LanguageSwitcherInline />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/donate">{t("nav.donate")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
