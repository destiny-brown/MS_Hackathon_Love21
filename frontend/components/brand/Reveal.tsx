"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds before the animation starts once in view. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Starting opacity (0–1). */
  opacity?: number;
  /** Slide direction when entering. */
  direction?: RevealDirection;
  /** Pixel distance to travel along `direction`. */
  distance?: number;
  /** Play the animation only the first time the element enters the viewport. */
  once?: boolean;
  /** Portion of the element that must be visible to trigger (0–1). */
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "whileInView" | "animate" | "transition" | "viewport">;

const OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Universal scroll-triggered reveal: fade in + subtle slide.
 * Use around top-level sections (or staggered cards) for consistent motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  opacity = 0,
  direction = "up",
  distance = 24,
  once = true,
  amount = 0.2,
  ...rest
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSETS[direction];
  const initialX = offset.x * distance;
  const initialY = offset.y * distance;

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity, x: initialX, y: initialY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
