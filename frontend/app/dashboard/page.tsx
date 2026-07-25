"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, clearToken, getToken, Item, User } from "@/lib/api";
import { Locale, t } from "@/lib/i18n";

export default function DashboardPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [me, list] = await Promise.all([api.me(), api.listItems()]);
    setUser(me);
    setItems(list);
  }

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    load().catch((err) => setError(err instanceof Error ? err.message : "Could not load dashboard"));
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.updateItem(editing.id, { title, description });
      } else {
        await api.createItem({ title, description });
      }
      setTitle("");
      setDescription("");
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save item");
    }
  }

  function startEdit(item: Item) {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description || "");
  }

  async function remove(item: Item) {
    await api.deleteItem(item.id);
    await load();
  }

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t(locale, "dashboard")}</h1>
            {user ? (
              <p className="text-sm text-muted-foreground">
                {t(locale, "signedInAs")} {user.email} · {user.role}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} onChange={setLocale} />
            <Button variant="outline" onClick={logout}>{t(locale, "logout")}</Button>
          </div>
        </header>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{editing ? t(locale, "edit") : t(locale, "createItem")}</CardTitle>
              <CardDescription>Accessible labels, visible focus states, and mobile-first spacing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t(locale, "title")}</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t(locale, "description")}</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit"><Plus className="mr-2 h-4 w-4" />{t(locale, "save")}</Button>
                  {editing ? (
                    <Button type="button" variant="outline" onClick={() => { setEditing(null); setTitle(""); setDescription(""); }}>
                      {t(locale, "cancel")}
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t(locale, "items")}</CardTitle>
              <CardDescription>This CRUD UI maps to the owned backend Item resource.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <article key={item.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-semibold">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description || "No description"}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>{t(locale, "edit")}</Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(item)}>{t(locale, "delete")}</Button>
                      </div>
                    </div>
                  </article>
                ))}
                {items.length === 0 ? <p className="text-sm text-muted-foreground">No items yet. Create one.</p> : null}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
