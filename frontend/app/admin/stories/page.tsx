"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MemberStoriesAdminPanel } from "@/components/admin/member-stories-admin-panel";

export default function AdminStoriesPage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("stories.title")}
        description={t("stories.description")}
      />
      <MemberStoriesAdminPanel />
    </>
  );
}
