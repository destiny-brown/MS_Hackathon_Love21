import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { CaptainToolCall } from "@/lib/api";
import { SITE_LOCALES, SITE_NAV_PATHS, type SiteNavPath, type SiteToolLocale } from "@/lib/captain/site-nav-paths";
import type { SiteLocale } from "@/lib/i18n/locales";

export type CaptainToolExecutorContext = {
  router: AppRouterInstance;
  setLocale: (locale: SiteLocale) => void;
};

function isNavPath(path: string): path is SiteNavPath {
  return (SITE_NAV_PATHS as readonly string[]).includes(path);
}

function isSiteLocale(locale: string): locale is SiteToolLocale {
  return (SITE_LOCALES as readonly string[]).includes(locale);
}

export function executeCaptainTool(
  call: CaptainToolCall,
  ctx: CaptainToolExecutorContext,
): string {
  if (call.name === "navigate_to_page") {
    const path = call.arguments.path ?? "";
    if (!isNavPath(path)) {
      return `Could not navigate: unknown path "${path}".`;
    }
    ctx.router.push(path);
    return `Opened ${path} for you.`;
  }

  if (call.name === "set_site_language") {
    const locale = call.arguments.locale ?? "";
    if (!isSiteLocale(locale)) {
      return `Could not change language: unknown locale "${locale}".`;
    }
    ctx.setLocale(locale);
    return `Site language set to ${locale}.`;
  }

  return `Unknown tool: ${call.name}`;
}
