import { cn } from "@/lib/utils";

type SupportProgressProps = {
  label: string;
  fundedAmount: number;
  targetAmount: number;
  progressPercent: number;
  className?: string;
};

export function formatHkd(amount: number) {
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SupportProgress({
  label,
  fundedAmount,
  targetAmount,
  progressPercent,
  className,
}: SupportProgressProps) {
  const visibleProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-brand-dark/70">
          {formatHkd(fundedAmount)} of {formatHkd(targetAmount)}
        </span>
        <span className="font-semibold text-brand-slate">{progressPercent}% funded</span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-brand-light/45"
        role="progressbar"
        aria-label={`${label} funding progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={visibleProgress}
      >
        <div
          className="h-full rounded-full bg-brand-red transition-[width]"
          style={{ width: `${visibleProgress}%` }}
        />
      </div>
    </div>
  );
}
