import type { MouseEvent } from "react";

/** Shared anchor id for the mock donation form section on /donate. */
export const DONATION_FORM_ANCHOR_ID = "donation-form";

export function donatePageUrl(options?: { item?: string; amount?: number }) {
  const params = new URLSearchParams();
  if (options?.amount && options.amount > 0) {
    params.set("amount", String(options.amount));
  }
  if (options?.item) {
    params.set("item", options.item);
  }
  const query = params.toString();
  return query ? `/donate?${query}#${DONATION_FORM_ANCHOR_ID}` : `/donate#${DONATION_FORM_ANCHOR_ID}`;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToAnchorById(
  id: string,
  behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth",
) {
  const target = document.getElementById(id);
  if (!target) {
    return false;
  }
  target.scrollIntoView({ behavior, block: "start" });
  return true;
}

/** Scroll to the mock donation form, retrying until the anchor mounts (API loading). */
export function scrollToDonationForm(behavior?: ScrollBehavior) {
  if (typeof window === "undefined") {
    return;
  }

  const motion = behavior ?? (prefersReducedMotion() ? "auto" : "smooth");
  let attempts = 0;
  const maxAttempts = 40;

  const tryScroll = () => {
    attempts += 1;
    if (scrollToAnchorById(DONATION_FORM_ANCHOR_ID, motion)) {
      return;
    }
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 100);
    }
  };

  tryScroll();
}

export function updateDonationFormHash() {
  if (typeof window === "undefined") {
    return;
  }
  const next = `#${DONATION_FORM_ANCHOR_ID}`;
  if (window.location.hash !== next) {
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${next}`);
  }
}

export function handleDonationFormLinkClick(event: MouseEvent, href: string) {
  if (!href.includes(`#${DONATION_FORM_ANCHOR_ID}`)) {
    return;
  }

  event.preventDefault();
  updateDonationFormHash();
  scrollToDonationForm();
}

export function wantsDonationFormFocus(initialItemSlug?: string | null) {
  if (typeof window === "undefined") {
    return Boolean(initialItemSlug);
  }
  return window.location.hash === `#${DONATION_FORM_ANCHOR_ID}` || Boolean(initialItemSlug);
}
