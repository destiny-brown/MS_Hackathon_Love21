"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { signOutToLogin, useRequireRoles } from "@/lib/auth";

export default function MemberProfilePage() {
  const { user, loading, error } = useRequireRoles("member");
  const [profileStatus, setProfileStatus] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [gratitudeStatus, setGratitudeStatus] = useState("");
  const [gratitudeError, setGratitudeError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== "member") return;
    api.memberProfile()
      .then((profile) => setProfileStatus(profile.profile_status))
      .catch((err) => setProfileStatus(err instanceof Error ? err.message : "Could not load member profile"));
  }, [user]);

  async function submitGratitudeEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setGratitudeError("");
    setGratitudeStatus("");

    try {
      const entry = await api.submitGratitudeEntry({
        display_name: displayName || null,
        message,
        photo_url: photoUrl || null,
      });
      setDisplayName("");
      setMessage("");
      setPhotoUrl("");
      setGratitudeStatus(
        `Thank you — your Wall of Gratitude entry is ${entry.status} and will appear publicly after admin approval.`,
      );
    } catch (err) {
      setGratitudeError(err instanceof Error ? err.message : "Could not submit your gratitude entry");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user || user.role !== "member") {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4 py-10">
        <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">Loading member profile…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">Member area</p>
            <h1 className="mt-2 font-serif-display text-4xl text-brand-ink sm:text-5xl">Member profile</h1>
            <p className="mt-2 text-sm text-brand-ink/70">Signed in as {user.email} · {user.role}</p>
          </div>
          <Button variant="outline" onClick={signOutToLogin}>Log out</Button>
        </header>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input id="display-name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programme-interest">Programme interest</Label>
                  <Textarea id="programme-interest" placeholder="Tell Love 21 what you would like to update." />
                </div>
                <Button type="button">Save profile draft</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update the Wall of Gratitude</CardTitle>
              <CardDescription>
                Share a short thank-you for the public wall. New entries stay pending until an admin approves them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitGratitudeEntry} className="space-y-4" aria-describedby="gratitude-approval-note">
                <div className="space-y-2">
                  <Label htmlFor="gratitude-name">Name to show (optional)</Label>
                  <Input
                    id="gratitude-name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={120}
                    placeholder="Your name, family name, or leave blank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gratitude-message">Gratitude message</Label>
                  <Textarea
                    id="gratitude-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={800}
                    required
                    placeholder="What would you like to celebrate or thank the community for?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gratitude-photo">Photo URL (optional)</Label>
                  <Input
                    id="gratitude-photo"
                    type="url"
                    value={photoUrl}
                    onChange={(event) => setPhotoUrl(event.target.value)}
                    maxLength={500}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <p id="gratitude-approval-note" className="rounded-2xl bg-brand-cream p-3 text-sm text-brand-ink/75">
                  For privacy and safety, the backend always creates member submissions as pending. Only an admin endpoint can approve them.
                </p>
                <Button type="submit" disabled={submitting || !message.trim()}>
                  {submitting ? "Submitting…" : "Submit for admin approval"}
                </Button>
              </form>

              {gratitudeStatus ? (
                <p className="mt-4 flex gap-2 rounded-2xl border border-brand-sea/30 bg-brand-sea/10 p-4 text-sm text-brand-ink" role="status">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-sea" aria-hidden="true" />
                  <span>{gratitudeStatus}</span>
                </p>
              ) : null}
              {gratitudeError ? (
                <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
                  {gratitudeError}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
