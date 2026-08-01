import { cn } from "@/lib/utils";

export function PageHero({
  title,
  subtitle,
  id,
  className,
}: {
  title: string;
  subtitle?: string;
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
        <h1 className="font-serif-display text-4xl text-brand-dark sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-3xl text-lg text-brand-slate">{subtitle}</p> : null}
      </div>
    </section>
  );
}
