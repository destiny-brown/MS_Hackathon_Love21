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
import { api } from "@/lib/api";

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
  const [captainChats, setCaptainChats] = useState(0);
  const [volunteerMatches, setVolunteerMatches] = useState(0);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminMetrics()
      .then((metrics) => {
        setEventCount(metrics.upcoming_events);
        setProgramCount(metrics.open_volunteer_roles);
        setSubscriberCount(metrics.newsletter_subscribers);
        setCaptainChats(metrics.captain_chats_30d);
        setVolunteerMatches(metrics.volunteer_matches_30d);
      })
      .catch((err) => {
        setMetricsError(err instanceof Error ? err.message : "Sign in as admin to view metrics.");
      });
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
              {metricsError && (
                <p className="mt-2 text-sm text-amber-700">{metricsError}</p>
              )}
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
                    <p className="text-sm text-muted-foreground">
                      Captain21 chats (30d)
                    </p>
                    <p className="text-2xl font-bold">{captainChats}</p>
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
