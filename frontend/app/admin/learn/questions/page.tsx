import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LearnQuestionsAdminPanel } from "@/components/admin/learn-questions-admin-panel";

export default function AdminLearnQuestionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Learn questions"
        description="Edit myth-vs-fact quiz and daily myth items. Use Qwen to draft new questions, then publish when ready."
      />
      <LearnQuestionsAdminPanel />
    </>
  );
}
