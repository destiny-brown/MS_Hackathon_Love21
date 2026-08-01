"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminNavSections, isAdminNavActive } from "@/lib/admin-nav";
import { signOutToLogin } from "@/lib/auth";
import type { User } from "@/lib/api";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  user: User;
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-[#faf6f0] to-brand-sand/40 text-brand-ink">
      <header className="border-b border-brand-sand/80 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden rounded-xl bg-gradient-to-br from-brand-coral to-brand-coral/80 p-2.5 text-white shadow-sm sm:inline-flex">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">Love 21 Staff Console</p>
              <p className="truncate text-sm text-brand-ink/70">{user.email}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-brand-sand bg-white/80">
              <Link href="/">
                <ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" />
                View site
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-brand-ink/70 hover:bg-white/70 hover:text-brand-ink"
              onClick={signOutToLogin}
            >
              <LogOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8 lg:py-8">
        <nav aria-label="Staff navigation" className="lg:w-72 lg:shrink-0">
          <div className="rounded-2xl border border-brand-sand/80 bg-white/85 p-3 shadow-sm backdrop-blur-sm lg:sticky lg:top-6">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {adminNavSections.map((section) => (
                <div key={section.title} className="min-w-[10.5rem] shrink-0 lg:min-w-0 lg:w-full">
                  <p className="mb-1.5 hidden px-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-ink/45 lg:block">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isAdminNavActive(pathname, item);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                            active
                              ? "border-brand-coral/30 bg-gradient-to-r from-brand-coral/10 to-white shadow-sm"
                              : "border-transparent hover:border-brand-sand hover:bg-brand-cream/60",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <span
                            className={cn(
                              "mt-0.5 rounded-lg p-2",
                              active ? "bg-brand-coral text-white shadow-sm" : "bg-brand-sand/70 text-brand-ink/55",
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-brand-ink">{item.label}</span>
                            <span className="mt-0.5 hidden text-xs leading-5 text-brand-ink/55 lg:block">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1">
          <div className="rounded-2xl border border-brand-sand/70 bg-white/90 p-5 shadow-sm sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
