"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LearnVideosAdminPanel } from "@/components/admin/learn-videos-admin-panel";

export default function AdminLearnVideosPage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("learn.videosTitle")}
        description={t("learn.videosDescription")}
      />
      <LearnVideosAdminPanel />
    </>
  );
}
