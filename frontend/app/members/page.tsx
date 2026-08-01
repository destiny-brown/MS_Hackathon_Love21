import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";

const memberSteps = [
  "Tell us who you are and how to contact you.",
  "Love 21 will follow up with the right programme information.",
  "You can log in later if you already have a member account.",
];

export default function MembersPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Join as a Member"
        subtitle="For people and families who want to take part in Love 21 programmes. Start with a short enquiry — browsing the website does not require login."
      />
      <div className="border-b border-brand-light bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          <Button asChild>
            <Link href="#member-enquiry">Start enquiry</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login?role=member">Member login</Link>
          </Button>
        </div>
      </div>
      <section id="member-enquiry" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1fr]">
          <aside className="rounded-3xl border border-brand-sand bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">What happens next</p>
            <h2 className="mt-2 font-serif-display text-3xl text-brand-ink">A simple first step</h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-brand-ink/75">
              {memberSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-cream font-semibold text-brand-coral">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/our-programmes">See programmes first</Link>
            </Button>
          </aside>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
