import { PageHero } from "@/components/site/page-hero";
import { SiteLayout } from "@/components/site/site-layout";
import { internshipRequirements, internshipRoles } from "@/lib/site-data";

export default function JoinUsPage() {
  return (
    <SiteLayout>
      <PageHero title="Join Us" subtitle="Internship Opportunities" />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-lg text-brand-ink/80">
            We welcome students majoring in related fields to apply for an internship at Love 21! As an intern,
            you&apos;ll gain first-hand experience in the operations (back-end and front-end) and management of a young
            and growing NGO. Depending on your interests and major, as well as the duration of your internship, your
            roles may include:
          </p>

          <div>
            <h2 className="font-serif-display text-2xl text-brand-ink">Roles</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-brand-ink/80">
              {internshipRoles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl text-brand-ink">Requirements</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-brand-ink/80">
              {internshipRequirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>

          <p className="text-brand-ink/80">
            For interested parties, please send your CV and cover letter to Jeff (
            <a href="mailto:jeff@love21foundation.com" className="text-brand-coral hover:underline">
              jeff@love21foundation.com
            </a>
            ) and Maggie (
            <a href="mailto:maggie@love21foundation.com" className="text-brand-coral hover:underline">
              maggie@love21foundation.com
            </a>
            ).
          </p>
          <p className="text-brand-ink/80">
            We accept applications year round, and our internship programme can be tailored to suit your schedule. Please
            let us know your availability in your application.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
