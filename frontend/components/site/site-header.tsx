import Link from "next/link";

import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-sand/80 bg-brand-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold uppercase tracking-[0.2em] text-brand-coral">
          Love 21
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-brand-coral">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/donate">Donate</Link>
        </Button>
      </div>
    </header>
  );
}
