"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { clearToken, getCurrentUserWithRole, landingPathForRole, resolvePostLoginPath, Role, User, api } from "@/lib/api";

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string;
};

export function useCurrentUser(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCurrentUserWithRole()
      .then((currentUser) => {
        if (!active) return;
        setUser(currentUser);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load your account");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { user, loading, error };
}

export function useRequireRoles(...allowedRoles: Role[]): AuthState {
  const router = useRouter();
  const pathname = usePathname();
  const state = useCurrentUser();
  const allowedRolesKey = allowedRoles.join("|");

  useEffect(() => {
    if (state.loading) return;

    if (!state.user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    const allowed = allowedRolesKey.split("|") as Role[];
    if (!allowed.includes(state.user.role)) {
      router.replace(`/not-authorized?role=${encodeURIComponent(state.user.role)}`);
    }
  }, [allowedRolesKey, pathname, router, state.loading, state.user]);

  return state;
}

export function signOutToLogin() {
  const refreshToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("love21_refresh_token") ?? window.localStorage.getItem("hackkit_refresh_token")
      : null;
  if (refreshToken) {
    void api.logout(refreshToken).catch(() => undefined);
  }
  clearToken();
  window.location.href = "/login";
}

export { landingPathForRole, resolvePostLoginPath };
