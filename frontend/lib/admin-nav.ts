import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Gift,
  Heart,
  HeartHandshake,
  Home,
  HelpCircle,
  Mail,
  Sparkles,
  Video,
  FileText,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  labelKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type AdminNavSection = {
  titleKey: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    titleKey: "nav.sections.home",
    items: [
      {
        href: "/admin",
        labelKey: "nav.overview.label",
        descriptionKey: "nav.overview.description",
        icon: Home,
        exact: true,
      },
    ],
  },
  {
    titleKey: "nav.sections.operations",
    items: [
      {
        href: "/admin/analytics",
        labelKey: "nav.analytics.label",
        descriptionKey: "nav.analytics.description",
        icon: BarChart3,
      },
      {
        href: "/admin/events",
        labelKey: "nav.events.label",
        descriptionKey: "nav.events.description",
        icon: Calendar,
      },
      {
        href: "/admin/volunteers",
        labelKey: "nav.volunteers.label",
        descriptionKey: "nav.volunteers.description",
        icon: Heart,
      },
      {
        href: "/admin/donations",
        labelKey: "nav.donations.label",
        descriptionKey: "nav.donations.description",
        icon: Gift,
      },
      {
        href: "/admin/gratitude",
        labelKey: "nav.gratitude.label",
        descriptionKey: "nav.gratitude.description",
        icon: Sparkles,
      },
      {
        href: "/admin/stories",
        labelKey: "nav.stories.label",
        descriptionKey: "nav.stories.description",
        icon: HeartHandshake,
      },
      {
        href: "/admin/newsletter",
        labelKey: "nav.newsletter.label",
        descriptionKey: "nav.newsletter.description",
        icon: Mail,
      },
    ],
  },
  {
    titleKey: "nav.sections.learnContent",
    items: [
      {
        href: "/admin/learn",
        labelKey: "nav.learnHub.label",
        descriptionKey: "nav.learnHub.description",
        icon: BookOpen,
        exact: true,
      },
      {
        href: "/admin/learn/questions",
        labelKey: "nav.learnQuestions.label",
        descriptionKey: "nav.learnQuestions.description",
        icon: HelpCircle,
      },
      {
        href: "/admin/learn/resources",
        labelKey: "nav.learnResources.label",
        descriptionKey: "nav.learnResources.description",
        icon: FileText,
      },
      {
        href: "/admin/learn/videos",
        labelKey: "nav.learnVideos.label",
        descriptionKey: "nav.learnVideos.description",
        icon: Video,
      },
    ],
  },
];

export const adminNavItems: AdminNavItem[] = adminNavSections.flatMap((section) => section.items);

export function isAdminNavActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
