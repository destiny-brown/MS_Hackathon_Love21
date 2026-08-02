import { DonatePageContent } from "@/app/donate/donate-page-content";

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const { amount } = await searchParams;
  const suggestedAmount = Number(amount) || undefined;

  return <DonatePageContent suggestedAmount={suggestedAmount} />;
}
