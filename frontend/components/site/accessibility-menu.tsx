"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AccessibilityOptionsPanel } from "@/components/site/accessibility-options-panel";

function AccessibilityMenuIcon() {
  return (
    <span className="flex flex-col items-center gap-0.5" aria-hidden="true">
      <span className="block h-0.5 w-4 rounded-full bg-current" />
      <span className="block h-0.5 w-4 rounded-full bg-current" />
      <span className="block h-0.5 w-4 rounded-full bg-current" />
    </span>
  );
}

/** Desktop accessibility dropdown (hidden on mobile; mobile uses the nav drawer). */
export function AccessibilityMenu() {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("common");

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
    <div className={`relative hidden lg:block ${open ? "z-[70]" : ""}`}>
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

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label={t("a11y.options")}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-brand-sand bg-white p-4 text-brand-ink shadow-xl"
        >
          <AccessibilityOptionsPanel onRequestClose={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
