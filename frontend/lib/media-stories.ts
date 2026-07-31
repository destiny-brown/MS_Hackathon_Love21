export type StoryTopic =
  | "employment"
  | "down-syndrome"
  | "autism"
  | "nutrition"
  | "sport"
  | "family"
  | "inclusion"
  | "community";

export type StoryAudience = "teachers" | "parents" | "all";

export type StoryType = "press" | "event" | "interview" | "journal" | "website";

export type ResourceOrigin = "love21" | "external";

export type MediaPost = {
  slug: string;
  title: string;
  date: string;
  coverImageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  topics: StoryTopic[];
  learningHook: string;
  audience: StoryAudience;
  type: StoryType;
  origin: ResourceOrigin;
};

/** Real Love 21 media posts — cover images and links from love21foundation.com/media/ */
export const mediaPosts: MediaPost[] = [
  {
    slug: "beyond-limits-banquet",
    title: "Tables & Seats Now Open for Beyond Limits Banquet",
    date: "May 11, 2026",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2026/05/bey0nd-limit_sz-1-1024x604.png",
    sourceUrl: "https://love21foundation.com/beyond-limits-banquet/",
    sourceLabel: "Love 21 Foundation",
    topics: ["community", "inclusion"],
    learningHook: "See how Love 21 celebrates the neurodiverse community at live events.",
    audience: "all",
    type: "event",
    origin: "love21",
  },
  {
    slug: "charity-raffle-2025",
    title: "Love 21 Foundation Charity Raffle 2025",
    date: "November 27, 2025",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2025/11/rafflebanner.png",
    sourceUrl: "https://love21foundation.com/raffle2025-2/",
    sourceLabel: "Love 21 Foundation",
    topics: ["community"],
    learningHook: "Community support helps fund nearly 1,000 free sessions monthly for families.",
    audience: "all",
    type: "event",
    origin: "love21",
  },
  {
    slug: "protecting-special-needs-children-covid",
    title: "【繞場一週】守護特殊兒童對抗疫境",
    date: "May 25, 2022",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-12.15.00.png",
    sourceUrl:
      "https://love21foundation.com/%e3%80%90%e7%b9%9e%e5%a0%b4%e4%b8%80%e9%80%b1%e3%80%91%e5%ae%88%e8%ad%b7%e7%89%b9%e6%ae%8a%e5%85%92%e7%ab%a5%e5%b0%8d%e6%8a%97%e7%96%ab%e5%a2%83/",
    sourceLabel: "Love 21 Foundation",
    topics: ["family", "community"],
    learningHook: "Families navigating challenges together — a shared experience many parents relate to.",
    audience: "parents",
    type: "press",
    origin: "love21",
  },
  {
    slug: "rthk-health-interview",
    title: "精靈一點 健康人物專訪- 愛·很簡單",
    date: "December 16, 2021",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-12.05.49-1024x575.png",
    sourceUrl: "https://www.rthk.hk/tv/dtt31/programme/healthpedia_tv/episode/783569",
    sourceLabel: "RTHK 精靈一點",
    topics: ["family", "inclusion"],
    learningHook: "Love is simple — hear from Love 21 families in this health interview.",
    audience: "parents",
    type: "interview",
    origin: "love21",
  },
  {
    slug: "long-happy-life",
    title: "Love 21's Open Secret to a Long, Happy Life",
    date: "November 9, 2021",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.59.49-1024x684.png",
    sourceUrl: "https://www.afoodieworld.com/foodie/love-21-s-open-secret-to-a-long-happy-life",
    sourceLabel: "A Foodie World",
    topics: ["nutrition", "family"],
    learningHook: "Nutrition and sport together — how Love 21 supports longer, healthier lives.",
    audience: "parents",
    type: "press",
    origin: "love21",
  },
  {
    slug: "purposeful-employment",
    title:
      "Hong Kong's Love 21 Foundation aims to prove those with Down's syndrome, autism ready for purposeful employment",
    date: "November 8, 2021",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.42.30-1024x638.png",
    sourceUrl:
      "https://www.scmp.com/news/hong-kong/society/article/3155167/hong-kongs-love-21-foundation-aims-prove-those-downs",
    sourceLabel: "South China Morning Post",
    topics: ["employment", "down-syndrome", "autism", "inclusion"],
    learningHook: "Real proof that employment myths don't match reality — members building meaningful careers.",
    audience: "teachers",
    type: "press",
    origin: "love21",
  },
  {
    slug: "dragon-boating-inclusion",
    title: "Hong Kong yacht club and charity team up to help special needs teens learn dragon boating",
    date: "September 30, 2021",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-11.51.15-1024x583.png",
    sourceUrl:
      "https://www.scmp.com/video/scmp-originals/3150667/hong-kong-yacht-club-and-charity-team-help-mentally-disabled-teens",
    sourceLabel: "South China Morning Post",
    topics: ["sport", "inclusion", "down-syndrome", "autism"],
    learningHook: "From fear of water to racing in open water — inclusion through sport in action.",
    audience: "teachers",
    type: "press",
    origin: "love21",
  },
  {
    slug: "free-nutrition-guidance",
    title:
      "Hong Kong charity offers free diet advice and guidance for children with intellectual disabilities in low-income families",
    date: "May 22, 2021",
    coverImageUrl: "https://love21foundation.com/wp-content/uploads/2022/06/Screenshot-2022-06-06-at-16.15.14-1024x683.png",
    sourceUrl:
      "https://www.scmp.com/lifestyle/health-wellness/article/3134294/hong-kong-charity-offers-free-diet-advice-and-guidance",
    sourceLabel: "South China Morning Post",
    topics: ["nutrition", "family"],
    learningHook: "How Love 21's nutrition programme supports families who need it most.",
    audience: "parents",
    type: "press",
    origin: "love21",
  },
];

