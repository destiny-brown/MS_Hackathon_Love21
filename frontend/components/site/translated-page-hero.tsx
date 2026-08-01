"use client";

import { useTranslation } from "react-i18next";

import { PageHero } from "@/components/site/page-hero";

export function TranslatedPageHero({
  titleKey,
  subtitleKey,
  ns = "pages",
}: {
  titleKey: string;
  subtitleKey?: string;
  ns?: string;
}) {
  const { t } = useTranslation(ns);
  return <PageHero title={t(titleKey)} subtitle={subtitleKey ? t(subtitleKey) : undefined} />;
}
