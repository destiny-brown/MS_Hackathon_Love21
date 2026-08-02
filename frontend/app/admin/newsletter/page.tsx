"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Users, User, Sparkles, Send, Copy, Eye, History } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewsletterPreview } from "@/components/newsletter-preview";
import {
  api,
  NewsletterCadence,
  NewsletterDelivery,
  NewsletterFrequency,
  NewsletterGenerateResponse,
  NewsletterSubscriber,
} from "@/lib/api";

function formatNewsletterContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/---/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*/g, "•")
    .replace(/  +/g, " ")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n\n")
    .trim();
}

export default function AdminNewsletterPage() {
  const { t } = useTranslation("admin");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [deliveries, setDeliveries] = useState<NewsletterDelivery[]>([]);
  const [editingSubscriber, setEditingSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    frequency: "monthly" as NewsletterFrequency,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [cadence, setCadence] = useState<NewsletterCadence>("monthly");
  const [guidance, setGuidance] = useState(
    "Highlight recent events, member stories, and community voices. Keep the tone warm and inclusive.",
  );
  const [generatedContent, setGeneratedContent] = useState("");
  const [subject, setSubject] = useState("Love 21 Foundation Newsletter");
  const [sourceSummary, setSourceSummary] = useState<NewsletterGenerateResponse["sources"] | null>(null);
  const [generationNotice, setGenerationNotice] = useState("");
  const [recipientGroups, setRecipientGroups] = useState<NewsletterFrequency[]>(["monthly"]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  async function loadData() {
    try {
      const [subscriberList, deliveryList] = await Promise.all([
        api.listNewsletterSubscribers(),
        api.listNewsletterDeliveries(),
      ]);
      setSubscribers(subscriberList);
      setDeliveries(deliveryList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load newsletter data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setRecipientGroups([cadence]);
  }, [cadence]);

  const activeSubscribers = useMemo(
    () => subscribers.filter((sub) => sub.status === "active"),
    [subscribers],
  );
  const weeklyActiveCount = activeSubscribers.filter((sub) => sub.frequency === "weekly").length;
  const monthlyActiveCount = activeSubscribers.filter((sub) => sub.frequency === "monthly").length;
  const selectedRecipientCount = activeSubscribers.filter((sub) =>
    recipientGroups.includes(sub.frequency),
  ).length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingSubscriber) {
        await api.updateNewsletterSubscriber(editingSubscriber.id, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber || null,
          frequency: formData.frequency,
        });
      } else {
        await api.createNewsletterSubscriber({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber || null,
          status: "active",
          frequency: formData.frequency,
        });
      }
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save subscriber");
    }
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "", frequency: "monthly" });
    setEditingSubscriber(null);
  };

  const deleteSubscriber = async (id: number) => {
    await api.deleteNewsletterSubscriber(id);
    await loadData();
  };

  const toggleStatus = async (subscriber: NewsletterSubscriber) => {
    await api.updateNewsletterSubscriber(subscriber.id, {
      status: subscriber.status === "active" ? "unsubscribed" : "active",
    });
    await loadData();
  };

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.phone_number ?? "").includes(searchTerm),
  );

  const toggleRecipientGroup = (group: NewsletterFrequency) => {
    setRecipientGroups((current) => {
      if (current.includes(group)) {
        return current.length === 1 ? current : current.filter((item) => item !== group);
      }
      return [...current, group];
    });
  };

  const generateNewsletter = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setGenerationNotice("");
    try {
      const result = await api.generateNewsletter({ cadence, guidance: guidance.trim() || null });
      setGeneratedContent(formatNewsletterContent(result.content));
      setSubject(result.subject);
      setSourceSummary(result.sources);
      setGenerationNotice(result.notice ?? "");
      setSuccess(result.enabled ? "Newsletter generated with Qwen." : "Template draft created from recent site content.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate newsletter");
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async () => {
    if (!generatedContent || !subject) {
      setError("Generate content and set a subject before sending.");
      return;
    }
    if (recipientGroups.length === 0) {
      setError("Select at least one recipient group.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const result = await api.sendNewsletter({
        subject,
        content: generatedContent,
        cadence,
        recipient_groups: recipientGroups,
      });
      setSuccess(result.message);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={t("newsletter.title")}
        description={t("newsletter.description")}
      />

      {error ? <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t("newsletter.total")}</p><p className="text-2xl font-bold">{subscribers.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t("newsletter.active")}</p><p className="text-2xl font-bold">{activeSubscribers.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t("newsletter.weekly")}</p><p className="text-2xl font-bold">{weeklyActiveCount}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t("newsletter.monthly")}</p><p className="text-2xl font-bold">{monthlyActiveCount}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">{t("newsletter.campaignsSent")}</p><p className="text-2xl font-bold">{deliveries.length}</p></CardContent></Card>
      </div>

      <Card className="mb-8 border-2 border-[#d4a373]/30">
        <CardHeader className="bg-[#d4a373]/5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#d4a373]" />
            <CardTitle>Qwen Newsletter Generator</CardTitle>
          </div>
          <CardDescription>
            Pulls recent admin events, volunteer programmes, approved gratitude messages, and member stories, then drafts a weekly or monthly email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="cadence">Newsletter cadence</Label>
              <select
                id="cadence"
                value={cadence}
                onChange={(e) => setCadence(e.target.value as NewsletterCadence)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly digest</option>
                <option value="monthly">Monthly digest</option>
              </select>
            </div>
            <div>
              <Label>Send to groups</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={recipientGroups.includes("weekly") ? "default" : "outline"}
                  onClick={() => toggleRecipientGroup("weekly")}
                >
                  Weekly ({weeklyActiveCount})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={recipientGroups.includes("monthly") ? "default" : "outline"}
                  onClick={() => toggleRecipientGroup("monthly")}
                >
                  Monthly ({monthlyActiveCount})
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="guidance">Editor guidance (optional)</Label>
            <textarea
              id="guidance"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              className="mt-1 min-h-[120px] w-full rounded-lg border p-3 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={generateNewsletter} disabled={loading} className="bg-[#d4a373] hover:bg-[#c08f5c]">
              {loading ? "Generating..." : `Generate ${cadence} newsletter`}
            </Button>
            {generatedContent ? (
              <>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </>
            ) : null}
          </div>

          {generationNotice ? (
            <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">{generationNotice}</p>
          ) : null}

          {sourceSummary ? (
            <div className="rounded-lg border bg-muted/20 p-4 text-sm">
              <p className="font-medium">Sources used</p>
              <p className="mt-1 text-muted-foreground">
                {sourceSummary.events.length} events · {sourceSummary.volunteer_programmes.length} programmes ·{" "}
                {sourceSummary.community_voices.length} community voices · {sourceSummary.member_stories.length} member stories
              </p>
            </div>
          ) : null}

          {generatedContent ? (
            <div className="space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="subject">Subject line</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
              </div>
              {showPreview ? <NewsletterPreview subject={subject} content={generatedContent} /> : null}
              <div className="max-h-[240px] overflow-auto whitespace-pre-wrap rounded-lg border bg-white p-4 text-sm">
                {generatedContent}
              </div>
              <Button
                onClick={sendNewsletter}
                disabled={sending || selectedRecipientCount === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="mr-2 h-4 w-4" />
                {sending
                  ? "Sending..."
                  : `Send to ${selectedRecipientCount} subscriber${selectedRecipientCount === 1 ? "" : "s"}`}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Delivery history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No campaigns sent yet.</p>
          ) : (
            <ul className="space-y-3">
              {deliveries.map((delivery) => (
                <li key={delivery.id} className="rounded-lg border p-4 text-sm">
                  <p className="font-semibold">{delivery.subject}</p>
                  <p className="text-muted-foreground">
                    {delivery.recipient_count} recipients
                    {delivery.cadence ? ` · ${delivery.cadence}` : ""}
                    {delivery.recipient_groups ? ` · groups: ${delivery.recipient_groups}` : ""}
                    {" · "}
                    {new Date(delivery.sent_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingSubscriber ? "Edit subscriber" : "Add subscriber"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                placeholder="Phone"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="subscriber-frequency">Frequency</Label>
              <select
                id="subscriber-frequency"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value as NewsletterFrequency })
                }
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              {editingSubscriber ? "Update" : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subscribers
          </CardTitle>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredSubscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {subscriber.first_name} {subscriber.last_name}
                </p>
                <p className="text-muted-foreground">{subscriber.email}</p>
                <p className="text-xs capitalize text-muted-foreground">{subscriber.frequency ?? "monthly"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleStatus(subscriber)}>
                  {subscriber.status}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingSubscriber(subscriber);
                    setFormData({
                      firstName: subscriber.first_name,
                      lastName: subscriber.last_name,
                      email: subscriber.email,
                      phoneNumber: subscriber.phone_number ?? "",
                      frequency: subscriber.frequency ?? "monthly",
                    });
                  }}
                >
                  <User className="h-3 w-3" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteSubscriber(subscriber.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
