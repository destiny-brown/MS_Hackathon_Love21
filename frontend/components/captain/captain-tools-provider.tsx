"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";

import { useSitePreferences } from "@/components/site/site-preferences";
import { executeCaptainTool, type CaptainToolExecutorContext } from "@/lib/captain/execute-site-tool";
import type { CaptainToolCall } from "@/lib/api";
import { registerWebMcpSiteTools } from "@/lib/webmcp/register-site-tools";

type CaptainToolsContextValue = {
  runTool: (call: CaptainToolCall) => string;
  runTools: (calls: CaptainToolCall[]) => string[];
};

const CaptainToolsContext = createContext<CaptainToolsContextValue | null>(null);

export function CaptainToolsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setLocale } = useSitePreferences();

  const executorContext = useMemo<CaptainToolExecutorContext>(
    () => ({ router, setLocale }),
    [router, setLocale],
  );

  const runTool = useCallback(
    (call: CaptainToolCall) => executeCaptainTool(call, executorContext),
    [executorContext],
  );

  const runTools = useCallback(
    (calls: CaptainToolCall[]) => calls.map((call) => runTool(call)),
    [runTool],
  );

  useEffect(() => {
    registerWebMcpSiteTools(executorContext);
  }, [executorContext]);

  const value = useMemo(() => ({ runTool, runTools }), [runTool, runTools]);

  return <CaptainToolsContext.Provider value={value}>{children}</CaptainToolsContext.Provider>;
}

export function useCaptainTools() {
  const context = useContext(CaptainToolsContext);
  if (!context) {
    throw new Error("useCaptainTools must be used within CaptainToolsProvider");
  }
  return context;
}
