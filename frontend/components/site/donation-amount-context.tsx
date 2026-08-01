"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_DONATION_AMOUNT, type DonationTier } from "@/lib/donation-tiers";

type DonationAmountContextValue = {
  /**
   * Raw text currently shown in the amount input. This is the ONE piece of
   * state everything reads and writes — a tier click and a manual keystroke
   * both just set this, so the visible field is always in sync with
   * whatever was selected/typed last. There is no second, separate
   * "selected tier" value to fall out of sync with it.
   */
  amountText: string;
  /** Parsed numeric amount (0 when the field is empty or not a valid number). */
  amount: number;
  /** Click a tier: writes its amount straight into the shared field as text. */
  selectTier: (tierAmount: number) => void;
  /** Manual edits to the field — always allowed, always take effect immediately. */
  setAmountText: (value: string) => void;
  /** Whether a tier should render as "selected" right now: exact match for
   *  fixed tiers, "at least this much" for an open-ended tier like $1,000+. */
  isTierSelected: (tier: DonationTier) => boolean;
};

const DonationAmountContext = createContext<DonationAmountContextValue | null>(null);

/**
 * Wraps any part of the donate page that needs to read or write the
 * donation amount (tier cards, the mock donation form, etc.) so there is
 * exactly one source of truth instead of each component keeping its own
 * separate `useState`.
 */
export function DonationAmountProvider({
  children,
  defaultAmount = DEFAULT_DONATION_AMOUNT,
}: {
  children: ReactNode;
  defaultAmount?: number;
}) {
  const [amountText, setAmountTextState] = useState(String(defaultAmount));

  const selectTier = useCallback((tierAmount: number) => {
    setAmountTextState(String(tierAmount));
  }, []);

  const setAmountText = useCallback((value: string) => {
    setAmountTextState(value);
  }, []);

  const amount = Number(amountText) || 0;

  const isTierSelected = useCallback(
    (tier: DonationTier) => (tier.openEnded ? amount >= tier.amount : amount === tier.amount),
    [amount],
  );

  const value = useMemo<DonationAmountContextValue>(
    () => ({ amountText, amount, selectTier, setAmountText, isTierSelected }),
    [amountText, amount, selectTier, setAmountText, isTierSelected],
  );

  return <DonationAmountContext.Provider value={value}>{children}</DonationAmountContext.Provider>;
}

export function useDonationAmount() {
  const ctx = useContext(DonationAmountContext);
  if (!ctx) {
    throw new Error("useDonationAmount must be used within a <DonationAmountProvider>");
  }
  return ctx;
}
