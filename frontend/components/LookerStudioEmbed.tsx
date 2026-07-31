"use client";

import { useState } from "react";

interface LookerStudioEmbedProps {
  reportUrl: string;
  title?: string;
  height?: number;
}

export function LookerStudioEmbed({
  reportUrl,
  title = "Analytics Report",
  height = 600,
}: LookerStudioEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Ensure the URL uses the embed format
  const embedUrl = reportUrl.includes("/embed/")
    ? reportUrl
    : reportUrl.replace("/reporting/", "/embed/reporting/");

  return (
    <div className="w-full">
      <div className="relative" style={{ height: `${height}px` }}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Loading report...</span>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title}
          width="100%"
          height={height}
          allowFullScreen
          className={`rounded-lg border border-gray-200 transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <div className="mt-2 text-right">
        <a
          href={reportUrl.replace("/embed/reporting/", "/reporting/")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View Full Report ↗
        </a>
      </div>
    </div>
  );
}
