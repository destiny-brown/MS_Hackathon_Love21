import { DonatePageContent } from "@/app/donate/donate-page-content";

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const { amount, item } = await searchParams;
  const suggestedAmount = Number(amount) || undefined;

  return <DonatePageContent suggestedAmount={suggestedAmount} initialItemSlug={item} />;
}
