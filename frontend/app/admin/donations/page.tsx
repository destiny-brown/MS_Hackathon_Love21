"use client";

import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SupportOpportunityManager } from "@/components/support-opportunity-manager";

export default function AdminDonationsPage() {
  const { t } = useTranslation("admin");

  return (
    <>
      <AdminPageHeader
        title={t("donations.title")}
        description={t("donations.description")}
      />
      <SupportOpportunityManager />
    </>
  );
}
