import { notFound } from "next/navigation";

import { MemberStoryDetail } from "@/components/site/member-story-detail";
import { getMemberStory, memberStories } from "@/lib/member-stories";

export function generateStaticParams() {
  return memberStories.map((story) => ({ slug: story.slug }));
}

export default async function MemberStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getMemberStory(slug);

  if (!story) notFound();

  return <MemberStoryDetail story={story} />;
}
