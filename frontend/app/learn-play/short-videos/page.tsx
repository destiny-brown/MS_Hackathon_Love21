import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

const shortVideos = [
  {
    title: "Why Autism is a Difference, not a Deficit",
    videoUrl: "https://www.youtube.com/watch?v=We2fJz866NU",
    channelName: "Ambitious about Autism",
  },
  {
    title: "What is Autism? Neurodiversity Affirming Video for Students",
    videoUrl: "https://www.youtube.com/watch?v=bRL7M5oGT6Q",
    channelName: "The Neurodivergent Teacher",
  },
  {
    title: "Things Autistic People Are Tired Of Hearing",
    videoUrl: "https://www.youtube.com/watch?v=PJ2UquTTzjA",
    channelName: "BBC Three",
  },
  {
    title: "Living with Down syndrome",
    videoUrl: "https://www.youtube.com/watch?v=O19hQ_1meR0",
    channelName: "National Health Service (NHS)",
  },
];

function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  if (match?.[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return "/images/love21_logo.png";
}

export default function ShortVideosPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Short Videos"
        subtitle="Neurodiversity education clips for families, volunteers, and community partners."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link href="/learn-play" className="text-sm font-semibold text-brand-coral hover:underline">
              ← Back to Learn
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shortVideos.map((video) => (
              <a
                key={video.videoUrl}
                href={video.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-brand-sand bg-white"
              >
                <img
                  src={getYouTubeThumbnail(video.videoUrl)}
                  alt={video.title}
                  className="aspect-video w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-brand-ink">{video.title}</p>
                  <p className="mt-1 text-xs text-brand-ink/65">{video.channelName}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
