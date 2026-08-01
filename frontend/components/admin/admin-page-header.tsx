type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="mb-8 border-b border-brand-sand/70 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">Staff workspace</p>
          <h1 className="mt-1 font-serif-display text-3xl text-brand-ink sm:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink/65">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
