export type CommunityQuote = {
  id: string;
  quote: string;
  attribution: string;
  storySlug: string;
  storyHref: string;
  programmeLabel: string;
  programmeHref: string;
};

export const communityQuotes: CommunityQuote[] = [
  {
    id: "love-is-simple",
    quote: "Love is simple.",
    attribution: "Love 21 families · RTHK 精靈一點",
    storySlug: "rthk-health-interview",
    storyHref: "https://www.rthk.hk/tv/dtt31/programme/healthpedia_tv/episode/783569",
    programmeLabel: "Family programme",
    programmeHref: "/get-involved",
  },
  {
    id: "water-to-racing",
    quote: "From fear of water to racing in open water — inclusion through sport in action.",
    attribution: "South China Morning Post · Love 21 dragon boating",
    storySlug: "dragon-boating-inclusion",
    storyHref:
      "https://www.scmp.com/video/scmp-originals/3150667/hong-kong-yacht-club-and-charity-team-help-mentally-disabled-teens",
    programmeLabel: "Sports programme",
    programmeHref: "/get-involved",
  },
  {
    id: "purposeful-work",
    quote: "Those with Down's syndrome and autism are ready for purposeful employment.",
    attribution: "South China Morning Post · Love 21 Foundation",
    storySlug: "purposeful-employment",
    storyHref:
      "https://www.scmp.com/news/hong-kong/society/article/3155167/hong-kongs-love-21-foundation-aims-prove-those-downs",
    programmeLabel: "Get involved",
    programmeHref: "/get-involved",
  },
  {
    id: "nutrition-families",
    quote: "Free diet advice for children with intellectual disabilities in families who need it most.",
    attribution: "South China Morning Post · Love 21 nutrition",
    storySlug: "free-nutrition-guidance",
    storyHref:
      "https://www.scmp.com/lifestyle/health-wellness/article/3134294/hong-kong-charity-offers-free-diet-advice-and-guidance",
    programmeLabel: "Nutrition programme",
    programmeHref: "/get-involved",
  },
  {
    id: "long-happy-life",
    quote: "Nutrition and sport together — supporting longer, healthier lives.",
    attribution: "A Foodie World · Love 21 Foundation",
    storySlug: "long-happy-life",
    storyHref: "https://www.afoodieworld.com/foodie/love-21-s-open-secret-to-a-long-happy-life",
    programmeLabel: "Family & nutrition",
    programmeHref: "/get-involved",
  },
  {
    id: "autistic-careers",
    quote: "Challenging assumptions about what autistic people can do in their careers.",
    attribution: "Autistic & Unapologetic",
    storySlug: "autistic-police-officer-interview",
    storyHref: "https://autisticandunapologetic.com/2019/10/12/an-interview-with-an-autistic-police-officer/",
    programmeLabel: "Community programmes",
    programmeHref: "/get-involved",
  },
];
