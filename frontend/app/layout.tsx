// frontend/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

// 1. Import Font Awesome config and core styles
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// 2. Prevent Font Awesome from auto-adding CSS (Next.js handles this better)
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Love 21 Foundation",
  description:
    "Supporting individuals with Down syndrome, autism, and other neurodiverse conditions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Google Analytics Tracking */}
        <GoogleAnalytics gaId="G-CCKKQD1ZMX" />
      </body>
    </html>
  );
}
