import Link from "next/link";

import { footerNav, mainNav } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-light bg-brand-light px-4 py-12 pb-28 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 lg:grid-cols-3">
        <div className="col-span-2 lg:col-span-1">
          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-brand-red">Love 21 Foundation</p>
          <p className="mt-3 text-sm text-brand-dark/70">
            Empowering the Down syndrome and autistic community in Hong Kong through sport, nutrition, and holistic support.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-slate">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md text-brand-ink/70 transition hover:text-brand-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-slate">More</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md text-brand-ink/70 transition hover:text-brand-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-brand-slate/30 pt-6 text-sm text-brand-dark/70 sm:flex-row">
        <p>© 2019–2026 Love 21 Foundation Limited</p>
        <div className="flex gap-5">
          <Link href="/contact-us" className="rounded-md transition hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Contact
          </Link>
          <Link href="/login?role=admin" className="rounded-md text-brand-ink/45 transition hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}