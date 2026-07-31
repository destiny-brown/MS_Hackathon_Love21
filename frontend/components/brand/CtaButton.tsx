import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variantStyles = {
  solid:
    "bg-brand-red text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] hover:bg-brand-crimson hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)]",
  outline:
    "border border-brand-red text-brand-red hover:bg-brand-red hover:text-white",
  "outline-dark":
    "border border-white/30 text-white hover:border-white hover:bg-white hover:text-brand-dark",
} as const;

export type CtaButtonVariant = keyof typeof variantStyles;

export type CtaButtonProps = {
  children: ReactNode;
  variant?: CtaButtonVariant;
  className?: string;
  /** Show the trailing arrow. Defaults to true. */
  showArrow?: boolean;
  /** When set, renders a Next.js Link. */
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] | AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "onClick">;

/**
 * Rounded pill CTA used across marketing pages.
 */
export function CtaButton({
  children,
  variant = "solid",
  className,
  showArrow = true,
  href,
  onClick,
  type = "button",
  ...rest
}: CtaButtonProps) {
  const classes = cn(
    "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300",
    variantStyles[variant],
    className,
  );

  const content = (
    <>
      {children}
      {showArrow ? (
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as AnchorHTMLAttributes<HTMLAnchorElement>["onClick"]}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick as ButtonHTMLAttributes<HTMLButtonElement>["onClick"]} {...rest}>
      {content}
    </button>
  );
}
