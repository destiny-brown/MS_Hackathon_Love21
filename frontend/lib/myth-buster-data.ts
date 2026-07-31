import type { MythFactClaim } from "@/components/learn/myth-fact-quiz-card";
import type { StoryTopic, MediaPost } from "@/lib/media-stories";
import { getStoriesBySlugs, getStoriesByTopics } from "@/lib/media-stories";

export type DailyChallenge = {
  id: string;
  statement: string;
  answer: "myth" | "fact";
  hint: string;
  explanation: string;
  source?: string;
  topic?: string;
  imageUrl?: string;
  imageCredit?: string;
  relatedTopics?: StoryTopic[];
  /** Hand-picked resources that directly relate to today's claim */
  relatedStorySlugs?: string[];
};

export function dailyChallengeToClaim(challenge: DailyChallenge): MythFactClaim {
  return {
    statement: challenge.statement,
    answer: challenge.answer,
    explanation: challenge.explanation,
    topic: challenge.topic,
    imageUrl: challenge.imageUrl,
    imageCredit: challenge.imageCredit,
    source: challenge.source,
  };
}

export function getDailyRelatedStories(challenge: DailyChallenge, limit = 2): MediaPost[] {
  if (challenge.relatedStorySlugs?.length) {
    return getStoriesBySlugs(challenge.relatedStorySlugs).slice(0, limit);
  }
  if (challenge.relatedTopics?.length) {
    return getStoriesByTopics(challenge.relatedTopics, limit);
  }
  return [];
}

