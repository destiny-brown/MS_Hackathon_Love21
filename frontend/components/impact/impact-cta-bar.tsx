"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { HandHeart, Heart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-brand-dark/50"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative z-10 grid w-full max-w-lg gap-4 rounded-2xl border border-brand-light bg-white p-6 shadow-lg outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="space-y-1.5 pr-6 text-left">
          <h2 id={titleId} className="font-serif-display text-2xl text-brand-dark">
            {title}
          </h2>
          <p id={descriptionId} className="text-sm text-brand-dark/70">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ImpactCtaBar() {
  const [frequency, setFrequency] = useState<"monthly" | "one-time">("monthly");
  const [donateOpen, setDonateOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [submitted, setSubmitted] = useState<"donate" | "volunteer" | null>(
    null,
  );

  const closeDonate = () => {
    setDonateOpen(false);
    setSubmitted(null);
  };

  const closeVolunteer = () => {
    setVolunteerOpen(false);
    setSubmitted(null);
  };

  return (
    <div className="sticky bottom-0 z-40 border-t border-brand-light bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="hidden text-sm text-brand-dark/70 lg:block lg:max-w-sm">
          Grow the forest. Fuel the metamorphosis. Every gift and every hour
          unlocks ability.
        </p>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[34rem]">
          <Button
            className="h-12 bg-brand-red text-white hover:bg-brand-red/90"
            onClick={() => {
              setSubmitted(null);
              setDonateOpen(true);
            }}
          >
            <Heart className="mr-2 h-4 w-4" />
            Sponsor a Family&apos;s Journey
          </Button>

          <Button
            variant="outline"
            className="h-12 border-brand-slate text-brand-slate hover:bg-brand-slate/10"
            onClick={() => {
              setSubmitted(null);
              setVolunteerOpen(true);
            }}
          >
            <HandHeart className="mr-2 h-4 w-4" />
            Join as a Volunteer Coach / Helper
          </Button>
        </div>
      </div>

      <Modal
        open={donateOpen}
        onClose={closeDonate}
        title="Sponsor a Family's Journey"
        description="You are not giving hand-outs—you are unlocking potential. 100% of your gift ensures world-class fitness, nutrition, and community remain free for every family."
      >
        {submitted === "donate" ? (
          <div className="rounded-xl bg-brand-light p-4 text-sm text-brand-dark/80">
            Thank you. Continue to the donate page to complete your{" "}
            {frequency === "monthly" ? "monthly" : "one-time"} gift.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={frequency === "monthly" ? "default" : "outline"}
                onClick={() => setFrequency("monthly")}
                className={
                  frequency === "monthly"
                    ? "bg-brand-red text-white hover:bg-brand-red/90"
                    : "border-brand-light"
                }
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={frequency === "one-time" ? "default" : "outline"}
                onClick={() => setFrequency("one-time")}
                className={
                  frequency === "one-time"
                    ? "bg-brand-red text-white hover:bg-brand-red/90"
                    : "border-brand-light"
                }
              >
                One-Time
              </Button>
            </div>
            <p className="text-xs text-brand-dark/60">
              Selected:{" "}
              <strong>
                {frequency === "monthly" ? "Monthly" : "One-Time"}
              </strong>{" "}
              sponsorship
            </p>
          </div>
        )}
        <div className="flex justify-end">
          {submitted === "donate" ? (
            <Button
              asChild
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Link href="/donate">Continue to Donate</Link>
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-brand-red text-white hover:bg-brand-red/90"
              onClick={() => setSubmitted("donate")}
            >
              Confirm {frequency === "monthly" ? "Monthly" : "One-Time"} Gift
            </Button>
          )}
        </div>
      </Modal>

      <Modal
        open={volunteerOpen}
        onClose={closeVolunteer}
        title="Volunteer Sign-Up"
        description="Share your time as a coach or helper across nutrition, fitness, sports, family support, and community programmes."
      >
        {submitted === "volunteer" ? (
          <>
            <div className="rounded-xl bg-brand-light p-4 text-sm text-brand-dark/80">
              Thanks for stepping forward. Our team will follow up, or you can
              register interest on the volunteer page now.
            </div>
            <div className="flex justify-end">
              <Button asChild variant="outline" className="border-brand-light">
                <Link href="/our-volunteer">View Volunteer Page</Link>
              </Button>
            </div>
          </>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted("volunteer");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="volunteer-name">Full name</Label>
              <Input
                id="volunteer-name"
                name="name"
                required
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volunteer-email">Email</Label>
              <Input
                id="volunteer-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volunteer-interest">Interest area</Label>
              <Input
                id="volunteer-interest"
                name="interest"
                placeholder="e.g. Sports coaching, nutrition workshops"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-brand-slate text-white hover:bg-brand-slate/90"
              >
                Submit Interest
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
