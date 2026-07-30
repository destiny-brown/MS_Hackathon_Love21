import Link from "next/link";

import { footerNav, mainNav } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-sand bg-brand-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-brand-coral">Love 21 Foundation</p>
          <p className="mt-3 text-sm text-brand-ink/70">
            Empowering the Down syndrome and autistic community in Hong Kong through sport, nutrition, and holistic support.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink/55">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-brand-ink/70 transition hover:text-brand-coral">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink/55">More</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-brand-ink/70 transition hover:text-brand-coral">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-brand-sand pt-6 text-sm text-brand-ink/70 sm:flex-row">
        <p>© 2019–2026 Love 21 Foundation Limited</p>
        <div className="flex gap-5">
          <Link href="/donate" className="font-semibold uppercase tracking-[0.11em] text-brand-coral transition hover:text-brand-ink">
            Donate
          </Link>
          <Link href="/contact-us" className="transition hover:text-brand-ink">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
