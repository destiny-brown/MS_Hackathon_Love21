import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-light/80 bg-brand-light/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="Love 21 home"
        >
          <Image
            src="/images/love21_logo.png"
            alt="Love 21 Foundation"
            width={144}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-brand-dark lg:flex"
          aria-label="Main navigation"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="font-semibold text-[#d4a373] transition-colors hover:text-brand-red"
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-red lg:hidden"
          >
            Admin
          </Link>
          <Button asChild size="sm">
            <Link href="/donate">Donate</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
