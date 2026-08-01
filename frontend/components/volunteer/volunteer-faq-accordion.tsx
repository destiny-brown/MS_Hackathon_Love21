"use client";

import { useState } from "react";

import { faqs } from "@/components/volunteer/volunteer-data";

export function VolunteerFaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-light">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="py-5">
            <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 text-left" aria-expanded={isOpen}>
              <span className="font-serif-display text-lg text-brand-dark sm:text-xl">{item.q}</span>
              <span className={`shrink-0 text-2xl text-brand-red transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`} aria-hidden="true">+</span>
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <p className="overflow-hidden text-brand-dark/70">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
