import type { MediaPost } from "@/lib/media-stories";
import { getStoriesBySlugs, mapTopicToStories } from "@/lib/media-stories";

export type QuizAnswer = "myth" | "fact";

export type QuizQuestion = {
  id: string;
  statement: string;
  answer: QuizAnswer;
  explanation: string;
  topic: string;
  /** Optional real photo to contextualise the claim */
  imageUrl?: string;
  imageCredit?: string;
  /** Hand-picked resources that directly relate to this claim */
  relatedStorySlugs?: string[];
};

export function getQuizRelatedStories(
  question: QuizQuestion,
  limit = 1,
  usedSlugs: ReadonlySet<string> = new Set(),
): MediaPost[] {
  const candidates = question.relatedStorySlugs?.length
    ? getStoriesBySlugs(question.relatedStorySlugs)
    : mapTopicToStories(question.topic, 8);

  const unused = candidates.filter((post) => !usedSlugs.has(post.slug));
  if (unused.length >= limit) return unused.slice(0, limit);

  const fallback = mapTopicToStories(question.topic, 8).filter((post) => !usedSlugs.has(post.slug));
  const merged = [...unused, ...fallback.filter((post) => !unused.some((u) => u.slug === post.slug))];
  return merged.slice(0, limit);
}

export const mythVsFactQuestions: QuizQuestion[] = [
  {
    id: "q1",
    statement: "Autistic people lack empathy.",
    answer: "myth",
    explanation:
      "Many autistic people feel empathy deeply — they may just express or process it differently. Difficulty reading social cues is not the same as not caring.",
    topic: "Autism",
    imageUrl: "https://autisticandunapologetic.com/wp-content/uploads/2019/10/The-Autistic-Policeman.jpg",
    imageCredit: "Autistic & Unapologetic",
    relatedStorySlugs: ["autistic-police-officer-interview"],
  },
  {
    id: "q2",
    statement: "Down syndrome is caused by an extra copy of chromosome 21.",
    answer: "fact",
    explanation:
      "Trisomy 21 means each cell has three copies of chromosome 21 instead of two. This affects development, but abilities vary widely from person to person.",
    topic: "Down Syndrome",
    imageUrl:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.42.30-1024x638.png",
    imageCredit: "South China Morning Post / Love 21 Foundation",
    relatedStorySlugs: ["purposeful-employment"],
  },
  {
    id: "q3",
    statement: "ADHD is just a childhood behaviour problem that people grow out of.",
    answer: "myth",
    explanation:
      "ADHD is a lifelong neurodevelopmental condition. Many adults live with ADHD; symptoms may change over time but do not simply disappear.",
    topic: "ADHD",
    relatedStorySlugs: ["hbr-neurodiversity-competitive-advantage"],
  },
  {
    id: "q4",
    statement: "Using person-first language (e.g. 'person with autism') is always preferred.",
    answer: "myth",
    explanation:
      "Language preferences vary. Some people prefer identity-first language ('autistic person'). The best approach is to ask individuals what they prefer.",
    topic: "Inclusive Language",
    imageUrl: "https://media.abilitymagazine.com/wp-content/uploads/2019/11/18120255/John-Robison-ocean.jpg",
    imageCredit: "Ability Magazine",
    relatedStorySlugs: ["ability-mag-neurodiversity-real-world"],
  },
  {
    id: "q5",
    statement: "Neurodivergent students benefit from predictable routines and clear instructions.",
    answer: "fact",
    explanation:
      "Structure, visual supports, and explicit expectations reduce cognitive load and anxiety, helping many neurodivergent learners participate more confidently.",
    topic: "Education",
    imageUrl:
      "https://images.ctfassets.net/eflsecw4kznd/1E0PYQKWuKMNIzrhRgghiW/180ef8c7b951b6d680d9a9b9c2656c1e/shutterstock_565422706-1565303586.jpg",
    imageCredit: "EdSurge",
    relatedStorySlugs: ["edsurge-peer-mentors"],
  },
  {
    id: "q6",
    statement: "All autistic people have savant abilities like in movies.",
    answer: "myth",
    explanation:
      "Savant skills exist in a small minority of autistic people. Most autistic individuals have diverse strengths and challenges like anyone else.",
    topic: "Autism",
    relatedStorySlugs: ["cbs-autism-talent"],
  },
  {
    id: "q7",
    statement: "Sensory sensitivities (to light, sound, or touch) are common among neurodivergent people.",
    answer: "fact",
    explanation:
      "Many neurodivergent people process sensory input differently. Adjusting environments — quieter spaces, softer lighting — can make a real difference.",
    topic: "Sensory",
    imageUrl: "https://img.youtube.com/vi/ycCN3qTYVyo/hqdefault.jpg",
    imageCredit: "National Autistic Society",
    relatedStorySlugs: ["nyt-autism-office-design"],
  },
  {
    id: "q8",
    statement: "Inclusive education means placing all students in the same classroom with no support.",
    answer: "myth",
    explanation:
      "True inclusion provides appropriate accommodations, differentiated instruction, and support so every learner can participate meaningfully.",
    topic: "Education",
    imageUrl:
      "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_teaser_image/2018-08/_dsc4753.jpg?itok=H7MEnzpW",
    imageCredit: "Psychology Today",
    relatedStorySlugs: ["psychology-today-neurodiverse-college"],
  },
  {
    id: "q9",
    statement: "Stimming (repetitive movements or sounds) can help neurodivergent people self-regulate.",
    answer: "fact",
    explanation:
      "Stimming is often a coping strategy for managing emotions, sensory input, or focus. Suppressing it without understanding can increase stress.",
    topic: "Autism",
    relatedStorySlugs: ["forbes-autism-employment-legal"],
  },
  {
    id: "q10",
    statement: "People with intellectual disabilities cannot live independently or hold jobs.",
    answer: "myth",
    explanation:
      "With the right support, many people with intellectual disabilities work, live independently, and contribute richly to their communities.",
    topic: "Down Syndrome",
    imageUrl:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.51.15-1024x583.png",
    imageCredit: "South China Morning Post / Love 21 Foundation",
    relatedStorySlugs: ["dragon-boating-inclusion"],
  },
];
