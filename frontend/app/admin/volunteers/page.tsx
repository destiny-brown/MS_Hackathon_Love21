"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Heart, Users } from "lucide-react";

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
import { api, type AdminVolunteerProgram } from "@/lib/api";

interface VolunteerProgram {
  id: number;
  title: string;
  description: string;
  category: AdminVolunteerProgram["category"];
  when: string;
  where: string;
  filled: number;
  total: number;
  status: AdminVolunteerProgram["status"];
  createdAt: string;
}

function mapProgram(record: AdminVolunteerProgram): VolunteerProgram {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: record.category,
    when: record.schedule,
    where: record.location,
    filled: record.filled,
    total: record.total,
    status: record.status,
    createdAt: record.created_at,
  };
}

function toPayload(
  formData: {
    title: string;
    description: string;
    category: VolunteerProgram["category"];
    when: string;
    where: string;
    total: number;
    status: VolunteerProgram["status"];
  },
  filled = 0,
) {
  return {
    title: formData.title,
    description: formData.description,
    category: formData.category,
    schedule: formData.when,
    location: formData.where,
    filled,
    total: formData.total,
    status: formData.status,
  };
}

export default function AdminVolunteersPage() {
  const [programs, setPrograms] = useState<VolunteerProgram[]>([]);
  const [editingProgram, setEditingProgram] = useState<VolunteerProgram | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "sport" as VolunteerProgram["category"],
    when: "",
    where: "",
    total: 0,
    status: "open" as VolunteerProgram["status"],
  });

  useEffect(() => {
    api
      .listAdminVolunteerPrograms()
      .then((records) => setPrograms(records.map(mapProgram)))
      .catch(() => setPrograms([]));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        const updated = await api.updateAdminVolunteerProgram(
          editingProgram.id,
          toPayload(formData, editingProgram.filled),
        );
        setPrograms((prev) =>
          prev.map((pg) => (pg.id === editingProgram.id ? mapProgram(updated) : pg)),
        );
        setEditingProgram(null);
      } else {
        const created = await api.createAdminVolunteerProgram(toPayload(formData));
        setPrograms((prev) => [mapProgram(created), ...prev]);
      }
      resetForm();
    } catch {
      // Admin auth required
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "sport",
      when: "",
      where: "",
      total: 0,
      status: "open",
    });
    setEditingProgram(null);
  };

  const deleteProgram = async (id: number) => {
    try {
      await api.deleteAdminVolunteerProgram(id);
      setPrograms((prev) => prev.filter((pg) => pg.id !== id));
    } catch {
      // ignore
    }
  };

  const editProgram = (program: VolunteerProgram) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      category: program.category,
      when: program.when,
      where: program.where,
      total: program.total,
      status: program.status,
    });
  };

  const totalFilled = programs.reduce((sum, pg) => sum + pg.filled, 0);
  const totalSlots = programs.reduce((sum, pg) => sum + pg.total, 0);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manage Volunteer Programs
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create, edit, and track volunteer sign-ups
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
                  <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Programs
                    </p>
                    <p className="text-2xl font-bold">{programs.length}</p>
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
                      Total Volunteers
                    </p>
                    <p className="text-2xl font-bold">
                      {totalFilled}/{totalSlots}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                    <span className="text-lg font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Open Positions
                    </p>
                    <p className="text-2xl font-bold">
                      {programs.filter((pg) => pg.status === "open").length}
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
                {editingProgram
                  ? "Edit Program"
                  : "Create New Volunteer Program"}
              </CardTitle>
              <CardDescription>
                {editingProgram
                  ? "Update the program details below"
                  : "Add a new volunteer opportunity to the website"}
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
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target
                            .value as VolunteerProgram["category"],
                        })
                      }
                      className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm"
                    >
                      <option value="sport">Sport</option>
                      <option value="nutrition">Nutrition</option>
                      <option value="family">Family</option>
                      <option value="csr">CSR</option>
                    </select>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="when">When</Label>
                    <Input
                      id="when"
                      value={formData.when}
                      onChange={(e) =>
                        setFormData({ ...formData, when: e.target.value })
                      }
                      placeholder="e.g., Saturday mornings"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="where">Where</Label>
                    <Input
                      id="where"
                      value={formData.where}
                      onChange={(e) =>
                        setFormData({ ...formData, where: e.target.value })
                      }
                      placeholder="e.g., San Po Kong centre"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="total">Total Slots</Label>
                    <Input
                      id="total"
                      type="number"
                      value={formData.total}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as VolunteerProgram["status"],
                        })
                      }
                      className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="closing">Closing Soon</option>
                      <option value="filled">Filled</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    {editingProgram ? "Update Program" : "Create Program"}
                  </Button>
                  {editingProgram && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Program List */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">All Volunteer Programs</h2>
            {programs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No volunteer programs yet. Create your first program above.
              </p>
            ) : (
              programs.map((program) => {
                const pct = Math.round((program.filled / program.total) * 100);
                return (
                  <Card key={program.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{program.title}</h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                program.status === "open"
                                  ? "bg-green-100 text-green-700"
                                  : program.status === "closing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {program.status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editProgram(program)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteProgram(program.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>📅 {program.when}</span>
                          <span>📍 {program.where}</span>
                          <span>
                            👥 {program.filled}/{program.total} filled
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 80
                                ? "bg-red-500"
                                : pct >= 60
                                  ? "bg-yellow-500"
                                  : "bg-[#d4a373]"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
}
