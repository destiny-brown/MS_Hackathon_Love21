import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Love 21 Foundation",
  description: "Empowering the Down syndrome and autistic community in Hong Kong through sport, nutrition, and holistic support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
