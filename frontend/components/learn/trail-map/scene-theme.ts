import type { LocationTheme } from "@/lib/day-locations-data";

/** Tints the cinematic `.trail-scene-grid` backdrop per location so each stop feels distinct. */
export const SCENE_GRID_TINT: Record<LocationTheme, string> = {
  stadium: "rgba(232, 84, 62, 0.28)", // brand-coral
  harbour: "rgba(15, 118, 158, 0.28)", // brand-sea
  court: "rgba(31, 41, 51, 0.3)", // brand-ink
  wall: "rgba(15, 118, 158, 0.28)",
  track: "rgba(232, 84, 62, 0.28)",
  festival: "rgba(15, 118, 158, 0.28)",
};

export function sceneGridStyle(theme?: LocationTheme): Record<string, string> {
  return { "--scene-grid-tint": SCENE_GRID_TINT[theme ?? "stadium"] };
}
