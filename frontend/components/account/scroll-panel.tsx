import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "max-h-[min(220px,38vh)] p-2 sm:max-h-[240px]",
  md: "max-h-[min(420px,55vh)] p-2 sm:max-h-[480px] sm:p-3",
  lg: "max-h-[min(520px,62vh)] p-2 sm:max-h-[560px] sm:p-3",
} as const;

export function ScrollPanel({
  children,
  className,
  label,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  size?: keyof typeof sizeClasses;
}) {
  return (
    <div
      className={cn(
        "overflow-y-auto overscroll-contain rounded-xl border border-brand-sand/80 bg-brand-cream/30",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-sand",
        sizeClasses[size],
        className,
      )}
      aria-label={label}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
