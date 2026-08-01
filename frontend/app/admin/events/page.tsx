"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Calendar, Users } from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  registrations: number;
  maxCapacity: number;
  category: "fundraising" | "community" | "sports" | "nutrition" | "family";
  status: "upcoming" | "ongoing" | "completed";
  createdAt: string;
}

// Sample data - stored in localStorage
const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Beyond Limits Banquet",
    description: "Signature fundraising event supporting community programmes.",
    date: "2026-10-15",
    location: "Grand Hyatt Hong Kong",
    registrations: 45,
    maxCapacity: 200,
    category: "fundraising",
    status: "upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Community Sports Day",
    description: "Annual sports day for members and families.",
    date: "2026-11-01",
    location: "Victoria Park",
    registrations: 78,
    maxCapacity: 100,
    category: "sports",
    status: "upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Nutrition Workshop Series",
    description: "Monthly nutrition workshops for families.",
    date: "2026-10-05",
    location: "San Po Kong Centre",
    registrations: 12,
    maxCapacity: 20,
    category: "nutrition",
    status: "ongoing",
    createdAt: new Date().toISOString(),
  },
];

function loadEvents(): Event[] {
  if (typeof window === "undefined") return defaultEvents;
  const stored = localStorage.getItem("love21_events");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultEvents;
    }
  }
  return defaultEvents;
}

function saveEvents(events: Event[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("love21_events", JSON.stringify(events));
  }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxCapacity: 0,
    category: "community" as Event["category"],
    status: "upcoming" as Event["status"],
  });

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newEvents = [...events];
    if (editingEvent) {
      const index = newEvents.findIndex((ev) => ev.id === editingEvent.id);
      if (index !== -1) {
        newEvents[index] = {
          ...newEvents[index],
          ...formData,
          registrations: newEvents[index].registrations,
        };
      }
      setEditingEvent(null);
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        registrations: 0,
        createdAt: new Date().toISOString(),
      };
      newEvents.unshift(newEvent);
    }
    setEvents(newEvents);
    saveEvents(newEvents);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      maxCapacity: 0,
      category: "community",
      status: "upcoming",
    });
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter((ev) => ev.id !== id);
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      maxCapacity: event.maxCapacity,
      category: event.category,
      status: event.status,
    });
  };

  const totalRegistrations = events.reduce(
    (sum, ev) => sum + ev.registrations,
    0,
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manage Events
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create, edit, and track event registrations
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-[#d4a373] hover:underline flex items-center gap-1"
            >
              ← Back to Admin
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
                    <p className="text-2xl font-bold">{events.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Registrations
                    </p>
                    <p className="text-2xl font-bold">{totalRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                    <span className="text-lg font-bold">↑</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-bold">
                      {events.filter((ev) => ev.status === "upcoming").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingEvent ? "Edit Event" : "Create New Event"}
              </CardTitle>
              <CardDescription>
                {editingEvent
                  ? "Update the event details below"
                  : "Add a new event to the website"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Max Capacity</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxCapacity: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as Event["category"],
                        })
                      }
                      className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm"
                    >
                      <option value="fundraising">Fundraising</option>
                      <option value="community">Community</option>
                      <option value="sports">Sports</option>
                      <option value="nutrition">Nutrition</option>
                      <option value="family">Family</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Event["status"],
                      })
                    }
                    className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    {editingEvent ? "Update Event" : "Create Event"}
                  </Button>
                  {editingEvent && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Event List */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">All Events</h2>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events yet. Create your first event above.
              </p>
            ) : (
              events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              event.status === "upcoming"
                                ? "bg-blue-100 text-blue-700"
                                : event.status === "ongoing"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editEvent(event)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>
                          📅 {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span>📍 {event.location}</span>
                        <span>
                          👥 {event.registrations}/{event.maxCapacity}{" "}
                          registered
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-[#d4a373]"
                          style={{
                            width: `${(event.registrations / event.maxCapacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
