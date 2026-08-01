export type MemberStory = {
  slug: string;
  name: string;
  quote: string;
  bgImage: string;
  /** Stable category keys for i18n (`memberStories.categories.*`). */
  categories: string[];
  /** Page title when a full story exists; falls back to "{name}'s Story". */
  title?: string;
  /** Full story body paragraphs joined by blank lines. */
  body?: string;
};

export const memberStoryCategoryLabels: Record<string, string> = {
  sports: "Sports",
  fitness: "Fitness",
  "family-support": "Family Support",
  "employment-development": "Employment & Development Programs",
  "community-education": "Community and Education",
};

export const memberStories: MemberStory[] = [
  {
    slug: "yuk-lam",
    name: "Yuk Lam",
    title: "Yuk Lam's Story",
    categories: ["sports", "fitness", "family-support"],
    quote:
      "I would use the word 'home' to describe Love 21,\" said Yuk Lam's mother, \"Every coach and staff member at Love 21 treats Yuk Lam like a sibling.",
    bgImage: "/images/yuklam.png",
    body: [
      "For 31-year-old Yuk Lam and Yuk Lam's mother, Love 21 is not just a place to participate in activities. \"I would use the word 'home' to describe Love 21,\" said Yuk Lam's mother, \"Every coach and staff member at Love 21 treats Yuk Lam like a sibling.\" Since joining Love 21 in 2020, Yuk Lam has been an active participant in various programmes offered by the centre. Yuk Lam's favorite activities include dancing, football, and arts and crafts. Although the pandemic limited his participation in in-person events, the online dance and fitness activities offered by Love 21 provided Yuk Lam with opportunities to stay active. By mid-2022, as the pandemic eased and when the Love 21 centre gradually reopened, it became a place Yuk Lam would visit two or three times a week.",
      "One of the most profound impressions Love 21 has left on Yuk Lam's mother are the sincere and compassionate instructors, assistants, volunteers, and staff members at the organization. As a result, after participating in Love 21 activities, Yuk Lam's mother noticed a significant increase in Yuk Lam's confidence, \"The instructors and staff at Love21 are very patient and provide a lot of encouragement during the activities. Even if members may not replicate the perfect steps or standard dance movements, the instructors and staff acknowledge their efforts through praise and positive reinforcement. This kind of affirmation from others provides great motivation and support for Yuk Lam and other friends with special needs, keeping them interested in participating in different activities.\"",
      "At the end of January 2023, the Love 21 centre unfortunately suffered from severe damage from a neighbouring fire rendering the centre unusable for hosting activities. However, with the assistance of Love 21's sponsors and partner organizations, the centre was still able to organize events for members and their families by renting venues. During this period, one of the experiences that left a deep impression on Yuk Lam was his dance performance at the Central AIA Carnival. Despite the need for frequent visits to different venues for practice and rehearsals with the dance troupe, with the efforts of the instructors and members, the performance was quite successful, and Yuk Lam felt satisfied and proud of his performance.",
      "Both Yuk Lam and his mother are eagerly looking forward to the opening of Love 21's new centre in the fourth quarter of 2023. The new centre will be more spacious and can accommodate a wider variety of activities suitable for members with different interests. Yuk Lam's mother concluded, \"We are grateful for the support of Love 21's donors and sponsors, which allows the organisation to provide opportunities for children with special needs to showcase their talents. We hope the new center can offer diverse activities that add color to the lives of more children with Down syndrome, autism, and their families.\"",
    ].join("\n\n"),
  },
  {
    slug: "siu-kei",
    name: "Siu Kei",
    title: "Siu Kei's Story (By Siu Kei's Mother / 紹歧媽媽)",
    categories: ["employment-development", "community-education"],
    quote:
      "He took on assistant roles across multiple departments, which significantly enhanced his social interaction skills, sense of responsibility, and ability to adapt knowledge to real-world scenarios.",
    bgImage: "/images/siukei.png",
    body: [
      "From November 2023 to May 2024, Siu Kei (陳紹岐) participated in the Love 21 Employment Training Programme. During this period, he took on assistant roles across multiple departments, which significantly enhanced his social interaction skills, sense of responsibility, and ability to adapt knowledge to real-world scenarios. Each role provided opportunities for personal growth and hands-on learning.",
      "The training schedule was well-structured, allowing him to apply theoretical knowledge to practical tasks in various positions. Additionally, the programme offered comprehensive support—including access to computer resources, job interview training, and workshops on communication and social skills—enabling Siu Kei to gain deeper insights into the workplace and build substantial confidence.",
      "Overall, this was an extremely rewarding training experience. We sincerely hope such programme will continue in the future, empowering more participants to grow and develop their potential. The above reflects Siu Kei's firsthand experience and our heartfelt gratitude to Love21!",
    ].join("\n\n"),
  },
  {
    slug: "brian-ngan",
    name: "Brian Ngan",
    title: "Brian Ngan's Story (By Brian's Father / 健希爸爸)",
    categories: ["employment-development", "family-support"],
    quote:
      "Since childhood Brian was quite protected and did not think he had any strengths and abilities. Fortunately after joining Love 21 we have quickly learnt how capable and talented he truly is.",
    bgImage: "/images/brianngan.png",
    body: [
      "Child Brian Ngan (顏建希) participated in the Love 21 Foundation work internship programme for more than a year. Since childhood Brian was quite protected and did not think he had any strengths and abilities. Fortunately after joining Love 21 we have quickly learnt how capable and talented he truly is.",
      "Thank you very much to the staff of the center, the instructors and interns. The caring and friendly assistance has greatly helped Brian achieve great improvement over the years. Brian has really enjoyed his internship and it's been so nice seeing Brian very engaged and enthusiastic about his work. A lot of my earlier concerns have gone and I'm much more optimistic about my son's future.",
      "Finally, a huge thank you to the Love21 Foundation and the Fund support, giving Brian and other members such a meaningful opportunity.",
    ].join("\n\n"),
  },
  {
    slug: "marissa",
    name: "Marissa",
    title: "Marissa's Story (By Marissa's Mom)",
    categories: ["sports", "fitness", "family-support"],
    quote:
      "Sports development programme. Staff offered invaluable guidance, specialised fitness training and bocce classes.",
    bgImage: "/images/marissa.png",
    body: [
      "In mid-2024, we grew concerned as Marissa's walking deteriorated rapidly. Her pace slowed to half, her gait became unsteady and could only \"flick\" without moving forward, she even fell on flat ground. Despite seeing a neurologist which brought tests like MRI, X-ray, and blood test, the cause remained unidentified, leaving us anxious and helpless.",
      "Relief came when we joined Love 21's \"Sports development programme\". Staff offered invaluable guidance, specialised fitness training and bocce classes. Her posture and speed improved day by day, and her smile after each class was priceless.",
      "After three months, the transformation was remarkable: her speed and stability returned, and she could even run again! Marissa was happy and fully engaged in her training. I believe she felt her progress, and grew confidence. We are deeply grateful to Love 21 for their care and dedication. Your efforts are greatly appreciated and will benefit many families like ours.",
    ].join("\n\n"),
  },
];

export function getMemberStory(slug: string): MemberStory | undefined {
  return memberStories.find((story) => story.slug === slug);
}
