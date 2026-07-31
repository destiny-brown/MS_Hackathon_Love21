"use client";

const SESSION_KEY = "love21_analytics_session";

export type TrackProperties = Record<string, string | number | boolean | null | undefined>;

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sessionId = window.sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function track(
  eventName: string,
  properties: TrackProperties = {},
  options?: { locale?: string; pagePath?: string },
) {
  if (typeof window === "undefined") return;

  const payload = {
    event_name: eventName,
    session_id: getSessionId(),
    locale: options?.locale,
    page_path: options?.pagePath ?? window.location.pathname,
    properties: Object.fromEntries(
      Object.entries(properties).filter(([, value]) => value !== undefined),
    ) as Record<string, string | number | boolean | null>,
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  void fetch(`${apiUrl}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Analytics should never block UX.
  });
}
