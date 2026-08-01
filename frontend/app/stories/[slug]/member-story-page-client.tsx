"use client";

import Link from "next/link";

import { MemberStoryDetail } from "@/components/site/member-story-detail";
import { SiteLayout } from "@/components/site/site-layout";
import { getMemberStory } from "@/lib/member-stories";
import { useMemberStories } from "@/lib/use-member-stories";

type MemberStoryPageClientProps = {
  slug: string;
};

export function MemberStoryPageClient({ slug }: MemberStoryPageClientProps) {
  const stories = useMemberStories();
  const story = stories.find((entry) => entry.slug === slug) ?? getMemberStory(slug);

  if (!story) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
          <h1 className="font-serif-display text-3xl text-brand-ink">Story not found</h1>
          <p className="mt-3 text-sm text-brand-ink/65">This member story may have been removed or renamed.</p>
          <Link href="/stories-media#member-stories" className="mt-6 inline-flex text-sm font-semibold text-brand-coral hover:underline">
            ← Back to Stories &amp; Media
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return <MemberStoryDetail story={story} />;
}
