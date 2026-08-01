"use client";

import { NewsletterForm } from "@/components/site/newsletter-form";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function NewsletterPage() {
  return (
    <SiteLayout>
      <PageHero title="Sign up for Love 21 Foundation Newsletter" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <NewsletterForm />
        </div>
      </section>
    </SiteLayout>
  );
}
