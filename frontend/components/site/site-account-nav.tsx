"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { landingPathForRole, useCurrentUser } from "@/lib/auth";

export function SiteAccountNav() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) {
    return (
      <>
        <Button asChild size="sm" variant="ghost" className="lg:hidden h-9 w-9 shrink-0 px-0">
          <Link href="/login" aria-label="Login">
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="hidden lg:inline-flex">
          <Link href="/login">Login</Link>
        </Button>
      </>
    );
  }

  const href = landingPathForRole(user.role);
  const accountLabel = `Account dashboard for ${user.email}`;

  return (
    <>
      <Button asChild size="sm" variant="ghost" className="lg:hidden h-9 w-9 shrink-0 px-0">
        <Link href={href} aria-label={accountLabel}>
          <User className="h-5 w-5" aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild size="sm" variant="ghost" className="hidden lg:inline-flex">
        <Link href={href} aria-label={accountLabel}>
          My account
        </Link>
      </Button>
    </>
  );
}
