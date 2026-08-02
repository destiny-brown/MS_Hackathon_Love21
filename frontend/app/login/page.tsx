"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, resolvePostLoginPath, Role, setSessionTokens } from "@/lib/api";
import { cn } from "@/lib/utils";

type LoginRole = Role;

const demoEmails: Record<LoginRole, string> = {
  supporter: "supporter@love21.demo",
  member: "member@love21.demo",
  admin: "admin@love21.demo",
};

const publicAccountTypes: LoginRole[] = ["supporter", "member"];

function getLoginRole(value: string | null): LoginRole | null {
  return value === "member" || value === "supporter" || value === "admin" ? value : null;
}

function LoginForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = getLoginRole(searchParams.get("role"));
  const nextPath = searchParams.get("next");
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(queryRole);
  const [email, setEmail] = useState(queryRole ? demoEmails[queryRole] : "");
  const [password, setPassword] = useState(queryRole ? "demo1234" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedRole(queryRole);
    setEmail(queryRole ? demoEmails[queryRole] : "");
    setPassword(queryRole ? "demo1234" : "");
    setError("");
  }, [queryRole]);

  function chooseRole(role: LoginRole) {
    setSelectedRole(role);
    setEmail(demoEmails[role]);
    setPassword("demo1234");
    setError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRole) {
      setError(t("login.chooseAccountError"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.login(email, password);
      setSessionTokens(response.access_token, response.refresh_token);
      router.push(resolvePostLoginPath(response.user.role, nextPath));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.failed"));
    } finally {
      setLoading(false);
    }
  }

  const isStaffMode = selectedRole === "admin";
  const selectedLabel = selectedRole ? t(`login.accountTypes.${selectedRole}.label`) : null;
  const selectedDescription = selectedRole ? t(`login.accountTypes.${selectedRole}.description`) : null;

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_28rem]">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">{t("login.eyebrow")}</p>
          <h1 className="mt-3 font-serif-display text-5xl text-brand-ink sm:text-6xl">{t("login.welcomeBack")}</h1>
          <p className="mt-5 text-lg leading-8 text-brand-ink/75">{t("login.intro")}</p>

          {!isStaffMode ? (
            <fieldset className="mt-8" aria-describedby="account-type-help">
              <legend className="text-sm font-semibold text-brand-ink">{t("login.chooseAccountType")}</legend>
              <p id="account-type-help" className="mt-2 text-sm leading-6 text-brand-ink/65">
                {t("login.accountTypeHelp")}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {publicAccountTypes.map((role) => {
                  const checked = selectedRole === role;

                  return (
                    <label
                      key={role}
                      htmlFor={`account-${role}`}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-2xl border bg-white/80 p-5 shadow-sm transition hover:border-brand-coral/60 hover:bg-white focus-within:ring-2 focus-within:ring-brand-coral focus-within:ring-offset-2 focus-within:ring-offset-brand-cream",
                        checked ? "border-brand-coral bg-white ring-1 ring-brand-coral" : "border-brand-sand",
                      )}
                    >
                      <input
                        id={`account-${role}`}
                        type="radio"
                        name="accountType"
                        value={role}
                        checked={checked}
                        onChange={() => chooseRole(role)}
                        className="mt-1 h-4 w-4 accent-brand-coral"
                      />
                      <span>
                        <span className="block text-base font-semibold text-brand-ink">
                          {t(`login.accountTypes.${role}.label`)}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-brand-ink/65">
                          {t(`login.accountTypes.${role}.description`)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : (
            <p className="mt-8 rounded-2xl border border-brand-sand bg-white/70 p-5 text-sm text-brand-ink/70">
              {t("login.staffModeNote")}
            </p>
          )}
        </div>

        <Card className="w-full border-brand-sand bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>
              {selectedLabel ? t("login.roleLogin", { role: selectedLabel }) : t("login.chooseAccountTypeCard")}
            </CardTitle>
            <CardDescription>
              {selectedDescription ?? t("login.selectToOpenForm")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("login.email")}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("login.password")}</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                </div>
                {error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("login.submitting") : t("login.submit")}
                </Button>
              </form>
            ) : (
              <div className="rounded-2xl border border-dashed border-brand-sand bg-brand-cream/60 p-5 text-sm text-brand-ink/65">
                {t("login.chooseToContinue")}
              </div>
            )}
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("login.noAccount")}{" "}
              <Link className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/register">
                {t("login.register")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<main className="px-4 py-16 sm:px-6 lg:px-8" />}>
        <LoginForm />
      </Suspense>
    </SiteLayout>
  );
}
