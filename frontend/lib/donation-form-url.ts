/** Route for the standalone mock donation checkout flow. */
export const DONATION_FORM_PATH = "/donation-form";

export function donationFormUrl(options?: { item?: string; amount?: number }) {
  const params = new URLSearchParams();
  if (options?.amount && options.amount > 0) {
    params.set("amount", String(options.amount));
  }
  if (options?.item) {
    params.set("item", options.item);
  }
  const query = params.toString();
  return query ? `${DONATION_FORM_PATH}?${query}` : DONATION_FORM_PATH;
}