export const dailyChallenges: DailyChallenge[] = [
  {
    id: "d1",
    statement: "Vaccines cause autism.",
    answer: "myth",
    hint: "Major health organisations have studied this extensively since the late 1990s.",
    explanation:
      "Decades of research show no link between vaccines and autism. The original study suggesting a connection was retracted and discredited.",
    source: "CDC, WHO",
  },
  {
    id: "d2",
    statement: "Autistic people can have deep, meaningful friendships.",
    answer: "fact",
    hint: "Social style differs — but connection and loyalty are not absent.",
    explanation:
      "Autistic people often form strong bonds. They may prefer smaller groups or communicate differently, but desire for friendship is universal.",
    topic: "Family",
    imageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-12.05.49-1024x575.png",
    imageCredit: "RTHK / Love 21 Foundation",
    relatedStorySlugs: ["rthk-health-interview"],
  },
  {
    id: "d3",
    statement: "Down syndrome is a disease that can be cured.",
    answer: "myth",
    hint: "It relates to genetics, not infection or illness.",
    explanation:
      "Down syndrome is a genetic condition, not a disease. There is no cure — and none is needed for a person to live a full, valued life with support.",
    relatedTopics: ["down-syndrome", "family"],
    topic: "Down Syndrome",
    imageUrl:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.42.30-1024x638.png",
    imageCredit: "South China Morning Post / Love 21 Foundation",
    relatedStorySlugs: ["purposeful-employment"],
  },
  {
    id: "d4",
    statement: "Girls and women are less likely to be diagnosed with autism.",
    answer: "fact",
    hint: "Diagnostic criteria were historically based on studies of boys.",
    explanation:
      "Autistic girls often mask symptoms to fit in, leading to underdiagnosis. Updated screening and awareness are improving recognition in women and girls.",
  },
  {
    id: "d5",
    statement: "People with ADHD cannot focus on anything.",
    answer: "myth",
    hint: "Think about hyperfocus on interests.",
    explanation:
      "ADHD affects attention regulation, not absence of focus. Many people with ADHD hyperfocus intensely on topics they find engaging.",
  },
  {
    id: "d6",
    statement: "Visual schedules help many neurodivergent children at school and home.",
    answer: "fact",
    hint: "Predictability reduces anxiety about what comes next.",
    explanation:
      "Visual timetables and step-by-step guides make transitions clearer, supporting independence and reducing stress for many learners.",
  },
  {
    id: "d7",
    statement: "Autistic people do not want social interaction at all.",
    answer: "myth",
    hint: "Some prefer quality over quantity in social contact.",
    explanation:
      "Many autistic people want connection but find certain social settings overwhelming. Preferences vary — some enjoy groups, others prefer one-on-one time.",
    topic: "Autism",
    imageUrl: "https://autisticandunapologetic.com/wp-content/uploads/2019/10/The-Autistic-Policeman.jpg",
    imageCredit: "Autistic & Unapologetic",
    relatedStorySlugs: ["autistic-police-officer-interview"],
  },
  {
    id: "d8",
    statement: "Early intervention can improve outcomes for children with developmental differences.",
    answer: "fact",
    hint: "Support during key developmental windows matters.",
    explanation:
      "Speech therapy, occupational therapy, and tailored education starting early can help children build skills and confidence. Support should be individualised.",
  },
  {
    id: "d9",
    statement: "Neurodiversity means ignoring challenges and pretending differences do not exist.",
    answer: "myth",
    hint: "It is about acceptance alongside appropriate support.",
    explanation:
      "Neurodiversity recognises natural variation in brains while still acknowledging that some people need accommodations, therapy, or medical care.",
  },
  {
    id: "d10",
    statement: "Employers benefit from hiring neurodivergent employees.",
    answer: "fact",
    hint: "Many companies report gains in creativity, accuracy, and loyalty.",
    explanation:
      "Neurodivergent employees often bring unique problem-solving skills, attention to detail, and fresh perspectives when workplaces are genuinely inclusive.",
    relatedTopics: ["employment", "inclusion"],
    topic: "Employment",
    imageUrl: "https://hbr.org/resources/images/article_assets/2017/04/Jun21_01_183494879.jpg",
    imageCredit: "Harvard Business Review",
    relatedStorySlugs: ["hbr-neurodiversity-competitive-advantage", "purposeful-employment"],
  },
  {
    id: "d11",
    statement: "All autistic children are non-speaking.",
    answer: "myth",
    hint: "Communication abilities exist on a wide spectrum.",
    explanation:
      "Some autistic people are non-speaking or minimally speaking; many use spoken language fluently. Augmentative communication supports those who need it.",
  },
  {
    id: "d12",
    statement: "Parenting style causes autism.",
    answer: "myth",
    hint: "Research points to genetics and brain development, not parenting.",
    explanation:
      "Autism has strong genetic components and develops before birth. 'Refrigerator mother' theories have been thoroughly disproven.",
  },
  {
    id: "d13",
    statement: "Fidget tools can help some students concentrate in class.",
    answer: "fact",
    hint: "Movement can support focus rather than distract from it.",
    explanation:
      "For many neurodivergent learners, quiet fidget items or movement breaks channel excess energy and improve attention instead of disrupting learning.",
  },
  {
    id: "d14",
    statement: "People with Down syndrome all look and act the same.",
    answer: "myth",
    hint: "Shared features do not mean shared personalities or abilities.",
    explanation:
      "While some physical features may be similar, every person with Down syndrome is an individual with unique talents, interests, and personality.",
    topic: "Down Syndrome",
    imageUrl:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.51.15-1024x583.png",
    imageCredit: "South China Morning Post / Love 21 Foundation",
    relatedStorySlugs: ["dragon-boating-inclusion"],
  },
  {
    id: "d15",
    statement: "Universal Design for Learning benefits all students, not just neurodivergent ones.",
    answer: "fact",
    hint: "Curb cuts and captions help everyone.",
    explanation:
      "Flexible teaching methods — multiple ways to engage, represent, and express learning — improve outcomes for the whole class, including neurotypical students.",
  },
  {
    id: "d16",
    statement: "Meltdowns are intentional bad behaviour that should be punished.",
    answer: "myth",
    hint: "They often follow sensory or emotional overload.",
    explanation:
      "Meltdowns are involuntary responses to overwhelm. Support, calm environments, and understanding triggers help more than punishment.",
  },
  {
    id: "d17",
    statement: "Autism is a spectrum — no two autistic people are exactly alike.",
    answer: "fact",
    hint: "The saying 'If you've met one autistic person…' exists for a reason.",
    explanation:
      "Autism affects people differently in communication, sensory processing, and daily living. Individualised understanding is essential.",
    topic: "Autism",
    imageUrl: "https://media.abilitymagazine.com/wp-content/uploads/2019/11/18120255/John-Robison-ocean.jpg",
    imageCredit: "Ability Magazine",
    relatedStorySlugs: ["ability-mag-neurodiversity-real-world"],
  },
  {
    id: "d18",
    statement: "Special education means separating students from their peers permanently.",
    answer: "myth",
    hint: "Inclusion can mean support within general education settings.",
    explanation:
      "Many students thrive with in-class support, modified materials, or part-time specialist services while remaining connected to their peer community.",
  },
  {
    id: "d19",
    statement: "Using clear, literal language helps when communicating with many autistic people.",
    answer: "fact",
    hint: "Idioms and sarcasm can be confusing without context.",
    explanation:
      "Direct, specific language reduces misunderstandings. This does not mean treating adults like children — clarity respects their communication needs.",
  },
  {
    id: "d20",
    statement: "Neurodivergent people cannot succeed in STEM careers.",
    answer: "myth",
    hint: "History includes many notable neurodivergent scientists and engineers.",
    explanation:
      "Neurodivergent individuals excel across fields including technology, research, arts, and healthcare when given accessible pathways and accommodations.",
    relatedTopics: ["employment", "inclusion"],
    topic: "Employment",
    imageUrl: "https://hbr.org/resources/images/article_assets/2017/04/Jun21_01_183494879.jpg",
    imageCredit: "Harvard Business Review",
    relatedStorySlugs: ["hbr-neurodiversity-competitive-advantage", "purposeful-employment"],
  },
  {
    id: "d21",
    statement: "Anxiety and depression are more common among neurodivergent youth.",
    answer: "fact",
    hint: "Social exclusion and masking contribute to mental health strain.",
    explanation:
      "Neurodivergent young people face higher rates of mental health challenges, often linked to bullying, masking, and lack of support. Early mental health care matters.",
  },
  {
    id: "d22",
    statement: "Autistic people cannot understand humour or sarcasm.",
    answer: "myth",
    hint: "Appreciation and detection are not the same thing.",
    explanation:
      "Many autistic people enjoy and create humour. Some may miss sarcasm in unfamiliar contexts, but this varies widely among individuals.",
  },
  {
    id: "d23",
    statement: "Peer buddy programmes can reduce bullying of neurodivergent students.",
    answer: "fact",
    hint: "Friendship and awareness change school culture.",
    explanation:
      "Structured peer support builds empathy, friendships, and protective relationships that make schools safer and more welcoming for everyone.",
  },
  {
    id: "d24",
    statement: "ADHD is caused by too much screen time or sugar.",
    answer: "myth",
    hint: "It is a neurodevelopmental condition with genetic roots.",
    explanation:
      "ADHD is linked to brain development and genetics. Diet and screens may affect behaviour generally but do not cause ADHD.",
  },
  {
    id: "d25",
    statement: "Families of neurodivergent children benefit from connecting with other families.",
    answer: "fact",
    hint: "Shared experience reduces isolation.",
    explanation:
      "Parent and carer support groups, like those run by Love 21, provide practical advice, emotional support, and community that professionals alone cannot offer.",
    relatedTopics: ["family", "community"],
    topic: "Family",
    imageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-12.05.49-1024x575.png",
    imageCredit: "RTHK / Love 21 Foundation",
    relatedStorySlugs: ["rthk-health-interview", "free-nutrition-guidance"],
  },
  {
    id: "d26",
    statement: "Intellectual disability means a person cannot learn new skills.",
    answer: "myth",
    hint: "Learning may be slower or need different methods — but it continues.",
    explanation:
      "People with intellectual disabilities learn throughout life with appropriate teaching strategies, patience, and encouragement.",
    topic: "Down Syndrome",
    imageUrl:
      "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.42.30-1024x638.png",
    imageCredit: "South China Morning Post / Love 21 Foundation",
    relatedStorySlugs: ["purposeful-employment"],
  },
  {
    id: "d27",
    statement: "Quiet rooms or sensory breaks can prevent overload in busy environments.",
    answer: "fact",
    hint: "Prevention beats recovery from meltdown.",
    explanation:
      "Proactive sensory breaks in calm spaces help neurodivergent people recharge before reaching crisis point — useful in schools, workplaces, and events.",
  },
  {
    id: "d28",
    statement: "Autism can be outgrown with enough therapy.",
    answer: "myth",
    hint: "People can develop skills — but their neurology remains.",
    explanation:
      "Therapy builds skills and independence, but autism is lifelong. The goal is support and self-advocacy, not 'recovery' from being autistic.",
  },
  {
    id: "d29",
    statement: "Celebrating neurodiversity includes valuing different ways of thinking.",
    answer: "fact",
    hint: "Diverse teams solve problems differently.",
    explanation:
      "Neurodiversity frames brain differences as natural human variation. Valuing these differences fosters innovation, inclusion, and belonging.",
  },
  {
    id: "d30",
    statement: "Only specialists should interact with neurodivergent children.",
    answer: "myth",
    hint: "Everyday inclusion happens through ordinary relationships.",
    explanation:
      "Teachers, neighbours, classmates, and volunteers all play a role. Simple kindness, patience, and willingness to learn go a long way.",
  },
  {
    id: "d31",
    statement: "Accessible communication includes giving people time to process and respond.",
    answer: "fact",
    hint: "Silence is not disinterest — it may be processing.",
    explanation:
      "Pausing after questions, using visual supports, and avoiding rushing responses respects different processing speeds and communication styles.",
  },
];

/** Pick today's challenge deterministically from the pool. */
export function getDailyChallenge(date: Date = new Date()): DailyChallenge {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dailyChallenges[dayOfYear % dailyChallenges.length];
}

export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export const MAX_DAILY_ATTEMPTS = 3;
