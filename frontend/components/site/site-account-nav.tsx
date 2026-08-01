"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { landingPathForRole, signOutToLogin, useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function SiteAccountNav() {
  const { user, loading } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (loading) {
    return (
      <Button asChild size="sm" variant="outline" className="border-brand-coral/40 font-semibold">
        <Link href="/login">Log in</Link>
      </Button>
    );
  }

  if (!user) {
    return (
      <Button asChild size="sm" variant="outline" className="border-brand-coral font-semibold text-brand-coral hover:bg-brand-coral/10">
        <Link href="/login">Log in</Link>
      </Button>
    );
  }

  const dashboardHref = landingPathForRole(user.role);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1 border-brand-sand font-medium"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        Account
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-brand-sand bg-white py-1 shadow-lg"
        >
          <p className="border-b border-brand-sand px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</p>
          <Link
            href={dashboardHref}
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-brand-cream"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
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
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
