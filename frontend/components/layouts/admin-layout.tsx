"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { useRequireRoles } from "@/lib/auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useRequireRoles("admin");

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
        <p className="text-sm text-muted-foreground" role="status">
          Verifying staff access…
        </p>
      </div>
    );
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
