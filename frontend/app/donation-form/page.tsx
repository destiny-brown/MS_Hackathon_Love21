import { redirect } from "next/navigation";

import { donatePageUrl } from "@/lib/donation-form-anchor";

export default async function DonationFormRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const { amount, item } = await searchParams;

  redirect(
    donatePageUrl({
      item: item || undefined,
      amount: amount ? Number(amount) : undefined,
    }),
  );
}
