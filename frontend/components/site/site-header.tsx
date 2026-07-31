import Link from "next/link";
import Image from "next/image";

import { SiteAccountNav } from "@/components/site/site-account-nav";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-sand/80 bg-brand-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center" aria-label="Love 21 home">
          <Image src="/images/love21_logo.png" alt="Love 21 Foundation" width={144} height={48} className="h-12 w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md transition-colors hover:text-brand-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SiteAccountNav />
          <Button asChild size="sm">
            <Link href="/donate">Donate</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
