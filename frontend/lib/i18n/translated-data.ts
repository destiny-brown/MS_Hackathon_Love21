"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { CommunityQuote } from "@/lib/community-quotes";
import { communityQuotes } from "@/lib/community-quotes";
import type { LocationDay } from "@/lib/day-locations-data";
import { LOCATION_DAYS } from "@/lib/day-locations-data";
import type { ImpactPillar, ImpactStory } from "@/lib/impact-data";
import { financialBreakdown, growthData, impactPillars, impactStories } from "@/lib/impact-data";
import type { QuizQuestion } from "@/lib/learn-quiz-data";
import { mythVsFactQuestions } from "@/lib/learn-quiz-data";
import type { MemberStory } from "@/lib/member-stories";
import { getMemberStory, memberStories, memberStoryCategoryLabels } from "@/lib/member-stories";
import { useMemberStories } from "@/lib/use-member-stories";
import type { BoardMember } from "@/lib/site-data";
import { boardMembers, programmes } from "@/lib/site-data";
import type { RosterItem } from "@/lib/volunteer-roster";
import {
  availabilityOptions,
  categoryMeta,
  commitmentOptions,
  groupSizeOptions,
  interestOptions,
  rosterItems,
} from "@/lib/volunteer-roster";

import { tx, txArray } from "./translate";

export function useTranslatedQuizQuestions(): QuizQuestion[] {
  const { t } = useTranslation("learn");
  return useMemo(
    () =>
      mythVsFactQuestions.map((q) => ({
        ...q,
        statement: tx(t, `quiz.questions.${q.id}.statement`, q.statement),
        explanation: tx(t, `quiz.questions.${q.id}.explanation`, q.explanation),
        topic: tx(t, `quiz.questions.${q.id}.topic`, q.topic),
      })),
    [t],
  );
}

export function useTranslatedCommunityQuotes(): CommunityQuote[] {
  const { t } = useTranslation("learn");
  return useMemo(
    () =>
      communityQuotes.map((q) => ({
        ...q,
        quote: tx(t, `quotes.${q.id}.quote`, q.quote),
        programmeLabel: tx(t, `quotes.${q.id}.programmeLabel`, q.programmeLabel),
      })),
    [t],
  );
}

export function useTranslatedTrailDays(): LocationDay[] {
  const { t } = useTranslation("learn");
  return useMemo(
    () =>
      LOCATION_DAYS.map((day) => ({
        ...day,
        title: tx(t, `trail.locations.${day.id}.title`, day.title),
        subtitle: tx(t, `trail.locations.${day.id}.subtitle`, day.subtitle),
        events: day.events.map((event) => ({
          ...event,
          label: tx(t, `trail.events.${event.id}.label`, event.label),
          question: {
            ...event.question,
            kicker: tx(t, `trail.questions.${event.question.id}.kicker`, event.question.kicker),
            prompt: tx(t, `trail.questions.${event.question.id}.prompt`, event.question.prompt),
            explanation: tx(t, `trail.questions.${event.question.id}.explanation`, event.question.explanation),
            hint: tx(t, `trail.questions.${event.question.id}.hint`, event.question.hint),
            options: event.question.options.map((opt) => ({
              ...opt,
              label: tx(
                t,
                `trail.questions.${event.question.id}.options.${opt.id}`,
                opt.label,
              ),
            })),
          },
        })),
      })),
    [t],
  );
}

export function useTranslatedImpactPillars(): ImpactPillar[] {
  const { t } = useTranslation("impact");
  return useMemo(
    () =>
      impactPillars.map((p) => ({
        ...p,
        title: tx(t, `pillars.${p.id}.title`, p.title),
        stage: tx(t, `pillars.${p.id}.stage`, p.stage),
        sessions: tx(t, `pillars.${p.id}.sessions`, p.sessions),
        quote: tx(t, `pillars.${p.id}.quote`, p.quote),
        details: txArray(t, `pillars.${p.id}.details`, p.details),
        ctaLabel: tx(t, `pillars.${p.id}.ctaLabel`, p.ctaLabel),
      })),
    [t],
  );
}

export function useTranslatedImpactStories(): ImpactStory[] {
  const { t } = useTranslation("impact");
  return useMemo(
    () =>
      impactStories.map((s, i) => ({
        ...s,
        role: tx(t, `stories.${i}.role`, s.role),
        quote: tx(t, `stories.${i}.quote`, s.quote),
        highlight: tx(t, `stories.${i}.highlight`, s.highlight),
        alt: tx(t, `stories.${i}.alt`, s.alt),
      })),
    [t],
  );
}

export function useTranslatedGrowthData() {
  const { t } = useTranslation("impact");
  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(growthData).map(([key, val]) => [
          key,
          {
            ...val,
            title: tx(t, `growth.${key}.title`, val.title),
            unit: tx(t, `growth.${key}.unit`, val.unit),
          },
        ]),
      ) as typeof growthData,
    [t],
  );
}

export function useTranslatedFinancialBreakdown() {
  const { t } = useTranslation("impact");
  return useMemo(
    () =>
      financialBreakdown.map((item, i) => ({
        ...item,
        name: tx(t, `financial.${i}.name`, item.name),
        amount: tx(t, `financial.${i}.amount`, item.amount),
      })),
    [t],
  );
}

