"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

interface NewsletterPreviewProps {
  subject: string;
  content: string;
  unsubscribeUrl?: string;
}

export function NewsletterPreview({ subject, content, unsubscribeUrl }: NewsletterPreviewProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api
      .previewNewsletter({
        subject,
        content,
        ...(unsubscribeUrl ? { unsubscribe_url: unsubscribeUrl } : {}),
      })
      .then((response) => {
        if (!active) return;
        setHtml(response.html);
      })
      .catch((err) => {
        if (!active) return;
        setHtml(null);
        setError(err instanceof Error ? err.message : "Could not render preview");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [subject, content, unsubscribeUrl]);

  if (loading) {
    return (
      <div className="rounded-lg border bg-gray-50 p-6 text-sm text-muted-foreground" role="status">
        Rendering email preview from backend template…
      </div>
    );
  }

  if (error || !html) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
        {error || "Preview unavailable"}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-[#f7f3ef]">
      <iframe
        title="Newsletter email preview"
        srcDoc={html}
        className="h-[720px] w-full border-0 bg-white"
        sandbox=""
      />
    </div>
  );
}
