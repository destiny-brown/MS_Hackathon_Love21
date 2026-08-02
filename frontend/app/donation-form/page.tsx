import { DonationFormPageContent } from "@/app/donation-form/donation-form-page-content";

export default async function DonationFormPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; item?: string }>;
}) {
  const { amount, item } = await searchParams;
  const suggestedAmount = Number(amount) || undefined;

  return <DonationFormPageContent suggestedAmount={suggestedAmount} initialItemSlug={item} />;
}
