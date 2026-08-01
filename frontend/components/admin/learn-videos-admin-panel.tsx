"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type LearnVideo, type LearnVideoInput } from "@/lib/api";

const emptyVideo: LearnVideoInput = {
  video_id: "",
  title: "",
  channel_title: "",
  published_at: new Date().toISOString().slice(0, 10),
  status: "draft",
};

export function LearnVideosAdminPanel() {
  const [videos, setVideos] = useState<LearnVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<LearnVideoInput>(emptyVideo);

  async function loadVideos() {
    setLoading(true);
    try {
      setVideos(await api.listAdminLearnVideos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load videos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVideos();
  }, []);

  async function createVideo() {
    setBusyId(-1);
    setError("");
    try {
      await api.createAdminLearnVideo(draft);
      setMessage("Video added.");
      setDraft(emptyVideo);
      setShowCreate(false);
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create video");
    } finally {
      setBusyId(null);
    }
  }

  async function updateVideo(id: number, payload: Partial<LearnVideoInput>) {
    setBusyId(id);
    setError("");
    try {
      await api.updateAdminLearnVideo(id, payload);
      setMessage("Video updated.");
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update video");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteVideo(id: number) {
    if (!window.confirm("Delete this video entry?")) return;
    setBusyId(id);
    try {
      await api.deleteAdminLearnVideo(id);
      setMessage("Video deleted.");
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete video");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-ink/65">Curate short YouTube clips for Learn → Short videos.</p>
        <Button type="button" size="sm" onClick={() => setShowCreate((v) => !v)}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {showCreate ? "Cancel" : "Add video"}
        </Button>
      </div>

      {showCreate ? (
        <Card className="border-brand-sea/30">
          <CardHeader>
            <CardTitle>New video</CardTitle>
            <CardDescription>Use the YouTube video ID from the URL (the part after v=).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label="Video ID" value={draft.video_id} onChange={(video_id) => setDraft((d) => ({ ...d, video_id }))} />
            <Field label="Published at" value={draft.published_at} onChange={(published_at) => setDraft((d) => ({ ...d, published_at }))} />
            <Field label="Title" value={draft.title} onChange={(title) => setDraft((d) => ({ ...d, title }))} className="sm:col-span-2" />
            <Field label="Channel" value={draft.channel_title} onChange={(channel_title) => setDraft((d) => ({ ...d, channel_title }))} className="sm:col-span-2" />
            <Button type="button" onClick={createVideo} disabled={busyId === -1} className="sm:col-span-2 sm:w-auto">
              Create draft
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading videos…</p>
      ) : videos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-sand p-8 text-center text-sm text-muted-foreground">
          No videos yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded-2xl border border-brand-sand bg-white">
              <img
                src={video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={video.status === "published" ? "success" : "secondary"}>{video.status}</Badge>
                </div>
                <h3 className="mt-2 font-semibold text-brand-ink">{video.title}</h3>
                <p className="text-sm text-brand-ink/60">{video.channel_title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {video.status === "draft" ? (
                    <Button type="button" size="sm" disabled={busyId === video.id} onClick={() => updateVideo(video.id, { status: "published" })}>
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Publish
                    </Button>
                  ) : (
                    <Button type="button" size="sm" variant="outline" disabled={busyId === video.id} onClick={() => updateVideo(video.id, { status: "draft" })}>
                      Unpublish
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="ghost" disabled={busyId === video.id} onClick={() => deleteVideo(video.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
    </div>
  );
}

function Alert({ children, tone }: { children: React.ReactNode; tone: "error" | "success" }) {
  return (
    <p
      className={
        tone === "error"
          ? "rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          : "rounded-xl border border-brand-sea/30 bg-brand-sea/10 p-3 text-sm text-brand-ink"
      }
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
