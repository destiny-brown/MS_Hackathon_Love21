"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { landingPathForRole, signOutToLogin, useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function SiteAccountNav() {
  const { user, loading } = useCurrentUser();
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    function onClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  if (loading || !user) {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className="border-brand-coral/40 font-semibold"
      >
        <Link href="/login">{t("Login")}</Link>
      </Button>
    );
  }

  const dashboardHref = landingPathForRole(user.role);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        type="button"
        size="sm"
        variant="outline"
        className="gap-1 border-brand-sand font-medium"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {t("account")}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </Button>

      {open && mounted
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-[2147483647] w-52 rounded-xl border border-brand-sand bg-white py-1 shadow-lg"
            >
              <p className="truncate border-b border-brand-sand px-3 py-2 text-xs text-muted-foreground">
                {user.email}
              </p>
              <Link
                href={dashboardHref}
                role="menuitem"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-brand-cream"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                {t("dashboard")}
              </Link>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/5"
                onClick={() => {
                  setOpen(false);
                  signOutToLogin();
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t("logout")}
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
