/** Minimal WebMCP types for early-preview Chrome (navigator.modelContext). */
export type WebMcpToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
};

export type WebMcpModelContext = {
  registerTool: (tool: WebMcpToolDefinition) => void;
};

declare global {
  interface Navigator {
    modelContext?: WebMcpModelContext;
  }
}

export {};
