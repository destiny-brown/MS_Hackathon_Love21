"use client";

import { useTranslation } from "react-i18next";

import { PageHero } from "@/components/site/page-hero";

export function TranslatedPageHero({
  titleKey,
  subtitleKey,
  ns = "pages",
  actionNs,
  primaryActionKey,
  primaryActionHref,
  secondaryActionKey,
  secondaryActionHref,
  id,
  className,
}: {
  titleKey: string;
  subtitleKey?: string;
  ns?: string;
  actionNs?: string;
  primaryActionKey?: string;
  primaryActionHref?: string;
  secondaryActionKey?: string;
  secondaryActionHref?: string;
  id?: string;
  className?: string;
}) {
  const { t } = useTranslation(ns);
  const { t: tAction } = useTranslation(actionNs ?? ns);

  const primaryAction =
    primaryActionKey && primaryActionHref
      ? { label: tAction(primaryActionKey), href: primaryActionHref }
      : undefined;
  const secondaryAction =
    secondaryActionKey && secondaryActionHref
      ? { label: tAction(secondaryActionKey), href: secondaryActionHref }
      : undefined;

  return (
    <PageHero
      id={id}
      className={className}
      title={t(titleKey)}
      subtitle={subtitleKey ? t(subtitleKey) : undefined}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    />
  );
}
