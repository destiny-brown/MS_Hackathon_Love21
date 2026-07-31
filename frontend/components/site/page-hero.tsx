export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b border-brand-light bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif-display text-4xl text-brand-dark sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-3xl text-lg text-brand-slate">{subtitle}</p> : null}
      </div>
    </section>
  );
}
