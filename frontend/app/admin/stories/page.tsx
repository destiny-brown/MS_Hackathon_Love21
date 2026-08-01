import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MemberStoriesAdminPanel } from "@/components/admin/member-stories-admin-panel";

export default function AdminStoriesPage() {
  return (
    <>
      <AdminPageHeader
        title="Member stories"
        description="Update the carousel and full story pages on Stories & Media. Changes are stored locally in the browser — seeded Love 21 content remains the default."
      />
      <MemberStoriesAdminPanel />
    </>
  );
}
