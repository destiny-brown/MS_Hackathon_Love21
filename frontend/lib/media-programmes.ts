export type MediaProgramme = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  cta: string;
};

/** Programme rows from Love 21 media page — paired with on-site imagery. */
export const mediaProgrammes: MediaProgramme[] = [
  {
    title: "Sports",
    description:
      "Our sports programme is designed without limitations. We aim to give our beneficiaries the greatest opportunity to reach their full potential by offering a comprehensive range of activities while also striving for excellence in each sport. In addition to sport classes, we also focus on strength training, coordination and mental health activities.",
    imageSrc: "/images/sports.png",
    imageAlt: "Love 21 sports programme in session",
    href: "/get-involved",
    cta: "Explore",
  },
  {
    title: "Nutrition",
    description:
      "Sport classes alone are not enough to significantly extend the life expectancy of our beneficiaries. This is why we've developed a well thought out nutrition programme to help our community make significant healthy lifestyle changes. We also run regular cooking and food prep lessons to teach our families how to prepare these meals nutritiously and easily.",
    imageSrc: "/images/nutrition.png",
    imageAlt: "Love 21 nutrition programme workshop",
    href: "/get-involved",
    cta: "Explore",
  },
  {
    title: "Family",
    description:
      "Love 21's focus on family sets us apart. Our parent beneficiaries play a huge role in our classes. We offer specialty classes for parents only and allow parental participation in a large number of our sport and healthy lifestyle classes.",
    imageSrc: "/images/family.png",
    imageAlt: "Families participating in a Love 21 programme",
    href: "/get-involved",
    cta: "Explore",
  },
  {
    title: "CSR",
    description:
      "Our Corporate Social Responsibility Programme is an important one for Hong Kong. Your employees will learn about our beneficiary's amazing ability in sport, and also about their greatest ability in bringing the best out of people.",
    imageSrc: "/images/csr.png",
    imageAlt: "Corporate volunteers at a Love 21 CSR session",
    href: "/get-involved",
    cta: "Learn more",
  },
];
