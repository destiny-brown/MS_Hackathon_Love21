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
  { label: "Families (Member Registration)", href: "/members" },
  { label: "Volunteers", href: "/our-volunteer" },
  { label: "Donate", href: "/donate" },
  { label: "Wishlist", href: "/shop" },
  { label: "Annual Reports", href: "/our-finance" },
  { label: "Board of Directors", href: "/board-of-directors" },
  { label: "Staff", href: "/staff" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Newsletter", href: "/newsletter" },
];

export const stats = [
  { value: "500+", label: "Families served" },
  { value: "800+", label: "Sessions of classes and activities each month" },
  { value: "90+", label: "Types of activities" },
  { value: "1000+", label: "Volunteer hours per month" },
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

export const mediaPosts = [
  { title: "Tables & Seats Now Open for Beyond Limits Banquet", date: "May 11, 2026" },
  { title: "Love 21 Foundation Charity Raffle 2025", date: "November 27, 2025" },
  { title: "【繞場一週】守護特殊兒童對抗疫境", date: "May 25, 2022" },
  { title: "精靈一點 健康人物專訪- 愛·很簡單", date: "December 16, 2021" },
  { title: "Love 21's Open Secret to a Long, Happy Life", date: "November 9, 2021" },
  {
    title: "Hong Kong's Love 21 Foundation aims to prove those with Down's syndrome, autism ready for purposeful employment",
    date: "November 8, 2021",
  },
  {
    title: "Hong Kong yacht club and charity team up to help special needs teens learn dragon boating",
    date: "September 30, 2021",
  },
  {
    title: "Hong Kong charity offers free diet advice and guidance for children with intellectual disabilities in low-income families",
    date: "May 22, 2021",
  },
];

export const annualReports = [
  { year: "2024-2025", href: "#" },
  { year: "2023-2024", href: "#" },
  { year: "2022-2023", href: "#" },
];

export const shopProducts = [
  { name: "Product A", price: "HKD$1.00" },
  { name: "Product B", price: "HKD$9.00" },
  { name: "Product C", price: "HKD$50.00" },
  { name: "Product D", price: "HKD$99.00" },
  { name: "Product E", price: "HKD$200.00" },
];

export type BoardMember = { slug: string; name: string; bio: string };

export const boardMembers: BoardMember[] = [
  {
    slug: "carol-chan",
    name: "Carol Chan",
    bio: `Carol has a passion for sports and healthy lifestyle, and embraces a mission in developing the young and promoting healthy family functioning. Professionally, Carol is experienced in nonprofit governance as a seasoned administrator serving one of the leading local NGOs supporting children and youth in Hong Kong. Prior to joining the NGO sector, Carol has worked in the Proctor & Gamble Hong Kong and in Asia Market, the largest Asian food suppliers in Ireland.

With 20 years of netball experience, Carol has been a national player, a certified coach and is one of the top umpires in HK who has umpired in multiple international tournaments and has groomed many umpires before giving birth to her 1-year-old son. Carol has served as Council Member of the Hong Kong Netball Association till 2017 and was the founding Chairman of the Hantang Netball Club (2016-2020), the only non-profit local community netball club that has reached out to the underprivileged children in addition to nurturing elite youth player. With the passion to sharing healthy lifestyle and eating well to the wider community, Carol provides support and advice to a healthy food company distributing healthy food imported from Taiwan.

Carol has earned her Master of Philosophy in Psychology (specialised in child development and parenting) from the Chinese University of Hong Kong and the Bachelor of Economics and Finance from the University of Hong Kong. She has also completed the Professional Diploma for Company Secretaries by the HKMA, and is an alumni of the HK Young Leaders Programme by the Global Institute for Tomorrow and was one of the presenters for the proposal on a Community Sports Hub Project in the public forum.`,
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
