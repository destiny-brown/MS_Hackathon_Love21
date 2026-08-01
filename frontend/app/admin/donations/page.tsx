import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SupportOpportunityManager } from "@/components/support-opportunity-manager";

export default function AdminDonationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Donations & wishlist"
        description="Manage campaigns, ongoing causes, and wishlist needs shown on Donate, Shop, and supporter pages."
      />
      <SupportOpportunityManager />
    </>
  );
}
