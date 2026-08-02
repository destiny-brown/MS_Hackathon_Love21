"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LearnResourcesAdminPanel } from "@/components/admin/learn-resources-admin-panel";

export default function AdminLearnResourcesPage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("learn.resourcesTitle")}
        description={t("learn.resourcesDescription")}
      />
      <LearnResourcesAdminPanel />
    </>
  );
}
