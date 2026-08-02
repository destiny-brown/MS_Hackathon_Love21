"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotAuthorizedPage() {
  const { t } = useTranslation("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("notAuthorized.title")}</CardTitle>
          <CardDescription>{t("notAuthorized.descriptionLong")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Link className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/login">
            {t("notAuthorized.loginDifferent")}
          </Link>
          <br />
          <Link className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/">
            {t("notAuthorized.returnPublic")}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
