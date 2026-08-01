import { MemberStoryPageClient } from "@/app/stories/[slug]/member-story-page-client";
import { memberStories } from "@/lib/member-stories";

export function generateStaticParams() {
  return memberStories.map((story) => ({ slug: story.slug }));
}

export default async function MemberStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MemberStoryPageClient slug={slug} />;
}
