import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Gift,
  Heart,
  Home,
  HelpCircle,
  Mail,
  Sparkles,
  Video,
  FileText,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    title: "Home",
    items: [
      {
        href: "/admin",
        label: "Overview",
        description: "Staff home and quick links",
        icon: Home,
        exact: true,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        href: "/admin/analytics",
        label: "Analytics",
        description: "Traffic, engagement, and impact metrics",
        icon: BarChart3,
      },
      {
        href: "/admin/events",
        label: "Events",
        description: "Create events and track registrations",
        icon: Calendar,
      },
      {
        href: "/admin/volunteers",
        label: "Volunteers",
        description: "Manage volunteer programmes and sign-ups",
        icon: Heart,
      },
      {
        href: "/admin/donations",
        label: "Donations & wishlist",
        description: "Campaigns, causes, and wishlist needs",
        icon: Gift,
      },
      {
        href: "/admin/gratitude",
        label: "Gratitude wall",
        description: "Review and approve member submissions",
        icon: Sparkles,
      },
      {
        href: "/admin/newsletter",
        label: "Newsletter",
        description: "Subscribers, drafts, and send history",
        icon: Mail,
      },
    ],
  },
  {
    title: "Learn content",
    items: [
      {
        href: "/admin/learn",
        label: "Learn hub",
        description: "Quiz, resources, and video library",
        icon: BookOpen,
        exact: true,
      },
      {
        href: "/admin/learn/questions",
        label: "Questions",
        description: "Myth vs fact quiz and daily myths",
        icon: HelpCircle,
      },
      {
        href: "/admin/learn/resources",
        label: "Resources",
        description: "Articles, press, and learning links",
        icon: FileText,
      },
      {
        href: "/admin/learn/videos",
        label: "Short videos",
        description: "Curated YouTube picks for Learn",
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
