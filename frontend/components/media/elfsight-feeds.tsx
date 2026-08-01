"use client";

import type { ReactNode } from "react";
import Script from "next/script";
import { Instagram, Youtube } from "lucide-react";

const INSTAGRAM_WIDGET = "elfsight-app-174d449a-45f4-407a-904d-43c1df129c77";
const YOUTUBE_WIDGET = "elfsight-app-aacda520-0aaf-4df2-aab9-8cd974d52ca5";

export type ElfsightPlatform = "instagram" | "youtube";

function SocialFeedBlock({
  icon,
  iconClassName,
  title,
  handle,
  widgetClass,
}: {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  handle: string;
  widgetClass: string;
}) {
  return (
    <article className="rounded-3xl border border-brand-light bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-center justify-between border-b border-brand-light pb-3">
        <span className={`flex items-center gap-2 text-lg font-semibold text-brand-dark ${iconClassName ?? ""}`}>
          {icon}
          {title}
        </span>
        <span className="text-sm text-brand-dark/60">{handle}</span>
      </div>
      <div className="min-h-[280px] overflow-hidden rounded-2xl bg-white">
        <div className={widgetClass} data-elfsight-app-lazy />
      </div>
    </article>
  );
}

export function ElfsightFeeds({
  platforms = ["instagram", "youtube"],
}: {
  platforms?: ElfsightPlatform[];
}) {
  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className="space-y-6">
        {platforms.includes("instagram") ? (
          <SocialFeedBlock
            icon={<Instagram className="h-5 w-5 text-[#c32aa3]" aria-hidden="true" />}
            title="Instagram"
            handle="@love21foundation"
            widgetClass={INSTAGRAM_WIDGET}
          />
        ) : null}
        {platforms.includes("youtube") ? (
          <SocialFeedBlock
            icon={<Youtube className="h-5 w-5 text-red-600" aria-hidden="true" />}
            title="YouTube"
            handle="Love 21"
            widgetClass={YOUTUBE_WIDGET}
          />
        ) : null}
      </div>
    </>
  );
}
