"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LearnQuestionsAdminPanel } from "@/components/admin/learn-questions-admin-panel";

export default function AdminLearnQuestionsPage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("learn.questionsTitle")}
        description={t("learn.questionsDescription")}
      />
      <LearnQuestionsAdminPanel />
    </>
  );
}
