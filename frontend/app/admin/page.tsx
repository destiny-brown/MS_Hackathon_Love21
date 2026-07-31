"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  Heart,
  Users,
  Mail,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  stats?: string;
}

export default function AdminDashboardPage() {
  const [eventCount, setEventCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    // Load counts from localStorage
    if (typeof window !== "undefined") {
      const events = localStorage.getItem("love21_events");
      const programs = localStorage.getItem("love21_volunteers");
      const subscribers = localStorage.getItem("love21_newsletter");

      if (events) {
        try {
          setEventCount(JSON.parse(events).length);
        } catch {}
      }
      if (programs) {
        try {
          setProgramCount(JSON.parse(programs).length);
        } catch {}
      }
      if (subscribers) {
        try {
          setSubscriberCount(JSON.parse(subscribers).length);
        } catch {}
      }
    }
  }, []);

  const adminCards: AdminCard[] = [
    {
      title: "Analytics Dashboard",
      description: "View website traffic, engagement, and impact metrics",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/admin/analytics",
      color: "from-blue-500 to-blue-600",
      stats: "Live data",
    },
    {
      title: "Manage Events",
      description: "Create, edit, and track event registrations",
      icon: <Calendar className="h-8 w-8" />,
      href: "/admin/events",
      color: "from-purple-500 to-purple-600",
      stats: `${eventCount} events`,
    },
    {
      title: "Volunteer Programs",
      description: "Manage volunteer opportunities and track sign-ups",
      icon: <Heart className="h-8 w-8" />,
      href: "/admin/volunteers",
      color: "from-pink-500 to-pink-600",
      stats: `${programCount} programs`,
    },
    {
      title: "Newsletter Management",
      description: "Manage newsletter subscribers and contact lists",
      icon: <Mail className="h-8 w-8" />,
      href: "/admin/newsletter",
      color: "from-green-500 to-green-600",
      stats: `${subscriberCount} subscribers`,
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                <LayoutDashboard className="h-8 w-8 text-[#d4a373]" />
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your Love 21 Foundation website content and analytics
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-[#d4a373] hover:underline flex items-center gap-1"
            >
              Back to Site
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold">{eventCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Volunteer Programs
                    </p>
                    <p className="text-2xl font-bold">{programCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Newsletter Subscribers
                    </p>
                    <p className="text-2xl font-bold">{subscriberCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Page Views</p>
                    <p className="text-2xl font-bold">578</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {adminCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className={`rounded-xl bg-gradient-to-br ${card.color} p-3 text-white shadow-lg`}
                      >
                        {card.icon}
                      </div>
                      {card.stats && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {card.stats}
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-xl">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-[#d4a373] group-hover:underline">
                      Access
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 rounded-lg border border-dashed border-[#edebe7] bg-white/50 p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Quick Actions
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/events">+ New Event</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/volunteers">+ New Volunteer Program</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/newsletter">+ Add Subscriber</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
