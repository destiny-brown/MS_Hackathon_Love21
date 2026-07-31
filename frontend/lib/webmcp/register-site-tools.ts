import { executeCaptainTool, type CaptainToolExecutorContext } from "@/lib/captain/execute-site-tool";
import { SITE_LOCALES, SITE_NAV_PATHS } from "@/lib/captain/site-nav-paths";
import "@/lib/webmcp/types";

export function registerWebMcpSiteTools(ctx: CaptainToolExecutorContext): void {
  if (typeof navigator === "undefined" || !navigator.modelContext) return;

  const { registerTool } = navigator.modelContext;

  registerTool({
    name: "navigate_to_page",
    description: "Navigate the Love 21 site to a specific page for the user.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", enum: [...SITE_NAV_PATHS] },
      },
      required: ["path"],
    },
    execute: async (args) =>
      executeCaptainTool(
        { name: "navigate_to_page", arguments: { path: String(args.path ?? "") } },
        ctx,
      ),
  });

  registerTool({
    name: "set_site_language",
    description: "Switch the Love 21 site language (English, Cantonese, or Mandarin).",
    inputSchema: {
      type: "object",
      properties: {
        locale: { type: "string", enum: [...SITE_LOCALES] },
      },
      required: ["locale"],
    },
    execute: async (args) =>
      executeCaptainTool(
        { name: "set_site_language", arguments: { locale: String(args.locale ?? "") } },
        ctx,
      ),
  });
}
