import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LearnVideosAdminPanel } from "@/components/admin/learn-videos-admin-panel";

export default function AdminLearnVideosPage() {
  return (
    <>
      <AdminPageHeader
        title="Learn short videos"
        description="Curate YouTube clips for the Learn short videos page."
      />
      <LearnVideosAdminPanel />
    </>
  );
}
