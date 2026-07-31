export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Learn", href: "/learn-play" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Impact", href: "/impact-dashboard" },
  { label: "Stories", href: "/stories-media" },
  { label: "Events", href: "/events-campaigns" },
  { label: "About Us", href: "/about-governance" },
];

export const footerNav: NavItem[] = [
  { label: "Volunteers", href: "/our-volunteer" },
  { label: "Donate", href: "/donate" },
  { label: "Join Us", href: "/join-us" },
  { label: "Our Reports", href: "/our-finance" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Wishlist: Help Us", href: "/shop" },
  { label: "Members", href: "/members" },
  { label: "Contact Us", href: "/contact-us" },
];

export const stats = [
  { value: "500+", label: "Families served" },
  { value: "800+", label: "Sessions of classes and activities each month" },
  { value: "90+", label: "Types of activities" },
  { value: "1000+", label: "Volunteer hours per month" },
];

/** Live Impact Public Dashboard metrics (homepage). */
export const impactStats = [
  { target: 600, suffix: "+", label: "Families Served Monthly" },
  { target: 1000, suffix: "+", label: "Classes & Activities Each Month" },
  { target: 1000, suffix: "+", label: "Volunteer Hours Per Month" },
];

/** Hero community photo gallery slides (homepage). */
export const heroGallery = [
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Neurodiverse community members smiling together during a group programme",
    caption: "Down Syndrome & Autism Empowerment",
  },
  {
    src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
    alt: "Families and peers connecting during a support session",
    caption: "Family & Peer Support",
  },
  {
    src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
    alt: "Holistic nutrition workshop with fresh wholesome foods",
    caption: "Holistic Nutrition & Health",
  },
  {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
    alt: "Self-advocate communicating and participating in community life",
    caption: "Nonverbal Inclusion & Voice",
  },
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
    alt: "Volunteers and members collaborating toward greater independence",
    caption: "Community Independence",
  },
];

/** Four-door homepage navigation cards. */
export const fourDoors = [
  {
    title: "Education & Support",
    description: "Grow life skills, join inclusive programmes, and access family care across sport, nutrition, and support.",
    href: "/get-involved",
  },
  {
    title: "Donate & Partner",
    description: "Fund nutrition packs, blood testing, coaching sessions, and day-to-day community care.",
    href: "/donate",
  },
  {
    title: "Volunteer",
    description: "Share your time supporting weekly classes, family sessions, and inclusive community events.",
    href: "/our-volunteer",
  },
  {
    title: "Activity Calendar",
    description: "Find upcoming sports, nutrition workshops, family programmes, and community gatherings.",
    href: "/events-campaigns",
  },
];

export type StorySpotlight = {
  name: string;
  tag: string;
  quote: string;
  href: string;
  image: string;
  alt: string;
};

/** Featured Story Spotlight carousel cards (homepage). */
export const storySpotlight: StorySpotlight[] = [
  {
    name: "Jamie",
    tag: "TEDx Speaker & Self-Advocate",
    quote:
      "Delivering my first TEDx talk proved to everyone that having Down syndrome never limits what you can express and contribute.",
    href: "/stories-media",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
    alt: "Self-advocate presenting on stage at a public speaking event",
  },
  {
    name: "Chris",
    tag: "Purposeful Employment Milestone",
    quote:
      "Working independently in food service and community outreach, gaining confidence and financial independence.",
    href: "/our-story",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1000&q=80",
    alt: "Young adult thriving at purposeful employment in a community workplace",
  },
  {
    name: "Mei",
    tag: "Holistic Health & Sports Champion",
    quote:
      "Overcoming health challenges through tailored nutrition and sports classes, now mentoring younger neurodiverse peers.",
    href: "/get-involved",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80",
    alt: "Community champion mentoring peers after holistic health progress",
  },
];

export const programmes = [
  {
    title: "Sports",
    description:
      "Our sports programme is designed without limitations. We aim to give our beneficiaries the greatest opportunity to reach their full potential by offering a comprehensive range of activities while also striving for excellence in each sport.",
  },
  {
    title: "Nutrition",
    description:
      "Sport classes alone are not enough to significantly extend the life expectancy of our beneficiaries. This is why we've developed a well thought out nutrition programme to help our community make significant healthy lifestyle changes.",
  },
  {
    title: "Family",
    description:
      "Love 21's focus on family sets us apart. Our parent beneficiaries play a huge role in our classes. We offer specialty classes for parents only and allow parental participation in a large number of our sport and healthy lifestyle classes.",
  },
  {
    title: "CSR",
    description:
      "Our Corporate Social Responsibility Programme is an extremely important one for Hong Kong. Your employees will learn about our beneficiary's amazing ability in sport, and also about their greatest ability in bringing the best out of people.",
  },
];

export { mediaPosts, type MediaPost } from "@/lib/media-stories";

