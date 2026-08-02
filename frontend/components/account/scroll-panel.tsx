import { cn } from "@/lib/utils";

export function ScrollPanel({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain rounded-xl border border-brand-sand/80 bg-brand-cream/30 p-2 sm:max-h-[480px] sm:p-3",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-sand",
        className,
      )}
      aria-label={label}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
