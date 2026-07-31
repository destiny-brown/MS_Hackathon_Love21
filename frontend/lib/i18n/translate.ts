import type { TFunction } from "i18next";

/** Translate with English fallback from source data when locale key is missing. */
export function tx(t: TFunction, key: string, fallback: string): string {
  const value = t(key, { defaultValue: fallback });
  return value === key ? fallback : value;
}

export function txArray(t: TFunction, key: string, fallback: string[]): string[] {
  const value = t(key, { returnObjects: true, defaultValue: fallback });
  return Array.isArray(value) ? (value as string[]) : fallback;
}
