"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Email address is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.subscribeNewsletter({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
      });
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe right now.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800">
          Successfully Subscribed!
        </h3>
        <p className="mt-2 text-sm text-green-600">
          Thank you for subscribing to the Love 21 Foundation newsletter.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Subscribe Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className={cn(dark && "text-brand-light")}
          >
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="John"
            className={cn(
              dark &&
                "border-brand-light/30 bg-transparent text-brand-light placeholder:text-brand-light/45",
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className={cn(dark && "text-brand-light")}>
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Doe"
            className={cn(
              dark &&
                "border-brand-light/30 bg-transparent text-brand-light placeholder:text-brand-light/45",
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className={cn(dark && "text-brand-light")}>
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@example.com"
          required
          className={cn(
            dark &&
              "border-brand-light/30 bg-transparent text-brand-light placeholder:text-brand-light/45",
          )}
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="phoneNumber"
          className={cn(dark && "text-brand-light")}
        >
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          placeholder="+852 9123 4567"
          className={cn(
            dark &&
              "border-brand-light/30 bg-transparent text-brand-light placeholder:text-brand-light/45",
          )}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Subscribing…" : "Subscribe"}
      </Button>
      <p
        className={cn(
          "text-center text-xs",
          dark ? "text-brand-light/60" : "text-muted-foreground",
        )}
      >
        We&apos;ll never share your information. Unsubscribe anytime.
      </p>
    </form>
  );
}
