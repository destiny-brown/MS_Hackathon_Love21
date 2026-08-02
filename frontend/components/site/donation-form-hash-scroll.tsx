"use client";

import { useEffect } from "react";

import { DONATION_FORM_ANCHOR_ID, scrollToDonationForm, wantsDonationFormFocus } from "@/lib/donation-form-anchor";

/** Scroll to the donation form when the page loads with #donation-form or ?item=. */
export function DonationFormHashScroll({ initialItemSlug }: { initialItemSlug?: string | null }) {
  useEffect(() => {
    if (!wantsDonationFormFocus(initialItemSlug)) {
      return;
    }
    scrollToDonationForm();
  }, [initialItemSlug]);

  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === `#${DONATION_FORM_ANCHOR_ID}`) {
        scrollToDonationForm();
      }
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
