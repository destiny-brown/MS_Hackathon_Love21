"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AccessibilityMenu } from "@/components/site/accessibility-menu";
import { AccessibilityOptionsPanel } from "@/components/site/accessibility-options-panel";
import { LanguageSwitcherInline } from "@/components/site/language-switcher-inline";
import { SiteAccountNav } from "@/components/site/site-account-nav";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import { navKeyByHref } from "@/lib/i18n/nav";
import { mainNav } from "@/lib/site-data";

export function SiteHeader() {
  const { t } = useTranslation("common");
  const drawerId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const focusTarget =
      drawerRef.current?.querySelector<HTMLElement>("button, a");
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  const mobileDrawer =
    menuOpen && mounted
      ? createPortal(
          <div className="lg:hidden">
            <button
              type="button"
              className="fixed inset-0 z-[90] bg-brand-dark/40"
              aria-label={t("closeMenu")}
              onClick={closeMenu}
            />
            <div
              ref={drawerRef}
              id={drawerId}
              role="dialog"
              aria-modal="true"
              aria-label={t("openMenu")}
              className="fixed inset-y-0 right-0 z-[100] flex w-[min(20rem,100vw)] flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-brand-light px-4 py-3">
                <p className="text-sm font-semibold text-brand-dark">
                  {t("openMenu")}
                </p>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-sand/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
                  aria-label={t("closeMenu")}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav
                className="flex-1 overflow-y-auto px-2 py-3"
                aria-label="Main navigation"
              >
                <ul className="space-y-0.5">
                  {mainNav.map((item) => {
                    const key = navKeyByHref[item.href];
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-light hover:text-brand-red"
                        >
                          {key ? t(key) : item.label}
                        </Link>
                      </li>
                    );
                  })}
                  {user?.role === "admin" && (
                    <li>
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#d4a373] transition hover:bg-brand-light"
                      >
                        {t("dashboard")}
                      </Link>
                    </li>
                  )}
                </ul>

                <div className="mt-4 border-t border-brand-light px-3 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-ink/55">
                    {t("a11y.options")}
                  </p>
                  <AccessibilityOptionsPanel showHeading={false} />
                </div>
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className="border-b border-brand-light/80 bg-brand-light/90 backdrop-blur-sm">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center"
          aria-label="Love 21 home"
        >
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
              {t("dashboard")}
            </Link>
          )}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <AccessibilityMenu />
          <LanguageSwitcherInline />
          <SiteAccountNav />
          {/* <Button asChild size="sm" className="shrink-0 font-semibold">
            <Link href="/donate">{t("nav.donate")}</Link>
          </Button> */}
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-sand/60 hover:text-brand-red focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileDrawer}
    </header>
  );
}
