"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

export function AccessibilityMenu() {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

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
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative hidden lg:block">
      <button
  ref={buttonRef}
  type="button"
  onClick={() => setOpen((value) => !value)}
  aria-expanded={open}
  aria-controls={panelId}
  aria-label={t("a11y.menu")}
  className="relative inline-flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-brand-ink/80 transition hover:bg-brand-sand/60 hover:text-brand-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral"
>
  <AccessibilityMenuIcon />
  <span className="text-[10px] font-medium leading-none whitespace-nowrap" aria-hidden="true">
    {t("a11y.label", "Accessibility")}
  </span>
</button>

      {open && mounted
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="region"
              aria-label={t("a11y.options")}
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-[2147483647] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-brand-sand bg-white p-4 text-brand-ink shadow-2xl"
            >
              <AccessibilityOptionsPanel onRequestClose={() => setOpen(false)} />
            </div>,
            document.body
          )
        : null}
    </div>
  );
}