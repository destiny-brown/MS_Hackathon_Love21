"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function VolunteerPortalPage() {
  const { t } = useTranslation("auth");
  const router = useRouter();

  useEffect(() => {
    router.replace("/supporter/dashboard");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">
        {t("portal.redirectSupporter")}
      </p>
    </main>
  );
}
