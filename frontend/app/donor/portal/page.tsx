"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DonorPortalPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/supporter/dashboard");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <p className="rounded-md border p-4 text-sm text-muted-foreground" role="status">
        Donor and volunteer accounts are now supporter accounts. Opening your supporter dashboard…
      </p>
    </main>
  );
}
