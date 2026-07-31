"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown, Download, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useImpactUi, useTranslatedFinancialBreakdown } from "@/lib/i18n/translated-data";
import { auditedReports } from "@/lib/impact-data";

const viewport = { once: false, amount: 0.2 } as const;

function DonutChart({ toProgrammesLabel }: { toProgrammesLabel: string }) {
  const financialBreakdown = useTranslatedFinancialBreakdown();
  let cursor = 0;
  const segments = financialBreakdown.map((item) => {
    const start = cursor;
    cursor += item.value;
    return { ...item, start, end: cursor };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.end}%`)
    .join(", ");

  return (
    <div className="relative mx-auto h-52 w-52">
      <div
        className="h-full w-full rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
        role="img"
        aria-label="Expenditure breakdown donut chart"
      />
      <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white text-center">
        <p className="font-serif-display text-3xl text-[#2A7A7B]">86%</p>
        <p className="px-2 text-[10px] uppercase tracking-[0.12em] text-brand-ink/60">
          {toProgrammesLabel}
        </p>
      </div>
    </div>
  );
}

export function FinancialRoots() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewport);
  const [reportsOpen, setReportsOpen] = useState(false);
  const financialBreakdown = useTranslatedFinancialBreakdown();
  const ui = useImpactUi();
  const { t } = useTranslation("impact");

  return (
    <section
      ref={ref}
      className="border-b border-brand-sand bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-sea">
            <Sprout className="h-4 w-4" />
            {ui("deepFinancialRoots", "Deep Financial Roots")}
          </p>
          <h2 className="mt-3 font-serif-display text-3xl text-brand-ink sm:text-4xl">
            {ui("financialTransparency", "Financial Transparency & Beneficiary Impact")}
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="overflow-hidden rounded-2xl border border-brand-sand shadow-sm">
              <div
                className="px-6 py-7 text-white sm:px-8"
                style={{
                  background:
                    "linear-gradient(135deg, #2A7A7B 0%, #1A2B3D 100%)",
                }}
              >
                <h3 className="font-serif-display text-2xl leading-snug sm:text-3xl">
                  {ui(
                    "programmesShare",
                    "86% of Every Dollar Goes Directly to Programs & Beneficiary Care",
                  )}
                </h3>
                <p className="mt-4 text-sm text-white/85">
                  {ui(
                    "programmesShareDetail",
                    "HKD $9.94M of $11.49M total expenditure — roots sunk deep into programmes that unlock potential.",
                  )}
                </p>
              </div>

              <div className="bg-brand-cream/40 px-4 py-6 sm:px-6 sm:py-8">
                <DonutChart
                  toProgrammesLabel={ui("toProgrammes", "To programmes")}
                />
                <ul className="mt-6 space-y-2">
                  {financialBreakdown.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-2 text-brand-ink/80">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold text-brand-ink">
                        {item.value}% · {item.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="space-y-6"
          >
            <blockquote className="rounded-2xl border border-brand-sand bg-brand-cream p-6 font-serif-display text-xl leading-snug text-brand-ink">
              &ldquo;{t("quotes.financialRoots")}&rdquo;
            </blockquote>

            <div className="space-y-3 text-brand-ink/75">
              <p>
                {ui(
                  "donorGiftsP1",
                  "Donor gifts are the deep roots of Love 21's forest — channelled into nutrition, fitness, sports, family support, and community education so every member can flourish free of charge.",
                )}
              </p>
              <p>
                {ui(
                  "donorGiftsP2",
                  "Governance stays lean so the canopy of programmes stays wide. Transparency is how we honour each vote of confidence.",
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-sand bg-white px-4">
              <button
                type="button"
                aria-expanded={reportsOpen}
                onClick={() => setReportsOpen((open) => !open)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-brand-ink transition hover:text-brand-coral"
              >
                {ui("viewAuditedReports", "View Audited Financial Reports")}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-brand-ink/50 transition-transform ${
                    reportsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {reportsOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 pb-4 sm:flex-row">
                      {auditedReports.map((report, i) => (
                        <Button
                          key={report.label}
                          asChild
                          variant="outline"
                          className="justify-start border-brand-sand"
                        >
                          <Link href={report.href}>
                            <Download className="mr-2 h-4 w-4" />
                            {t(`reports.${i}.label`, { defaultValue: report.label })}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
