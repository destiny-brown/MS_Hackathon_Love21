"use client";

import { CaptainChatWidget } from "@/components/learn/captain-chat-widget";
import { CaptainToolsProvider } from "@/components/captain/captain-tools-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { useTranslation } from "react-i18next";
import { FloatingCta } from "@/components/site/floating-cta";

function SiteLayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-dark focus:px-4 focus:py-2 focus:text-white"
      >
        {t("a11y.skipToContent")}
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <CaptainToolsProvider>
        <CaptainChatWidget />
      </CaptainToolsProvider>
    </div>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayoutInner>{children}
      <FloatingCta />
  </SiteLayoutInner>;
}
