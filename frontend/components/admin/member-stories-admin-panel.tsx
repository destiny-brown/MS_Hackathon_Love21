"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getMemberStoryCategories,
  memberStories,
  memberStoryCategoryLabels,
  type MemberStory,
} from "@/lib/member-stories";
import {
  clearMemberStoriesOverride,
  getEffectiveMemberStories,
  readMemberStoriesOverride,
  slugifyStory,
  writeMemberStoriesOverride,
} from "@/lib/member-stories-storage";

const emptyStory = (): MemberStory => ({
  slug: "",
  name: "",
  quote: "",
  bgImage: "/images/yuklam.png",
  categories: ["family-support"],
  title: "",
  body: "",
});

export function MemberStoriesAdminPanel() {
  const [stories, setStories] = useState<MemberStory[]>(memberStories);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(memberStories[0]?.slug ?? null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usingOverride, setUsingOverride] = useState(false);

  const categoryOptions = getMemberStoryCategories();
  const selectedStory = stories.find((story) => story.slug === selectedSlug) ?? null;
  const isNew = selectedSlug === "__new__";

  useEffect(() => {
    const effective = getEffectiveMemberStories();
    setStories(effective);
    setUsingOverride(Boolean(readMemberStoriesOverride()));
    setSelectedSlug((current) => current ?? effective[0]?.slug ?? null);
  }, []);

  function selectStory(slug: string) {
    setSelectedSlug(slug);
    setError("");
    setMessage("");
  }

  function updateSelected(patch: Partial<MemberStory>) {
    if (!selectedSlug || selectedSlug === "__new__") {
      setStories((current) => {
        const draft = current.find((story) => story.slug === "__new__") ?? emptyStory();
        const next = { ...draft, ...patch };
        const withoutDraft = current.filter((story) => story.slug !== "__new__");
        return [...withoutDraft, next];
      });
      return;
    }

    setStories((current) =>
      current.map((story) => (story.slug === selectedSlug ? { ...story, ...patch } : story)),
    );
  }

  function toggleCategory(category: string) {
    if (!selectedStory) return;
    const categories = selectedStory.categories.includes(category)
      ? selectedStory.categories.filter((value) => value !== category)
      : [...selectedStory.categories, category];
    updateSelected({ categories });
  }

  function addStory() {
    const draft = { ...emptyStory(), slug: "__new__" };
    setStories((current) => [...current.filter((story) => story.slug !== "__new__"), draft]);
    setSelectedSlug("__new__");
    setMessage("");
    setError("");
  }

  function deleteStory(slug: string) {
    if (!window.confirm("Remove this story from the site list?")) return;
    const next = stories.filter((story) => story.slug !== slug && story.slug !== "__new__");
    setStories(next);
    setSelectedSlug(next[0]?.slug ?? null);
    setMessage("Story removed from the draft list. Save changes to apply.");
  }

  function validateStories(list: MemberStory[]): string | null {
    const slugs = new Set<string>();
    for (const story of list) {
      if (!story.slug.trim()) return "Every story needs a slug.";
      if (!story.name.trim()) return "Every story needs a member name.";
      if (!story.quote.trim()) return "Every story needs a carousel quote.";
      if (!story.bgImage.trim()) return "Every story needs a background image path.";
      if (story.categories.length === 0) return "Pick at least one category per story.";
      if (slugs.has(story.slug)) return `Duplicate slug: ${story.slug}`;
      slugs.add(story.slug);
    }
    return null;
  }

  function saveChanges() {
    setError("");
    const cleaned = stories
      .filter((story) => story.slug !== "__new__" || story.name.trim())
      .map((story) => ({
        ...story,
        slug: slugifyStory(story.slug === "__new__" ? story.name : story.slug),
        name: story.name.trim(),
        quote: story.quote.trim(),
        bgImage: story.bgImage.trim(),
        title: story.title?.trim() || undefined,
        body: story.body?.trim() || undefined,
      }));

    const validationError = validateStories(cleaned);
    if (validationError) {
      setError(validationError);
      return;
    }

    writeMemberStoriesOverride(cleaned);
    setStories(cleaned);
    setUsingOverride(true);
    setSelectedSlug(cleaned[0]?.slug ?? null);
    setMessage("Stories saved. Visitors on this browser will see the updated carousel and story pages.");
  }

  function resetToSeed() {
    if (!window.confirm("Restore the original seeded Love 21 member stories? This clears your local edits.")) return;
    clearMemberStoriesOverride();
    setStories(memberStories);
    setUsingOverride(false);
    setSelectedSlug(memberStories[0]?.slug ?? null);
    setMessage("Restored seeded stories.");
    setError("");
  }

  const editorStory = isNew ? stories.find((story) => story.slug === "__new__") ?? emptyStory() : selectedStory;

  return (
    <div className="space-y-6">
      <Card className="border-brand-sea/30 bg-gradient-to-br from-brand-sea/5 via-white to-brand-cream/40">
        <CardHeader>
          <CardTitle>How this works</CardTitle>
          <CardDescription>
            Stories start from the seeded Love 21 content in the repo. Staff edits are saved in this browser&apos;s
            local storage — no backend required. Preview on{" "}
            <Link href="/stories-media#member-stories" className="font-semibold text-brand-coral hover:underline">
              Stories &amp; Media
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant={usingOverride ? "success" : "secondary"}>
            {usingOverride ? "Custom list active" : "Using seeded defaults"}
          </Badge>
          <Button type="button" size="sm" variant="outline" onClick={resetToSeed}>
            <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Reset to seed
          </Button>
          <Button type="button" size="sm" asChild variant="outline">
            <Link href="/stories-media#member-stories" target="_blank">
              <ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Preview carousel
            </Link>
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-brand-sea/30 bg-brand-sea/10 p-3 text-sm text-brand-ink" role="status">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-ink/55">Story list</h2>
            <Button type="button" size="sm" variant="outline" onClick={addStory}>
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {stories
              .filter((story) => story.slug !== "__new__")
              .map((story) => (
                <button
                  key={story.slug}
                  type="button"
                  onClick={() => selectStory(story.slug)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    selectedSlug === story.slug
                      ? "border-brand-coral/40 bg-brand-coral/5 shadow-sm"
                      : "border-brand-sand bg-white hover:border-brand-coral/20"
                  }`}
                >
                  <p className="font-semibold text-brand-ink">{story.name || "Untitled story"}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-brand-ink/60">{story.quote || "No quote yet"}</p>
                </button>
              ))}
            {isNew ? (
              <div className="rounded-xl border border-dashed border-brand-coral/40 bg-brand-coral/5 px-3 py-3 text-sm font-semibold text-brand-coral">
                New story draft
              </div>
            ) : null}
          </div>
        </aside>

        {editorStory ? (
          <Card className="border-brand-sand">
            <CardHeader>
              <CardTitle>{isNew ? "New member story" : `Edit ${editorStory.name}`}</CardTitle>
              <CardDescription>
                These fields power the carousel on Stories &amp; Media and the full story page at{" "}
                <code className="rounded bg-brand-cream px-1.5 py-0.5 text-xs">/stories/[slug]</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Member name"
                  value={editorStory.name}
                  onChange={(name) => updateSelected({ name, title: editorStory.title || `${name}'s Story` })}
                />
                <Field
                  label="Slug"
                  value={editorStory.slug === "__new__" ? "" : editorStory.slug}
                  onChange={(slug) => updateSelected({ slug: slug ? slugifyStory(slug) : "__new__" })}
                  placeholder="yuk-lam"
                />
              </div>

              <div>
                <Label htmlFor="story-title">Page title</Label>
                <Input
                  id="story-title"
                  value={editorStory.title ?? ""}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  className="mt-1.5"
                  placeholder="Yuk Lam's Story"
                />
              </div>

              <div>
                <Label htmlFor="story-quote">Carousel quote</Label>
                <Textarea
                  id="story-quote"
                  value={editorStory.quote}
                  onChange={(e) => updateSelected({ quote: e.target.value })}
                  rows={3}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="story-image">Background image path</Label>
                <Input
                  id="story-image"
                  value={editorStory.bgImage}
                  onChange={(e) => updateSelected({ bgImage: e.target.value })}
                  className="mt-1.5"
                  placeholder="/images/yuklam.png"
                />
              </div>

              <div>
                <Label>Categories</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categoryOptions.map((category) => {
                    const active = editorStory.categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          active
                            ? "border-brand-coral bg-brand-coral/10 text-brand-coral"
                            : "border-brand-sand bg-white text-brand-ink/65 hover:border-brand-coral/30"
                        }`}
                      >
                        {memberStoryCategoryLabels[category] ?? category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="story-body">Full story body</Label>
                <Textarea
                  id="story-body"
                  value={editorStory.body ?? ""}
                  onChange={(e) => updateSelected({ body: e.target.value })}
                  rows={10}
                  className="mt-1.5"
                  placeholder="Separate paragraphs with a blank line."
                />
                <p className="mt-1.5 text-xs text-brand-ink/55">Leave blank to show the “coming soon” state on the story page.</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" onClick={saveChanges}>
                  <Save className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Save changes
                </Button>
                {!isNew && selectedSlug ? (
                  <Button type="button" variant="ghost" className="text-destructive" onClick={() => deleteStory(selectedSlug)}>
                    <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Delete
                  </Button>
                ) : null}
                {!isNew && selectedSlug ? (
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/stories/${selectedSlug}`} target="_blank">
                      <ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      Preview story
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-brand-sand">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Select a story from the list or add a new one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5" />
    </div>
  );
}
