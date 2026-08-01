"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function MemberProfilePage() {
  const { user, loading } = useCurrentUser();
  const [profileStatus, setProfileStatus] = useState("");

  useEffect(() => {
    if (user?.role !== "member") return;
    api.memberProfile()
      .then((profile) => setProfileStatus(profile.profile_status))
      .catch((err) => setProfileStatus(err instanceof Error ? err.message : "Could not load member profile"));
  }, [user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">Loading member profile…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Member profile</h1>
          <p className="text-sm text-muted-foreground">Signed in as {user.email}. This is your programme member account — separate from the public members enquiry page.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Manage your Love 21 profile</CardTitle>
            <CardDescription>
              This protected page is for stateful member profile management. Programme browsing and joining information remain public.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Backend profile endpoint: {profileStatus || "Loading..."}</p>
            <form className="grid gap-4" aria-label="Demo member profile form">
              <label className="grid gap-2 text-sm font-medium" htmlFor="display-name">
                Display name
                <input id="display-name" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm font-medium" htmlFor="programme-interest">
                Programme interest
                <textarea id="programme-interest" className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Tell Love 21 what you would like to update." />
              </label>
              <Button type="button">Save profile draft</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
