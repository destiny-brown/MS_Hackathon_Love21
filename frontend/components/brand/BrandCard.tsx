import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BrandCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Render as a semantic element. Defaults to `div`. */
  as?: "div" | "article" | "aside" | "section";
};

/**
 * Soft card shell used for content blocks across marketing pages.
 */
export function BrandCard({
  children,
  className,
  as: Tag = "div",
  ...rest
}: BrandCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-brand-slate/20 bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
