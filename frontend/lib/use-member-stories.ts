"use client";

import { useEffect, useState } from "react";

import { memberStories, type MemberStory } from "@/lib/member-stories";
import {
  getEffectiveMemberStories,
  MEMBER_STORIES_STORAGE_KEY,
  MEMBER_STORIES_UPDATED_EVENT,
} from "@/lib/member-stories-storage";

export function useMemberStories(): MemberStory[] {
  const [stories, setStories] = useState<MemberStory[]>(memberStories);

  useEffect(() => {
    setStories(getEffectiveMemberStories());

    function refresh() {
      setStories(getEffectiveMemberStories());
    }

    window.addEventListener(MEMBER_STORIES_UPDATED_EVENT, refresh);
    window.addEventListener("storage", (event) => {
      if (event.key === MEMBER_STORIES_STORAGE_KEY) refresh();
    });

    return () => {
      window.removeEventListener(MEMBER_STORIES_UPDATED_EVENT, refresh);
    };
  }, []);

  return stories;
}
