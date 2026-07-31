"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faSpinner,
  faClock,
  faDatabase,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

interface LookerStudioEmbedProps {
  reportUrl: string;
  title?: string;
  height?: string;
  width?: string;
}

export function LookerStudioEmbed({
  reportUrl,
  title = "Analytics Dashboard",
  height = "600px",
  width = "100%",
}: LookerStudioEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Extract the report ID from the URL for tracking
  const reportId = reportUrl.split("/").pop() || "unknown";

  useEffect(() => {
    // Track when the iframe loads
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "looker-studio-loaded") {
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="w-full rounded-lg border border-[#edebe7] bg-white/90 p-4 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#eee9e2] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4a373]/20 text-[#d4a373]">
            <FontAwesomeIcon icon={faChartLine} className="text-sm" />
          </div>
          <h3 className="text-lg font-semibold text-[#1e2b2f]">{title}</h3>
        </div>
        {isLoading && (
          <span className="text-sm text-[#7b7b7b]">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Loading...
          </span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-lg" style={{ height }}>
        <iframe
          src={reportUrl}
          style={{
            width,
            height,
            border: "none",
            borderRadius: "8px",
          }}
          allow="clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          title={title}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#7b7b7b]">
        <span>
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          Data updates automatically
        </span>
        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d4a373] hover:underline"
        >
          Open full report{" "}
          <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
        </a>
      </div>
    </div>
  );
}