export const annualReports = [
  { year: "2024-2025", href: "#" },
  { year: "2023-2024", href: "#" },
  { year: "2022-2023", href: "#" },
];

export type BoardMember = { slug: string; name: string; bio: string };

export const boardMembers: BoardMember[] = [
  {
    slug: "carol-chan",
    name: "Carol Chan",
    bio: "Carol has a passion for sports and healthy lifestyle, and embraces a mission in developing the young and promoting healthy family functioning. Professionally, Carol is experienced in nonprofit governance as a seasoned administrator serving one of the leading local NGOs supporting children and youth in Hong Kong.",
  },
  {
    slug: "dan-maley",
    name: "Dan Maley",
    bio: "Dan has resided in Hong Kong since 2019. He is married to his wife Milk and father to Max. Dan is a global citizen who began volunteering at Love 21 Foundation in 2020, initially attending fitness classes and eventually helping teach a weekly boxing class.",
  },
  {
    slug: "dr-ruby-ng",
    name: "Dr. Ruby Ng",
    bio: "Dr. Ruby Ng is a Biofeedback Specialist at Stanford Medicine Children's Health in San Francisco, California. Born and raised in Hong Kong, Dr. Ng pursued her education and built her medical career overseas. She is now actively reconnecting with Hong Kong through community service and nonprofit leadership.",
  },
  {
    slug: "edith-chen",
    name: "Edith Chen",
    bio: "Edith Chen brings over 27 years of executive expertise in driving business transformation, multi-market expansion, brand development and governance across the Asia-Pacific region. Having served as President of De Beers APAC, CEO of Brooks Brothers APAC, and Managing Director of Calvin Klein Asia.",
  },
  {
    slug: "elenisymeonidou",
    name: "Eleni Symeonidou",
    bio: "Eleni, originally from Greece, has lived in Asia since 2013. Her career has been dedicated to developing people in various capacities, driven by a deep commitment to fostering inclusive communities. She has over 25 years of volunteer experience in mental health, homelessness, and supporting minority groups.",
  },
  {
    slug: "james-barrett",
    name: "James Barrett",
    bio: "Originally from Australia, James has lived in Hong Kong since 2008. His commitment to the neurodiverse community is deeply personal; his family's involvement dates back to 1953, when his great-grandmother co-founded a kindergarten for children with Down syndrome.",
  },
  {
    slug: "jeff-sayed",
    name: "Jeff Sayed",
    bio: "Jeff has lived in Hong Kong since 2005. He is married to Wendy and father to Benton and Olivia. Jeff works for Bank of America Merrill Lynch and is currently Compliance & Operational Risk Executive responsible for overseeing the Compliance and Operational Risk framework for APAC Global Technology & Operations.",
  },
  {
    slug: "kevin-wong",
    name: "Kevin Wong",
    bio: "As the treasurer on the Love 21 board, Kevin brings his experience in accounting and finance to ensure the continual and sustained growth of Love 21. Kevin's efforts in developing and maintaining a consolidated and transparent accounting system for Love 21 has been instrumental in our development.",
  },
  {
    slug: "lobo-cheung",
    name: "Lobo Cheung",
    bio: "Lobo grew up in Hong Kong and went to the United Kingdom for college in 1994. After building a stable career in the tech sector, he decided in 2016 to pursue an Executive MBA and MA in Christian Studies. Lobo has always felt a calling towards building a better future for those in the Down Syndrome and Autism Spectrum Disorder community.",
  },
  {
    slug: "matthew-hosford",
    name: "Matthew Hosford",
    bio: "Matthew has lived in Hong Kong with his family for 27 years. He has built a career in financial services in Asia including 17 years with Santander, seven years with PwC in their Risk Management Advisory practice, and most recently with the International Finance Corporation.",
  },
  {
    slug: "raymond-tam",
    name: "Raymond Tam",
    bio: "Raymond is a seasoned financial executive with nearly 30 years of leadership experience in digital wealth, pension, and asset management at Manulife, Value Partners, BlackRock, and Merrill Lynch. He is dedicated to contributing his governance and financial expertise to support community and social impact initiatives.",
  },
  {
    slug: "young-sook-stewart",
    name: "Young-Sook Stewart",
    bio: "As the APAC Leader of Talent Function for EY Financial Services Organisation, Young-Sook manages operations across Oceania, Greater China, Japan, Korea, and ASEAN. Her dynamic team has been instrumental in driving APAC FSO's robust business growth via talent acquisition, retention, and development.",
  },
];

export const internshipRoles = [
  "Devising a sports programme for our community",
  "Managing the operations of Love 21 Space (our community centre)",
  "Proposal writing and project/programme reporting",
  "Refining and executing our nutrition programme",
  "Administrative and operational work",
  "Marketing and design",
];

export const internshipRequirements = [
  "Fluent English and Chinese, written and spoken",
  "Currently enrolled in university",
  "Interest and/or experience in the NGO industry preferred",
  "Flexible, compassionate and proactive",
];
