import { PageHero } from "@/components/site/page-hero";
import { BoardMemberCard } from "@/components/site/board-member-card";
import { SiteLayout } from "@/components/site/site-layout";
import { boardMembers } from "@/lib/site-data";

export default function BoardOfDirectorsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="BOARD OF DIRECTORS"
        subtitle="Our Board of Directors is comprised of caring individuals from diverse professional backgrounds in Hong Kong, who bring their various talents and passion to support and strengthen Love 21."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {boardMembers.map((member) => (
            <BoardMemberCard key={member.slug} member={member} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
