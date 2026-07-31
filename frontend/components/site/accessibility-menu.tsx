"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSitePreferences } from "@/components/site/site-preferences";

function AccessibilityMenuIcon() {
  return (
    <span className="flex flex-col items-center gap-0.5" aria-hidden="true">
      <span className="block h-0.5 w-4 rounded-full bg-current" />
      <span className="block h-0.5 w-4 rounded-full bg-current" />
      <span className="block h-0.5 w-4 rounded-full bg-current" />
    </span>
  );
}

export function AccessibilityMenu() {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("common");

  const {
    a11y,
    setFontScale,
    toggleHighContrast,
    toggleReduceMotion,
    toggleUnderlineLinks,
    resetAccessibility,
  } = useSitePreferences();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={`relative ${open ? "z-[70]" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("a11y.menu")}
        className="relative z-[70] inline-flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-brand-ink/80 transition hover:bg-brand-sand/60 hover:text-brand-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
      >
        <AccessibilityMenuIcon />
        <span className="flex flex-col items-center text-[9px] font-semibold uppercase leading-[1.05] tracking-wide">
          <span>{t("a11y.menuLine1")}</span>
          <span>{t("a11y.menuLine2")}</span>
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label={t("a11y.options")}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-brand-sand bg-white p-4 text-brand-ink shadow-xl"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">{t("a11y.options")}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded px-2 py-1 text-xs text-brand-ink/60 hover:bg-brand-sand/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
            >
              {t("a11y.close")}
            </button>
          </div>

          <fieldset className="mt-4">
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
      )}
    </div>
  );
}
