"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingPathForRole, useCurrentUser } from "@/lib/auth";

export function SiteAccountNav() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  if (!user) {
    return (
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <Button asChild size="sm" variant="ghost">
      <Link href={landingPathForRole(user.role)} aria-label={`Account dashboard for ${user.email}`}>
        My account
      </Link>
    </Button>
  );
}
