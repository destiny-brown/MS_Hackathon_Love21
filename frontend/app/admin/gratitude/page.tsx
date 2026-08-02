"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GratitudeModerationPanel } from "@/components/admin/gratitude-moderation-panel";

export default function AdminGratitudePage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("gratitude.title")}
        description={t("gratitude.description")}
      />
      <GratitudeModerationPanel />
    </>
  );
}
