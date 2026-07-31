import { notFound } from "next/navigation";

import { BoardMemberDetail } from "@/components/site/board-member-detail";
import { boardMembers } from "@/lib/site-data";

export function generateStaticParams() {
  return boardMembers.map((member) => ({ slug: member.slug }));
}

export default async function BoardMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = boardMembers.find((m) => m.slug === slug);

  if (!member) notFound();

  return <BoardMemberDetail member={member} />;
}
