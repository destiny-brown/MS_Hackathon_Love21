import type { ReactNode } from "react";

import { TriMark } from "@/components/brand/TriMark";
import { cn } from "@/lib/utils";

export type EyebrowProps = {
  /** Plain label text (alternative to children). */
  text?: string;
  children?: ReactNode;
  className?: string;
  /** Decorative mark before the label. Defaults to TriMark. Pass `null` to hide. */
  mark?: ReactNode | null;
};

/**
 * Section eyebrow — uppercase tracked label with optional TriMark accent.
 */
export function Eyebrow({
  text,
  children,
  className,
  mark,
}: EyebrowProps) {
  const label = children ?? text;
  const accent =
    mark === null ? null : (mark ?? <TriMark className="h-2 w-7" />);

  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-red",
        className,
      )}
    >
      {accent}
      {label}
    </p>
  );
}
