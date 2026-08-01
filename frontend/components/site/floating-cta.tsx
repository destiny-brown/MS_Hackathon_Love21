"use client";

import Link from "next/link";

function IconHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 33S6 24 6 14.5C6 9.8 9.6 7 13.5 7c2.9 0 5.3 1.6 6.5 4 1.2-2.4 3.6-4 6.5-4C30.4 7 34 9.8 34 14.5 34 24 20 33 20 33Z" />
    </svg>
  );
}

function IconHands({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 20l6-6 7 2 9-3 6 4-8 8-8-1-6 3" />
      <path d="M12 14l6 6" />
      <path d="M28 21l-8 9" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// FloatingCta — a two-way rail (Donate + Volunteer) pinned to the edge of
// the viewport, on every page. Labels are always visible — no hover/tap to
// reveal them — so the call to action reads instantly on first glance.
//
// USAGE: render this once inside SiteLayout (see instructions where this
// component is introduced) rather than importing it into individual pages.
// Rendering it in the shared layout is what makes it show up site-wide
// without having to add it to every page file by hand.
// ---------------------------------------------------------------------------

export function FloatingCta() {
  return (
    <>
      {/* Desktop / tablet: vertical rail pinned to the right edge */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden items-center sm:flex">
        <div className="pointer-events-auto flex flex-col gap-3 pr-3 lg:pr-4">
          <Link
            href="/donate"
            className="flex items-center gap-2.5 rounded-full bg-brand-red px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/25"
          >
            <IconHeart className="h-5 w-5 shrink-0" />
            Donate
          </Link>
          <Link
            href="/our-volunteer"
            className="flex items-center gap-2.5 rounded-full border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-brand-dark shadow-lg shadow-black/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/15"
          >
            <IconHands className="h-5 w-5 shrink-0" />
            Volunteer
          </Link>
        </div>
      </div>

      {/* Mobile: fixed bottom bar instead of a side rail (a side rail would
          eat too much width on a phone) — labels were already always-on here */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-px border-t border-black/10 bg-white/95 backdrop-blur sm:hidden">
        <Link
          href="/donate"
          className="flex flex-1 items-center justify-center gap-2 bg-brand-red py-3.5 text-sm font-semibold text-white"
        >
          <IconHeart className="h-4 w-4" /> Donate
        </Link>
        <Link
          href="/our-volunteer"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-brand-dark"
        >
          <IconHands className="h-4 w-4" /> Volunteer
        </Link>
      </div>
    </>
  );
}
