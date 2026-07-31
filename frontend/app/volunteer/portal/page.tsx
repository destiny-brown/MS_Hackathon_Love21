"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";

export default function VolunteerPortalPage() {
  const { t } = useTranslation("auth");
  const { user, loading, error } = useRequireRoles("volunteer");
  const [donationStatus, setDonationStatus] = useState("");

  useEffect(() => {
    if (user?.role !== "volunteer") return;
    api.recurringDonation()
      .then((donation) => setDonationStatus(donation.status))
      .catch((err) => setDonationStatus(err instanceof Error ? err.message : t("portal.volunteerLoadError")));
  }, [user, t]);

  if (loading || !user || user.role !== "volunteer") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">{t("portal.checkingVolunteer")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("portal.volunteerTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("portal.signedInAs", { email: user.email, role: user.role })}</p>
          </div>
          <Button variant="outline" onClick={signOutToLogin}>{t("portal.logout")}</Button>
        </header>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        <Card>
          <CardHeader>
            <CardTitle>{t("portal.volunteerTrackTitle")}</CardTitle>
            <CardDescription>{t("portal.volunteerTrackDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{t("portal.volunteerEndpoint")} {donationStatus || t("portal.loading")}</p>
            <Button type="button">{t("portal.volunteerUpdateBtn")}</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
