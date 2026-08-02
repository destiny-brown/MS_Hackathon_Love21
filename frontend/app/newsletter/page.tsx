"use client";

import { NewsletterForm } from "@/components/site/newsletter-form";
import { TranslatedPageHero } from "@/components/site/translated-page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function NewsletterPage() {
  return (
    <SiteLayout>
      <TranslatedPageHero titleKey="newsletter.signupTitle" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <NewsletterForm />
        </div>
      </section>
    </SiteLayout>
  );
}