export function useTranslatedRosterItem(item: RosterItem): RosterItem {
  const { t } = useTranslation("volunteer");
  return {
    ...item,
    title: tx(t, `roles.${item.id}.title`, item.title),
    desc: tx(t, `roles.${item.id}.desc`, item.desc),
    when: tx(t, `roles.${item.id}.when`, item.when),
    where: tx(t, `roles.${item.id}.where`, item.where),
    note: item.note ? tx(t, `roles.${item.id}.note`, item.note) : item.note,
    ctaLabel: tx(t, `roles.${item.id}.ctaLabel`, item.ctaLabel),
  };
}

export function useTranslatedRosterItems(items: RosterItem[]): RosterItem[] {
  const { t } = useTranslation("volunteer");
  return useMemo(
    () =>
      items.map((item) => ({
        ...item,
        title: tx(t, `roles.${item.id}.title`, item.title),
        desc: tx(t, `roles.${item.id}.desc`, item.desc),
        when: tx(t, `roles.${item.id}.when`, item.when),
        where: tx(t, `roles.${item.id}.where`, item.where),
        note: item.note ? tx(t, `roles.${item.id}.note`, item.note) : item.note,
        ctaLabel: tx(t, `roles.${item.id}.ctaLabel`, item.ctaLabel),
      })),
    [items, t],
  );
}

export function useTranslatedCategoryMeta() {
  const { t } = useTranslation("volunteer");
  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(categoryMeta).map(([key, val]) => [
          key,
          {
            label: tx(t, `categories.${key}.label`, val.label),
            blurb: tx(t, `categories.${key}.blurb`, val.blurb),
          },
        ]),
      ) as typeof categoryMeta,
    [t],
  );
}

export function useTranslatedMatcherOptions() {
  const { t } = useTranslation("volunteer");
  return useMemo(
    () => ({
      interests: interestOptions.map((o) => ({
        ...o,
        label: tx(t, `matcher.interests.${o.key}.label`, o.label),
        blurb: tx(t, `matcher.interests.${o.key}.blurb`, o.blurb),
      })),
      availability: availabilityOptions.map((o) => ({
        ...o,
        label: tx(t, `matcher.availability.${o.key}.label`, o.label),
      })),
      commitment: commitmentOptions.map((o) => ({
        ...o,
        label: tx(t, `matcher.commitment.${o.key}.label`, o.label),
        blurb: tx(t, `matcher.commitment.${o.key}.blurb`, o.blurb),
      })),
      groupSize: groupSizeOptions.map((o) => ({
        ...o,
        label: tx(t, `matcher.groupSize.${o.key}.label`, o.label),
        blurb: tx(t, `matcher.groupSize.${o.key}.blurb`, o.blurb),
      })),
    }),
    [t],
  );
}

export function useTranslatedProgrammes() {
  const { t } = useTranslation("governance");
  return useMemo(
    () =>
      programmes.map((p, i) => ({
        ...p,
        title: tx(t, `programmes.p${i}.title`, p.title),
        description: tx(t, `programmes.p${i}.description`, p.description),
      })),
    [t],
  );
}

export function useTranslatedBoardMembers(): BoardMember[] {
  const { t } = useTranslation("governance");
  return useMemo(
    () =>
      boardMembers.map((m) => ({
        ...m,
        bio: tx(t, `board.${m.slug}.bio`, m.bio),
      })),
    [t],
  );
}

export function useTranslatedBoardMember(slug: string, fallback: BoardMember): BoardMember {
  const { t } = useTranslation("governance");
  return {
    ...fallback,
    bio: tx(t, `board.${slug}.bio`, fallback.bio),
  };
}

export function useTranslatedMemberStories(): MemberStory[] {
  const { t } = useTranslation("media");
  const stories = useMemberStories();
  return useMemo(
    () =>
      stories.map((story) => ({
        ...story,
        name: tx(t, `memberStories.stories.${story.slug}.name`, story.name),
        quote: tx(t, `memberStories.stories.${story.slug}.quote`, story.quote),
        title: story.title
          ? tx(t, `memberStories.stories.${story.slug}.title`, story.title)
          : story.title,
        body: story.body
          ? tx(t, `memberStories.stories.${story.slug}.body`, story.body)
          : story.body,
        categories: story.categories.map((key) =>
          tx(t, `memberStories.categories.${key}`, memberStoryCategoryLabels[key] ?? key),
        ),
      })),
    [stories, t],
  );
}

export function useTranslatedMemberStory(slug: string, fallback: MemberStory): MemberStory {
  const { t } = useTranslation("media");
  const stories = useMemberStories();
  const source = stories.find((story) => story.slug === slug) ?? getMemberStory(slug) ?? fallback;
  return {
    ...source,
    name: tx(t, `memberStories.stories.${slug}.name`, source.name),
    quote: tx(t, `memberStories.stories.${slug}.quote`, source.quote),
    title: source.title
      ? tx(t, `memberStories.stories.${slug}.title`, source.title)
      : source.title,
    body: source.body ? tx(t, `memberStories.stories.${slug}.body`, source.body) : source.body,
    categories: source.categories.map((key) =>
      tx(t, `memberStories.categories.${key}`, memberStoryCategoryLabels[key] ?? key),
    ),
  };
}

export function useLearnUi() {
  const { t } = useTranslation("learn");
  return (key: string, fallback: string) => tx(t, `ui.${key}`, fallback);
}

export function useImpactUi() {
  const { t } = useTranslation("impact");
  return (key: string, fallback: string) => tx(t, `ui.${key}`, fallback);
}

/** Static roster fallback with translations applied */
export function useDefaultRosterItems(): RosterItem[] {
  return useTranslatedRosterItems(rosterItems);
}
