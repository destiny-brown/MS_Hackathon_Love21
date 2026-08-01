import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LearnResourcesAdminPanel } from "@/components/admin/learn-resources-admin-panel";

export default function AdminLearnResourcesPage() {
  return (
    <>
      <AdminPageHeader
        title="Learn resources"
        description="Manage articles and external links shown on the public Learn resources page."
      />
      <LearnResourcesAdminPanel />
    </>
  );
}
