import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-10 py-10 sm:py-16">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="text-xl font-bold tracking-tight">hackkit</Link>
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link href="/login">Log in</Link></Button>
            <Button asChild><Link href="/register">Register</Link></Button>
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              FastAPI + Next.js hackathon starter
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Ship your first feature in under an hour.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Auth, database, demo CRUD, optional Claude AI route, Docker, and deployment notes are wired. Copy the Item resource and start building.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="default"><Link href="/register">Start building <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link href="/login">Use demo login</Link></Button>
            </div>
          </div>

          <Card>
            <CardContent className="space-y-4 p-6">
              {[
                "JWT auth with roles",
                "SQLite by default, Postgres by env var",
                "Owned Item CRUD resource",
                "Minimal i18n + accessible forms",
                "Vercel + Render deployment notes",
              ].map((item) => (
                <div className="flex gap-3" key={item}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
