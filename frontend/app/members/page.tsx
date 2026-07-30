import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function MembersPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Members"
        subtitle="Register to join Love 21 programmes and activities."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}
