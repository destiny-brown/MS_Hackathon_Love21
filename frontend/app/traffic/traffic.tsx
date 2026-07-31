// frontend/app/traffic.tsx
import { LookerStudioEmbed } from "@/components/LookerStudioEmbed";

export default function TrafficPage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}
      >
        📊 Website Traffic & Engagement
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Real-time analytics and visitor insights for the Love 21 Foundation
        website.
      </p>

      <LookerStudioEmbed
        reportUrl="https://datastudio.google.com/embed/reporting/7316b137-05d9-410b-b60b-77fda673c457/page/XCC5F" // Your actual URL
        title="Love 21 Analytics Dashboard"
        height={700}
      />
    </main>
  );
}
