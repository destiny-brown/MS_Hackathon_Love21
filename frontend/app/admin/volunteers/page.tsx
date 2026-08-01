"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2, Edit, Heart, Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, AdminVolunteerActivity } from "@/lib/api";

type ProgramForm = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  when: string;
  where: string;
  filled: number;
  total: number;
  status: string;
};

const defaultForm: ProgramForm = {
  slug: "",
  icon: "🤝",
  title: "",
  description: "",
  category: "sport",
  when: "",
  where: "",
  filled: 0,
  total: 0,
  status: "active",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toForm(program: AdminVolunteerActivity): ProgramForm {
  return {
    slug: program.slug,
    icon: program.icon,
    title: program.title,
    description: program.description,
    category: program.category,
    when: program.schedule_label,
    where: program.location_label,
    filled: program.filled_count ?? 0,
    total: program.total_spots ?? 0,
    status: program.status,
  };
}

function toPayload(form: ProgramForm, displayOrder: number) {
  return {
    slug: form.slug || slugify(form.title),
    icon: form.icon,
    title: form.title,
    description: form.description,
    schedule_label: form.when,
    location_label: form.where,
    category: form.category,
    filled_count: form.filled || null,
    total_spots: form.total || null,
    note: null,
    cta_label: "I'm interested",
    status: form.status,
    display_order: displayOrder,
  };
}

export default function AdminVolunteersPage() {
  const [programs, setPrograms] = useState<AdminVolunteerActivity[]>([]);
  const [editingProgram, setEditingProgram] = useState<AdminVolunteerActivity | null>(null);
  const [formData, setFormData] = useState<ProgramForm>(defaultForm);
  const [error, setError] = useState("");

  async function loadPrograms() {
    try {
      setPrograms(await api.listAdminVolunteerActivities());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load programs");
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingProgram) {
        await api.updateAdminVolunteerActivity(editingProgram.id, toPayload(formData, editingProgram.display_order));
      } else {
        await api.createAdminVolunteerActivity(toPayload(formData, programs.length));
      }
      await loadPrograms();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save program");
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingProgram(null);
  };

  const deleteProgram = async (id: number) => {
    setError("");
    try {
      await api.deleteAdminVolunteerActivity(id);
      await loadPrograms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete program");
    }
  };

  const editProgram = (program: AdminVolunteerActivity) => {
    setEditingProgram(program);
    setFormData(toForm(program));
  };

  const totalFilled = programs.reduce((sum, pg) => sum + (pg.filled_count ?? 0), 0);
  const totalSlots = programs.reduce((sum, pg) => sum + (pg.total_spots ?? 0), 0);

  return (
    <>
      <AdminPageHeader
        title="Volunteer programmes"
        description="Create, edit, and track volunteer opportunities shown on the public site."
      />

      {error ? <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Programs</p>
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
                  <p className="text-sm text-muted-foreground">Total Volunteers</p>
                  <p className="text-2xl font-bold">{totalFilled}/{totalSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Active Programs</p>
                <p className="text-2xl font-bold">{programs.filter((pg) => pg.status === "active").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProgram ? "Edit Program" : "Create New Volunteer Program"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm">
                    <option value="sport">Sport</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="family">Family</option>
                    <option value="csr">CSR</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="when">Schedule</Label>
                  <Input id="when" value={formData.when} onChange={(e) => setFormData({ ...formData, when: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="where">Location</Label>
                  <Input id="where" value={formData.where} onChange={(e) => setFormData({ ...formData, where: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="filled">Filled spots</Label>
                  <Input id="filled" type="number" value={formData.filled} onChange={(e) => setFormData({ ...formData, filled: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total spots</Label>
                  <Input id="total" type="number" value={formData.total} onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border border-[#edebe7] px-3 py-2 text-sm">
                    <option value="active">Active</option>
                    <option value="closing">Closing</option>
                    <option value="filled">Filled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  {editingProgram ? "Update Program" : "Create Program"}
                </Button>
                {editingProgram ? (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">All Programs</h2>
          {programs.map((program) => (
            <Card key={program.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{program.icon} {program.title}</h3>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {program.schedule_label} · {program.location_label} · {program.filled_count ?? 0}/{program.total_spots ?? "∞"} filled
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => editProgram(program)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteProgram(program.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </>
  );
}
