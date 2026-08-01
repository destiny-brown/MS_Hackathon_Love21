import type { YouTubeVideo } from "@/lib/api";

/** Hand-picked videos from trusted channels — no API quota needed. */
export const curatedVideos: YouTubeVideo[] = [
  {
    video_id: "RbwRrVw-CRo",
    title: "Amazing Things Happen — Understanding Autism",
    channel_title: "National Autistic Society",
    published_at: "2017-07-18T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/RbwRrVw-CRo/hqdefault.jpg",
  },
  {
    video_id: "Lk4qs8jGN4U",
    title: "What is Autism?",
    channel_title: "National Autistic Society",
    published_at: "2019-04-01T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/Lk4qs8jGN4U/hqdefault.jpg",
  },
  {
    video_id: "xHHwZJX67-M",
    title: "Make it Stop — Too Much Information",
    channel_title: "National Autistic Society",
    published_at: "2017-03-28T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/xHHwZJX67-M/hqdefault.jpg",
  },
  {
    video_id: "DgDR_gYk_a8",
    title: "Autism TMI — Virtual Reality Experience",
    channel_title: "National Autistic Society",
    published_at: "2016-06-09T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/DgDR_gYk_a8/hqdefault.jpg",
  },
  {
    video_id: "ycCN3qTYVyo",
    title: "Autism and Sensory Sensitivity",
    channel_title: "National Autistic Society",
    published_at: "2014-04-09T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/ycCN3qTYVyo/hqdefault.jpg",
  },
  {
    video_id: "2HFT59njEEU",
    title: "No Limitations — NDSS 40th Anniversary",
    channel_title: "National Down Syndrome Society",
    published_at: "2019-02-01T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/2HFT59njEEU/hqdefault.jpg",
  },
  {
    video_id: "KW_F7xG5J5c",
    title: "Assume That I Can — World Down Syndrome Day",
    channel_title: "NDSS",
    published_at: "2024-03-21T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/KW_F7xG5J5c/hqdefault.jpg",
  },
  {
    video_id: "K-qSX864L-o",
    title: "Amazing Things Happen (Extended)",
    channel_title: "Alex Amelines",
    published_at: "2016-01-01T00:00:00Z",
    thumbnail_url: "https://img.youtube.com/vi/K-qSX864L-o/hqdefault.jpg",
  },
];

export function filterCuratedVideos(query: string, source: YouTubeVideo[] = curatedVideos): YouTubeVideo[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return source;

  return source.filter((video) => {
    const haystack = `${video.title} ${video.channel_title}`.toLowerCase();
    return tokens.some((token) => haystack.includes(token));
  });
}
