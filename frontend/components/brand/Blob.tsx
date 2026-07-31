import { cn } from "@/lib/utils";

/**
 * Soft blurred circle used sparingly to give flat sections a bit of depth.
 * Place inside a `relative` section; size/color via className.
 */
export function Blob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
    />
  );
}
