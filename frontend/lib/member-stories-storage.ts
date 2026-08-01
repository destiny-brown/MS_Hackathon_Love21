import { memberStories, type MemberStory } from "@/lib/member-stories";

export const MEMBER_STORIES_STORAGE_KEY = "love21_member_stories_v1";
export const MEMBER_STORIES_UPDATED_EVENT = "love21:member-stories-updated";

type MemberStoriesOverride = {
  stories: MemberStory[];
  updatedAt: string;
};

export function readMemberStoriesOverride(): MemberStory[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MEMBER_STORIES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MemberStoriesOverride;
    return Array.isArray(parsed.stories) ? parsed.stories : null;
  } catch {
    return null;
  }
}

export function writeMemberStoriesOverride(stories: MemberStory[]): void {
  if (typeof window === "undefined") return;
  const payload: MemberStoriesOverride = {
    stories,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(MEMBER_STORIES_STORAGE_KEY, JSON.stringify(payload));
  notifyMemberStoriesUpdated();
}

export function clearMemberStoriesOverride(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MEMBER_STORIES_STORAGE_KEY);
  notifyMemberStoriesUpdated();
}

export function getEffectiveMemberStories(): MemberStory[] {
  return readMemberStoriesOverride() ?? memberStories;
}

export function notifyMemberStoriesUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MEMBER_STORIES_UPDATED_EVENT));
}

export function slugifyStory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
