"use client";

import { ContactForm } from "@/components/site/contact-form";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function MembersPage() {
  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="members.title" subtitleKey="members.subtitle" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}
