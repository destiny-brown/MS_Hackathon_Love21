"use client";

import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { useRequireRoles } from "@/lib/auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useRequireRoles("admin");

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <SiteHeader />
        <main className="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <p className="text-sm text-muted-foreground" role="status">
            Verifying staff access…
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <SiteHeader />
      <div className="border-b border-brand-sand bg-white/80 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm">
          <p className="font-medium text-brand-ink">Staff admin</p>
          <Link href="/" className="text-brand-coral hover:underline">
            Back to site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
