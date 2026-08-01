import { cn } from "@/lib/utils";

/**
 * Signature mark — Love 21 exists because of trisomy 21 (three copies of a chromosome).
 * Used as a divider, bullet, or eyebrow accent.
 */
export function TriMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 14"
      className={cn(className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <circle cx="7" cy="7" r="4.5" />
      <circle cx="22" cy="7" r="4.5" />
      <circle cx="37" cy="7" r="4.5" />
    </svg>
  );
}
