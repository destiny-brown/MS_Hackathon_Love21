"use client";

import { useTranslation } from "react-i18next";

import { useSitePreferences } from "@/components/site/site-preferences";

export type AccessibilityOptionsPanelProps = {
  /** Show the section title row (used in dropdown; drawer supplies its own heading). */
  showHeading?: boolean;
  onRequestClose?: () => void;
  className?: string;
};

export function AccessibilityOptionsPanel({
  showHeading = true,
  onRequestClose,
  className,
}: AccessibilityOptionsPanelProps) {
  const { t } = useTranslation("common");
  const {
    a11y,
    setFontScale,
    toggleHighContrast,
    toggleReduceMotion,
    toggleUnderlineLinks,
    resetAccessibility,
  } = useSitePreferences();

  return (
    <div className={className}>
      {showHeading ? (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{t("a11y.options")}</p>
          {onRequestClose ? (
            <button
              type="button"
              onClick={onRequestClose}
              className="rounded px-2 py-1 text-xs text-brand-ink/60 hover:bg-brand-sand/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
            >
              {t("a11y.close")}
            </button>
          ) : null}
        </div>
      ) : null}

      <fieldset className={showHeading ? "mt-4" : undefined}>
        <legend className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55">
          {t("a11y.textSize")}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["normal", t("a11y.textSizeNormal")],
              ["large", t("a11y.textSizeLarge")],
              ["xl", t("a11y.textSizeExtraLarge")],
            ] as const
          ).map(([scale, label]) => (
            <button
              key={scale}
              type="button"
              aria-pressed={a11y.fontScale === scale}
              onClick={() => setFontScale(scale)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral ${
                a11y.fontScale === scale
                  ? "border-brand-coral bg-brand-coral text-white"
                  : "border-brand-sand text-brand-ink/75 hover:border-brand-coral/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 space-y-2">
        {(
          [
            [a11y.highContrast, toggleHighContrast, t("a11y.highContrast")],
            [a11y.reduceMotion, toggleReduceMotion, t("a11y.reduceMotion")],
            [a11y.underlineLinks, toggleUnderlineLinks, t("a11y.underlineLinks")],
          ] as const
        ).map(([pressed, onToggle, label]) => (
          <label key={label} className="flex cursor-pointer items-center justify-between gap-3 text-sm">
            <span>{label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={pressed}
              onClick={onToggle}
              className={`relative h-6 w-11 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral ${
                pressed ? "bg-brand-coral" : "bg-brand-sand"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  pressed ? "left-[1.35rem]" : "left-0.5"
                }`}
              />
            </button>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={resetAccessibility}
        className="mt-4 w-full rounded-lg border border-brand-sand px-3 py-2 text-xs font-semibold text-brand-ink/70 hover:border-brand-coral/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
      >
        {t("a11y.reset")}
      </button>
    </div>
  );
}
