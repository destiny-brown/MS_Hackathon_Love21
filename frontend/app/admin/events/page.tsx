"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Calendar, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, AdminActivity } from "@/lib/api";

type EventForm = {
  title: string;
  description: string;
  date: string;
  location: string;
  maxCapacity: number;
  category: string;
  status: string;
};

const defaultForm: EventForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  maxCapacity: 0,
  category: "community",
  status: "upcoming",
};

function toForm(activity: AdminActivity): EventForm {
  return {
    title: activity.title,
    description: activity.description,
    date: activity.starts_at.slice(0, 10),
    location: activity.location,
    maxCapacity: activity.max_capacity ?? 0,
    category: activity.category ?? "community",
    status: activity.status,
  };
}

function toPayload(form: EventForm) {
  const startsAt = new Date(`${form.date}T09:00:00`);
  return {
    title: form.title,
    description: form.description,
    starts_at: startsAt.toISOString(),
    ends_at: null,
    location: form.location,
    max_capacity: form.maxCapacity || null,
    category: form.category,
    status: form.status,
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminActivity[]>([]);
  const [editingEvent, setEditingEvent] = useState<AdminActivity | null>(null);
  const [formData, setFormData] = useState<EventForm>(defaultForm);
  const [error, setError] = useState("");

  async function loadEvents() {
    try {
      setEvents(await api.listAdminActivities());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load events");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingEvent) {
        await api.updateAdminActivity(editingEvent.id, toPayload(formData));
      } else {
        await api.createAdminActivity(toPayload(formData));
      }
      await loadEvents();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save event");
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingEvent(null);
  };

  const deleteEvent = async (id: number) => {
    setError("");
    try {
      await api.deleteAdminActivity(id);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete event");
    }
  };

  const editEvent = (event: AdminActivity) => {
    setEditingEvent(event);
    setFormData(toForm(event));
  };

  const totalRegistrations = events.reduce((sum, ev) => sum + ev.registration_count, 0);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create, edit, and track event registrations</p>
          </div>
          <Link href="/admin" className="text-sm text-[#d4a373] hover:underline flex items-center gap-1">
            ← Back to Admin
          </Link>
        </div>

        {error ? <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
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
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                  <p className="text-2xl font-bold">{totalRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">{events.filter((ev) => ev.status === "upcoming").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingEvent ? "Edit Event" : "Create New Event"}</CardTitle>
            <CardDescription>
              {editingEvent ? "Update the event details below" : "Add a new event to the website"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">Max Capacity</Label>
                  <Input id="maxCapacity" type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm">
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
                <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm">
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
                {editingEvent ? (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">All Events</h2>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet. Create your first event above.</p>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{event.status}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editEvent(event)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>📅 {new Date(event.starts_at).toLocaleDateString()}</span>
                      <span>📍 {event.location}</span>
                      <span>
                        👥 {event.registration_count}
                        {event.max_capacity ? `/${event.max_capacity}` : ""} registered
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
