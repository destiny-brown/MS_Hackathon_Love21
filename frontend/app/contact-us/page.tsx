import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";

export default function ContactUsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="CONTACT US"
        subtitle="If you'd like to join our programme, donate, volunteer or just find out more information, please get in touch. We'd love to hear from you!"
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6 text-brand-ink/80">
            <p>
              For member registration, please{" "}
              <Link href="/members" className="text-brand-coral hover:underline">
                fill out the form here
              </Link>
              . For volunteering, please check out the{" "}
              <Link href="/our-volunteer" className="text-brand-coral hover:underline">
                volunteer page
              </Link>{" "}
              for details and registration.
            </p>
            <p>
              For partnership, please contact Jeff (Founder/CEO):{" "}
              <a href="mailto:jeff@love21foundation.com" className="text-brand-coral hover:underline">
                jeff@love21foundation.com
              </a>
            </p>
            <p>
              For other enquiries, please fill out the form or contact us at{" "}
              <a href="mailto:info@love21foundation.com" className="text-brand-coral hover:underline">
                info@love21foundation.com
              </a>
            </p>
            <div className="space-y-4 pt-4">
              <div>
                <p className="font-semibold text-brand-ink">Love 21 Space</p>
                <p>2/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon</p>
              </div>
              <div>
                <p className="font-semibold text-brand-ink">Love 21 Office (for correspondences)</p>
                <p>1102, 11/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}
