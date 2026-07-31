"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";

export default function DonorPortalPage() {
  const { user, loading, error } = useRequireRoles("donor");
  const [donationStatus, setDonationStatus] = useState("");

  useEffect(() => {
    if (user?.role !== "donor") return;
    api.recurringDonation()
      .then((donation) => setDonationStatus(donation.status))
      .catch((err) => setDonationStatus(err instanceof Error ? err.message : "Could not load recurring donation tools"));
  }, [user]);

  if (loading || !user || user.role !== "donor") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">Checking donor access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Donor portal</h1>
            <p className="text-sm text-muted-foreground">Signed in as {user.email} · {user.role}</p>
          </div>
          <Button variant="outline" onClick={signOutToLogin}>Log out</Button>
        </header>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        <Card>
          <CardHeader>
            <CardTitle>Recurring donation tools</CardTitle>
            <CardDescription>
              One-off giving remains public. This signed-in portal is for donors who opt in to manage ongoing support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Backend recurring donation endpoint: {donationStatus || "Loading..."}</p>
            <Button type="button">Manage recurring donation</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
