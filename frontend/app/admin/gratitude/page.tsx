import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GratitudeModerationPanel } from "@/components/admin/gratitude-moderation-panel";

export default function AdminGratitudePage() {
  return (
    <>
      <AdminPageHeader
        title="Gratitude wall"
        description="Review member gratitude submissions before they appear on the public site."
      />
      <GratitudeModerationPanel />
    </>
  );
}
