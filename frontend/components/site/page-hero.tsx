import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  id,
  className,
}: {
  title: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  /** Optional id for sticky section-nav reveal observers. */
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("border-b border-brand-light bg-white px-4 py-14 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif-display text-4xl text-brand-ink sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-3xl text-lg leading-8 text-brand-ink/75">{subtitle}</p> : null}
        {primaryAction || secondaryAction ? (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {primaryAction ? (
              <Button asChild>
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button asChild variant="outline">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}