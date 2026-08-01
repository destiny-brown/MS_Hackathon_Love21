"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown, Download, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  auditedReports,
  financialBreakdown,
  financialRootsQuote,
} from "@/lib/impact-data";

const viewport = { once: false, amount: 0.2 } as const;

function DonutChart() {
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
        <p className="px-2 text-[10px] uppercase tracking-[0.12em] text-brand-dark/60">
          To programmes
        </p>
      </div>
    </div>
  );
}

export function FinancialRoots() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, viewport);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <section
      id="impact-financials"
      ref={ref}
      className="scroll-mt-24 border-b border-brand-light bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-slate">
            <Sprout className="h-4 w-4" />
            Deep Financial Roots
          </p>
          <h2 className="mt-3 font-serif-display text-3xl text-brand-dark sm:text-4xl">
            Financial Transparency & Beneficiary Impact
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="overflow-hidden rounded-2xl border border-brand-light shadow-sm">
              <div
                className="px-6 py-7 text-white sm:px-8"
                style={{
                  background:
                    "linear-gradient(135deg, #2A7A7B 0%, #1A2B3D 100%)",
                }}
              >
                <h3 className="font-serif-display text-2xl leading-snug sm:text-3xl">
                  86% of Every Dollar Goes Directly to Programs &amp; Beneficiary
                  Care
                </h3>
                <p className="mt-4 text-sm text-white/85">
                  HKD $9.94M of $11.49M total expenditure — roots sunk deep into
                  programmes that unlock potential.
                </p>
              </div>

              <div className="bg-brand-light/40 px-4 py-6 sm:px-6 sm:py-8">
                <DonutChart />
                <ul className="mt-6 space-y-2">
                  {financialBreakdown.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-2 text-brand-dark/80">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold text-brand-dark">
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
            <blockquote className="rounded-2xl border border-brand-light bg-brand-light p-6 font-serif-display text-xl leading-snug text-brand-dark">
              &ldquo;{financialRootsQuote}&rdquo;
            </blockquote>

            <div className="space-y-3 text-brand-dark/75">
              <p>
                Donor gifts are the deep roots of Love 21&apos;s forest —
                channelled into nutrition, fitness, sports, family support, and
                community education so every member can flourish free of charge.
              </p>
              <p>
                Governance stays lean so the canopy of programmes stays wide.
                Transparency is how we honour each vote of confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-light bg-white px-4">
              <button
                type="button"
                aria-expanded={reportsOpen}
                onClick={() => setReportsOpen((open) => !open)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-brand-dark transition hover:text-brand-red"
              >
                View Audited Financial Reports
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-brand-dark/50 transition-transform ${
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
                      {auditedReports.map((report) => (
                        <Button
                          key={report.label}
                          asChild
                          variant="outline"
                          className="justify-start border-brand-light"
                        >
                          <Link href={report.href}>
                            <Download className="mr-2 h-4 w-4" />
                            {report.label}
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