/** Curated from neurodiversitynetwork.net/articles-websites — news & guides */
export const externalNeurodiversityResources: MediaPost[] = [
  {
    slug: "hbr-neurodiversity-competitive-advantage",
    title: "Neurodiversity as a Competitive Advantage",
    date: "May 2017",
    coverImageUrl: "https://hbr.org/resources/images/article_assets/2017/04/Jun21_01_183494879.jpg",
    sourceUrl: "https://hbr.org/2017/05/neurodiversity-as-a-competitive-advantage",
    sourceLabel: "Harvard Business Review",
    topics: ["employment", "inclusion", "autism"],
    learningHook: "Why hiring neurodivergent talent is a business advantage, not just a moral one.",
    audience: "teachers",
    type: "press",
    origin: "external",
  },
  {
    slug: "nyt-autism-office-design",
    title: "The Future of Work: An Office Designed for Neurodiversity",
    date: "February 2019",
    coverImageUrl:
      "https://static01.nyt.com/images/2019/02/24/magazine/24mag-autistic-slide-NPKV/24mag-autistic-slide-NPKV-facebookJumbo-v3.png",
    sourceUrl: "https://www.nytimes.com/interactive/2019/02/21/magazine/autism-office-design.html",
    sourceLabel: "The New York Times",
    topics: ["employment", "inclusion", "autism"],
    learningHook: "What happens when workplaces are designed for people who think differently.",
    audience: "teachers",
    type: "press",
    origin: "external",
  },
  {
    slug: "forbes-autism-employment-legal",
    title: "Effective Autism (Neurodiversity) Employment: A Legal Perspective",
    date: "January 2019",
    coverImageUrl:
      "https://imageio.forbes.com/blogs-images/michaelbernick/files/2019/01/autismatwork.png?format=png&height=900&width=1600&fit=bounds",
    sourceUrl:
      "https://www.forbes.com/sites/michaelbernick/2019/01/15/effective-autism-neurodiversity-employment-a-legal-perspective/",
    sourceLabel: "Forbes",
    topics: ["employment", "autism", "inclusion"],
    learningHook: "Legal frameworks that support neurodiverse hiring programmes.",
    audience: "teachers",
    type: "press",
    origin: "external",
  },
  {
    slug: "edsurge-peer-mentors",
    title: "Colleges Enlist Peer Mentors to Welcome Neurodivergent Students",
    date: "August 2019",
    coverImageUrl:
      "https://images.ctfassets.net/eflsecw4kznd/1E0PYQKWuKMNIzrhRgghiW/180ef8c7b951b6d680d9a9b9c2656c1e/shutterstock_565422706-1565303586.jpg",
    sourceUrl:
      "https://www.edsurge.com/news/2019-08-08-colleges-enlist-peer-mentors-to-make-campuses-more-welcoming-to-neurodivergent-students",
    sourceLabel: "EdSurge",
    topics: ["inclusion", "autism"],
    learningHook: "How peer support makes schools and campuses more inclusive.",
    audience: "teachers",
    type: "press",
    origin: "external",
  },
  {
    slug: "cbs-autism-talent",
    title: "Companies Open Doors to Talent with Autism",
    date: "September 2018",
    coverImageUrl:
      "https://assets2.cbsnewsstatic.com/hub/i/r/2018/02/09/c3db469f-a1ee-425f-8018-81ac27885c30/thumbnail/1200x630g2/dac07d36a6522bbec3c42f57c4c31de0/autism-at-work-sap-game-night-promo-top.jpg",
    sourceUrl: "https://www.cbsnews.com/news/companies-open-doors-to-talent-with-autism/",
    sourceLabel: "CBS News",
    topics: ["employment", "autism", "inclusion"],
    learningHook: "Corporate programmes that create real jobs for autistic adults.",
    audience: "teachers",
    type: "press",
    origin: "external",
  },
  {
    slug: "psychology-today-neurodiverse-college",
    title: "Choosing a College When You're Neurodiverse",
    date: "August 2018",
    coverImageUrl:
      "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_teaser_image/2018-08/_dsc4753.jpg?itok=H7MEnzpW",
    sourceUrl: "https://www.psychologytoday.com/us/blog/my-life-aspergers/201808/choosing-college-when-youre-neurodiverse",
    sourceLabel: "Psychology Today",
    topics: ["family", "inclusion", "autism"],
    learningHook: "Guidance for families navigating post-school transitions.",
    audience: "parents",
    type: "press",
    origin: "external",
  },
  {
    slug: "ability-mag-neurodiversity-real-world",
    title: "Neurodiversity in the Real World",
    date: "December 2019",
    coverImageUrl: "https://media.abilitymagazine.com/wp-content/uploads/2019/11/18120255/John-Robison-ocean.jpg",
    sourceUrl: "https://abilitymagazine.com/john-robison-neurodiversity-in-the-real-world/",
    sourceLabel: "Ability Magazine",
    topics: ["inclusion", "autism", "employment"],
    learningHook: "John Robison on what neurodiversity looks like beyond the textbook.",
    audience: "all",
    type: "press",
    origin: "external",
  },
  {
    slug: "autistic-police-officer-interview",
    title: "An Interview with an Autistic Police Officer",
    date: "October 2019",
    coverImageUrl: "https://autisticandunapologetic.com/wp-content/uploads/2019/10/The-Autistic-Policeman.jpg",
    sourceUrl: "https://autisticandunapologetic.com/2019/10/12/an-interview-with-an-autistic-police-officer/",
    sourceLabel: "Autistic & Unapologetic",
    topics: ["employment", "autism", "inclusion"],
    learningHook: "A first-person story challenging assumptions about autistic careers.",
    audience: "all",
    type: "interview",
    origin: "external",
  },
];

