"use client";

import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { useRequireRoles } from "@/lib/auth";
import { Role } from "@/lib/api";

type AccountLayoutProps = {
  children: React.ReactNode;
  allowedRoles: Role[];
  title?: string;
};

export function AccountLayout({ children, allowedRoles, title }: AccountLayoutProps) {
  const { user, loading } = useRequireRoles(...allowedRoles);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <SiteHeader />
        <main className="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <p className="text-sm text-muted-foreground" role="status">
            Loading your account…
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <SiteHeader />
      {title ? (
        <div className="border-b border-brand-sand bg-white/80 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <h1 className="font-serif-display text-2xl text-brand-ink">{title}</h1>
            <Link href="/" className="text-sm text-brand-coral hover:underline">
              Back to site
            </Link>
          </div>
        </div>
      ) : null}
      {children}
      <SiteFooter />
    </div>
  );
}
