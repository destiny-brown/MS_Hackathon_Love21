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

export function scrollToDonationForm(behavior: ScrollBehavior = "smooth") {
  if (typeof document === "undefined") {
    return false;
  }
  const target = document.getElementById(DONATION_FORM_ANCHOR_ID);
  if (!target) {
    return false;
  }
  target.scrollIntoView({ behavior, block: "start" });
  return true;
}

export function wantsDonationFormFocus(initialItemSlug?: string | null) {
  if (typeof window === "undefined") {
    return Boolean(initialItemSlug);
  }
  return window.location.hash === `#${DONATION_FORM_ANCHOR_ID}` || Boolean(initialItemSlug);
}
