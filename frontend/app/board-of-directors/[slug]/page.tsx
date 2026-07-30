import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/site/site-layout";
import { boardMembers } from "@/lib/site-data";

export function generateStaticParams() {
  return boardMembers.map((member) => ({ slug: member.slug }));
}

export default async function BoardMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = boardMembers.find((m) => m.slug === slug);

  if (!member) notFound();

  return (
    <SiteLayout>
      <section className="border-b border-brand-sand bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/board-of-directors" className="text-sm text-brand-coral hover:underline">
            ← Board of Directors
          </Link>
          <h1 className="mt-4 font-serif-display text-4xl text-brand-ink">{member.name}</h1>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-brand-ink/80">{member.bio}</p>
        </div>
      </section>
    </SiteLayout>
  );
}
