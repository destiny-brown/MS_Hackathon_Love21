"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Users, Mail, Phone, User, FileText } from "lucide-react";

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

interface NewsletterSubscriber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
}

// Sample data
const defaultSubscribers: NewsletterSubscriber[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+852 9123 4567",
    subscribedAt: "2026-07-15T10:30:00Z",
    status: "active",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+852 9876 5432",
    subscribedAt: "2026-07-20T14:45:00Z",
    status: "active",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Wong",
    email: "michael.wong@example.com",
    phoneNumber: "+852 8765 4321",
    subscribedAt: "2026-07-25T09:15:00Z",
    status: "active",
  },
];

function loadSubscribers(): NewsletterSubscriber[] {
  if (typeof window === "undefined") return defaultSubscribers;
  const stored = localStorage.getItem("love21_newsletter");
  if (stored) {
    try {
      const parsed: unknown[] = JSON.parse(stored);
      // Type guard to ensure status is correctly typed
      return parsed.map((item: any) => ({
        id: item.id || Date.now().toString(),
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        email: item.email || "",
        phoneNumber: item.phoneNumber || "",
        subscribedAt: item.subscribedAt || new Date().toISOString(),
        status: item.status === "unsubscribed" ? "unsubscribed" : "active",
      })) as NewsletterSubscriber[];
    } catch {
      return defaultSubscribers;
    }
  }
  return defaultSubscribers;
}

function saveSubscribers(subscribers: NewsletterSubscriber[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("love21_newsletter", JSON.stringify(subscribers));
  }
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [editingSubscriber, setEditingSubscriber] =
    useState<NewsletterSubscriber | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSubscribers(loadSubscribers());
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let newSubscribers: NewsletterSubscriber[] = [...subscribers];

    if (editingSubscriber) {
      const index = newSubscribers.findIndex(
        (sub) => sub.id === editingSubscriber.id,
      );
      if (index !== -1) {
        newSubscribers[index] = {
          ...newSubscribers[index],
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        };
      }
      setEditingSubscriber(null);
    } else {
      const newSubscriber: NewsletterSubscriber = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        subscribedAt: new Date().toISOString(),
        status: "active",
      };
      newSubscribers = [newSubscriber, ...newSubscribers];
    }

    setSubscribers(newSubscribers);
    saveSubscribers(newSubscribers);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
    setEditingSubscriber(null);
  };

  const deleteSubscriber = (id: string) => {
    const newSubscribers = subscribers.filter((sub) => sub.id !== id);
    setSubscribers(newSubscribers);
    saveSubscribers(newSubscribers);
  };

  const toggleStatus = (id: string) => {
    const newSubscribers: NewsletterSubscriber[] = subscribers.map((sub) =>
      sub.id === id
        ? {
            ...sub,
            status: sub.status === "active" ? "unsubscribed" : "active",
          }
        : sub,
    );
    setSubscribers(newSubscribers);
    saveSubscribers(newSubscribers);
  };

  const editSubscriber = (subscriber: NewsletterSubscriber) => {
    setEditingSubscriber(subscriber);
    setFormData({
      firstName: subscriber.firstName,
      lastName: subscriber.lastName,
      email: subscriber.email,
      phoneNumber: subscriber.phoneNumber,
    });
  };

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phoneNumber.includes(searchTerm),
  );

  const activeCount = subscribers.filter(
    (sub) => sub.status === "active",
  ).length;
  const totalSubscribers = subscribers.length;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Newsletter Management
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage newsletter subscribers and their contact information
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
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Subscribers
                    </p>
                    <p className="text-2xl font-bold">{totalSubscribers}</p>
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
                      Active Subscribers
                    </p>
                    <p className="text-2xl font-bold">{activeCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Unsubscribed
                    </p>
                    <p className="text-2xl font-bold">
                      {totalSubscribers - activeCount}
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
                {editingSubscriber ? "Edit Subscriber" : "Add New Subscriber"}
              </CardTitle>
              <CardDescription>
                {editingSubscriber
                  ? "Update the subscriber's contact information"
                  : "Add a new subscriber to the newsletter list"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> First Name
                      </span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> Last Name
                      </span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email Address{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone Number
                      </span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="+852 9123 4567"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    {editingSubscriber ? "Update Subscriber" : "Add Subscriber"}
                  </Button>
                  {editingSubscriber && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Subscriber List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Subscribers List</h2>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-56 text-sm"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground w-[100px]">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                          First Name
                        </th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                          Last Name
                        </th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                          Phone
                        </th>
                        <th className="h-12 px-4 text-center font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-muted-foreground"
                          >
                            {searchTerm
                              ? "No subscribers match your search"
                              : "No subscribers yet. Add your first subscriber above."}
                          </td>
                        </tr>
                      ) : (
                        filteredSubscribers.map((subscriber) => (
                          <tr
                            key={subscriber.id}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="p-4">
                              <button
                                onClick={() => toggleStatus(subscriber.id)}
                                className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${
                                  subscriber.status === "active"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {subscriber.status === "active"
                                  ? "Active"
                                  : "Unsubscribed"}
                              </button>
                            </td>
                            <td className="p-4 font-medium">
                              {subscriber.firstName}
                            </td>
                            <td className="p-4">{subscriber.lastName}</td>
                            <td className="p-4">
                              <a
                                href={`mailto:${subscriber.email}`}
                                className="text-[#d4a373] hover:underline"
                              >
                                {subscriber.email}
                              </a>
                            </td>
                            <td className="p-4">{subscriber.phoneNumber}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editSubscriber(subscriber)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    deleteSubscriber(subscriber.id)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              Showing {filteredSubscribers.length} of {totalSubscribers}{" "}
              subscribers
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
