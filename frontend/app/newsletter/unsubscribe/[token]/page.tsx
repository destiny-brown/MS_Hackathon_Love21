"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function UnsubscribePage() {
  const { t } = useTranslation("pages");
  const params = useParams<{ token: string }>();
  const [message, setMessage] = useState(t("newsletter.unsubscribe.processing"));
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!params.token) return;
    api
      .unsubscribeNewsletter(params.token)
      .then((result) => {
        setEmail(result.email);
        setMessage(result.message);
        setDone(true);
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : "Could not unsubscribe");
      });
  }, [params.token]);

  return (
    <SiteLayout>
      <main className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <h1 className="font-serif-display text-4xl text-brand-ink">{t("newsletter.unsubscribe.title")}</h1>
        <p className="mt-4 text-brand-ink/75">{message}</p>
        {done && email ? <p className="mt-2 text-sm text-muted-foreground">{email}</p> : null}
        <Button asChild className="mt-8">
          <Link href="/">{t("newsletter.unsubscribe.returnHome")}</Link>
        </Button>
      </main>
    </SiteLayout>
  );
}
