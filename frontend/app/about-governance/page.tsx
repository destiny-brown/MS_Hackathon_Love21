import Link from "next/link";
import { Building2, FileText, Mail, Users } from "lucide-react";

import { Blob } from "@/components/brand/Blob";
import { BrandCard } from "@/components/brand/BrandCard";
import { CtaButton } from "@/components/brand/CtaButton";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Reveal } from "@/components/brand/Reveal";
import { PageSectionNav, type PageSectionNavItem } from "@/components/site/page-section-nav";
import { SiteLayout } from "@/components/site/site-layout";

const sectionNavItems: PageSectionNavItem[] = [
  { id: "about-us", label: "Company", labelKey: "sectionNav.company" },
  { id: "ready-to-connect", label: "Contact", labelKey: "sectionNav.contact" },
];

const sections = [
  {
    title: "Board of Directors",
    description: "Meet the leaders guiding Love 21's strategy, stewardship, and governance.",
    href: "/board-of-directors",
    icon: Building2,
  },
  {
    title: "Staff",
    description: "Learn about the team delivering programmes and community support.",
    href: "/staff",
    icon: Users,
  },
  {
    title: "Annual Reports",
    description: "Transparent reporting and financial stewardship updates.",
    href: "/our-finance",
    icon: FileText,
  },
  {
    title: "Contact Us",
    description: "Reach the team for partnerships, support, and community enquiries.",
    href: "/contact-us",
    icon: Mail,
  },
];

const cardAccents = ["bg-brand-red", "bg-brand-dark", "bg-brand-light", "bg-brand-slate"];

export default function AboutGovernancePage() {
  return (
    <SiteLayout>
      {/* Sentinel for section-nav reveal — not a nav target. */}
      <div id="about-governance-nav-sentinel" className="h-px w-full" aria-hidden="true" />

      <PageSectionNav
        items={sectionNavItems}
        ns="governance"
        heroSelector="#about-governance-nav-sentinel"
      />

      <Reveal>
        <section
          id="about-us"
          className="relative scroll-mt-24 overflow-hidden border-b border-brand-light bg-white px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16"
        >
          <Blob className="-right-16 -top-10 h-72 w-72 bg-[#F8DCDA] opacity-40" />
          <Blob className="-left-20 bottom-0 h-56 w-56 bg-[#B8C5E8]/30" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <Eyebrow>Governance &amp; Transparency</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-serif-display text-4xl leading-[1.05] text-brand-dark sm:text-5xl lg:text-6xl">
              About Us
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-dark/70">
              Core organisation information, leadership, transparency, and contact channels.
            </p>
          </div>
        </section>
      </Reveal>

      <section className="bg-brand-light/40 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <Reveal key={section.title} delay={i * 0.08}>
                  <BrandCard
                    as="article"
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-brand-slate/10 p-6 transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <span
                      className={`absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rotate-45 opacity-10 transition-opacity group-hover:opacity-20 ${cardAccents[i % cardAccents.length]}`}
                      aria-hidden="true"
                    />
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="font-serif-display text-2xl text-brand-dark sm:text-3xl">
                      {section.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-dark/75">
                      {section.description}
                    </p>
                    <Link
                      href={section.href}
                      className="group/link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red transition hover:text-brand-dark"
                    >
                      Open Section
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </BrandCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Reveal>
        <section
          id="ready-to-connect"
          className="scroll-mt-24 border-t border-brand-light bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-dark px-8 py-12 text-center text-white sm:px-12 sm:py-14">
            <div
              className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-red/10"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="font-serif-display text-3xl sm:text-4xl">Ready to connect?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Reach the team for partnerships, support, and community enquiries — or review our
                transparent reporting.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <CtaButton href="/contact-us">Contact Us</CtaButton>
                <CtaButton href="/our-finance" variant="outline-dark">
                  Annual Reports
                </CtaButton>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </SiteLayout>
  );
}
