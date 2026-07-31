"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";

export default function MemberProfilePage() {
  const { t } = useTranslation("auth");
  const { user, loading, error } = useRequireRoles("member");
  const [profileStatus, setProfileStatus] = useState("");

  useEffect(() => {
    if (user?.role !== "member") return;
    api.memberProfile()
      .then((profile) => setProfileStatus(profile.profile_status))
      .catch((err) => setProfileStatus(err instanceof Error ? err.message : t("portal.memberLoadError")));
  }, [user, t]);

  if (loading || !user || user.role !== "member") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">{t("portal.checkingMember")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("portal.profileTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("portal.signedInAs", { email: user.email, role: user.role })}</p>
          </div>
          <Button variant="outline" onClick={signOutToLogin}>{t("portal.logout")}</Button>
        </header>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        <Card>
          <CardHeader>
            <CardTitle>{t("portal.memberManageTitle")}</CardTitle>
            <CardDescription>{t("portal.memberManageDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("portal.memberEndpoint")} {profileStatus || t("portal.loading")}</p>
            <form className="grid gap-4" aria-label={t("portal.memberFormLabel")}>
              <label className="grid gap-2 text-sm font-medium" htmlFor="display-name">
                {t("portal.memberDisplayName")}
                <input id="display-name" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={t("portal.memberDisplayPlaceholder")} />
              </label>
              <label className="grid gap-2 text-sm font-medium" htmlFor="programme-interest">
                {t("portal.memberProgrammeInterest")}
                <textarea id="programme-interest" className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={t("portal.memberProgrammePlaceholder")} />
              </label>
              <Button type="button">{t("portal.memberSaveDraft")}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
