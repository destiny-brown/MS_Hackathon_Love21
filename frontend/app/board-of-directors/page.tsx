import { BoardMemberCard } from "@/components/site/board-member-card";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { boardMembers } from "@/lib/site-data";

export default function BoardOfDirectorsPage() {
  return (
    <SiteLayout>
      <TranslatedPageHero
        ns="governance"
        titleKey="boardPage.title"
        subtitleKey="boardPage.subtitle"
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
