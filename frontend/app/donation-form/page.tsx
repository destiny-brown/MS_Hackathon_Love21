import { redirect } from "next/navigation";

export default async function DonationFormRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const { amount, item } = await searchParams;
  const query = new URLSearchParams();

  if (amount) {
    query.set("amount", amount);
  }

  if (item) {
    query.set("item", item);
  }

  const queryString = query.toString();
  const destination = queryString
    ? `/donate?${queryString}#donation-form`
    : "/donate#donation-form";

  redirect(destination);
}
