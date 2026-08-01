"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, landingPathForRole, Role, setToken } from "@/lib/api";

const registerableRoles: Array<{ value: Exclude<Role, "admin">; label: string; description: string }> = [
  { value: "supporter", label: "Supporter", description: "Track your giving, volunteering, activities, and impact in one place." },
  { value: "member", label: "Member", description: "Manage your Love 21 member profile." },
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<Role, "admin">>("supporter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.register(email, password, role);
      setToken(response.access_token);
      const currentUser = await api.me();
      router.push(landingPathForRole(currentUser.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Accounts are optional and only for managing ongoing Love 21 involvement. Public browsing, one-off donations,
            and initial volunteer sign-up stay open without login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
            </div>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Account type</legend>
              {registerableRoles.map((option) => (
                <label
                  key={option.value}
                  htmlFor={`role-${option.value}`}
                  className="flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                >
                  <input
                    id={`role-${option.value}`}
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="block text-sm text-muted-foreground">{option.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Register"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/login">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