export const allResources: MediaPost[] = [...mediaPosts, ...externalNeurodiversityResources];

export const storyAudienceLabels: Record<StoryAudience, string> = {
  teachers: "Teachers",
  parents: "Parents & Carers",
  all: "Everyone",
};

export function getStoryBySlug(slug: string): MediaPost | undefined {
  return allResources.find((post) => post.slug === slug);
}

/** Resolve curated story slugs in order; skips unknown slugs. */
export function getStoriesBySlugs(slugs: string[]): MediaPost[] {
  return slugs
    .map((slug) => getStoryBySlug(slug))
    .filter((post): post is MediaPost => post !== undefined);
}

function scorePostsByTopics(posts: MediaPost[], topics: StoryTopic[], limit: number): MediaPost[] {
  const scored = posts.map((post) => ({
    post,
    score: post.topics.filter((t) => topics.includes(t)).length,
  }));
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.post.origin !== b.post.origin) return a.post.origin === "love21" ? -1 : 1;
      return allResources.indexOf(a.post) - allResources.indexOf(b.post);
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getStoriesByTopics(topics: StoryTopic[], limit = 2): MediaPost[] {
  const learnPool = allResources.filter((post) => post.origin !== "love21" || post.type !== "event");
  return scorePostsByTopics(learnPool, topics, limit);
}

/** Love 21 press & interviews for Learn — excludes promotions (events, raffles, banquets). */
export function getLove21LearnStories(audience: StoryAudience | "all-filter"): MediaPost[] {
  const educational = mediaPosts.filter((post) => post.type !== "event");
  if (audience === "all-filter") return educational;
  return educational.filter((post) => post.audience === audience || post.audience === "all");
}

export function getLove21StoriesForAudience(audience: StoryAudience | "all-filter"): MediaPost[] {
  return getLove21LearnStories(audience);
}

export function getExternalResourcesForAudience(audience: StoryAudience | "all-filter"): MediaPost[] {
  const external = externalNeurodiversityResources;
  if (audience === "all-filter") return external;
  return external.filter((post) => post.audience === audience || post.audience === "all");
}

/** @deprecated use getLove21StoriesForAudience or getExternalResourcesForAudience */
export function getStoriesForAudience(audience: StoryAudience | "all-filter"): MediaPost[] {
  return getLove21StoriesForAudience(audience);
}

export function mapTopicToStories(topic: string, limit = 2): MediaPost[] {
  const normalized = topic.toLowerCase();
  const topics: StoryTopic[] = [];

  if (normalized.includes("down")) topics.push("down-syndrome");
  if (normalized.includes("autism")) topics.push("autism");
  if (normalized.includes("adhd") || normalized.includes("education") || normalized.includes("inclusive")) {
    topics.push("inclusion");
  }
  if (normalized.includes("sensory") || normalized.includes("family")) topics.push("family");
  if (normalized.includes("employment") || normalized.includes("intellectual")) topics.push("employment");
  if (normalized.includes("nutrition")) topics.push("nutrition");

  if (topics.length === 0) topics.push("inclusion");
  return getStoriesByTopics(topics, limit);
}
