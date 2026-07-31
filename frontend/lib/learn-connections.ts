import { dailyChallenges } from "@/lib/myth-buster-data";
import { mythVsFactQuestions } from "@/lib/learn-quiz-data";

export type StoryLearnConnections = {
  inMythQuiz: boolean;
  inDailyMyth: boolean;
};

function buildConnectionMap(): Record<string, StoryLearnConnections> {
  const map: Record<string, StoryLearnConnections> = {};

  function touch(slug: string): StoryLearnConnections {
    if (!map[slug]) {
      map[slug] = { inMythQuiz: false, inDailyMyth: false };
    }
    return map[slug];
  }

  for (const question of mythVsFactQuestions) {
    for (const slug of question.relatedStorySlugs ?? []) {
      touch(slug).inMythQuiz = true;
    }
  }

  for (const challenge of dailyChallenges) {
    for (const slug of challenge.relatedStorySlugs ?? []) {
      touch(slug).inDailyMyth = true;
    }
  }

  return map;
}

const connectionMap = buildConnectionMap();

export function getStoryLearnConnections(slug: string): StoryLearnConnections | null {
  const connections = connectionMap[slug];
  if (!connections?.inMythQuiz && !connections?.inDailyMyth) {
    return null;
  }
  return connections;
}
