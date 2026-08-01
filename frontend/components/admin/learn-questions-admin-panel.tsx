"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Sparkles, Trash2, Wand2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, type LearnQuestion } from "@/lib/api";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "draft" | "published";
type KindFilter = "all" | "quiz" | "daily";

function statusBadgeVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "draft") return "secondary" as const;
  return "outline" as const;
}

export function LearnQuestionsAdminPanel() {
  const [questions, setQuestions] = useState<LearnQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);

  const [topic, setTopic] = useState("Autism myths in the classroom");
  const [count, setCount] = useState(3);
  const [kind, setKind] = useState<"quiz" | "daily">("quiz");
  const [guidance, setGuidance] = useState("Keep language warm and factual. Suitable for Hong Kong families and teachers.");

  async function loadQuestions() {
    setLoading(true);
    setError("");
    try {
      const params =
        statusFilter === "all" && kindFilter === "all"
          ? undefined
          : {
              status: statusFilter === "all" ? undefined : statusFilter,
              kind: kindFilter === "all" ? undefined : kindFilter,
            };
      setQuestions(await api.listAdminLearnQuestions(params));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadQuestions();
  }, [statusFilter, kindFilter]);

  const filteredCount = useMemo(() => questions.length, [questions]);

  async function generateDrafts() {
    setGenerating(true);
    setError("");
    setMessage("");
    try {
      const result = await api.generateAdminLearnQuestions({ topic, count, kind, guidance: guidance || null });
      if (!result.enabled) {
        setError(result.message || "AI generation is not enabled. Check MODEL_* settings on the backend.");
        return;
      }
      setMessage(result.message || `Generated ${result.questions.length} draft question(s).`);
      setStatusFilter("draft");
      await loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate questions");
    } finally {
      setGenerating(false);
    }
  }

  async function updateQuestion(id: number, payload: Partial<LearnQuestion>) {
    setBusyId(id);
    setError("");
    try {
      await api.updateAdminLearnQuestion(id, payload);
      setMessage("Question updated.");
      await loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update question");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteQuestion(id: number) {
    if (!window.confirm("Delete this question permanently?")) return;
    setBusyId(id);
    setError("");
    try {
      await api.deleteAdminLearnQuestion(id);
      setMessage("Question deleted.");
      await loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete question");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-brand-coral/20 bg-gradient-to-br from-brand-coral/5 via-white to-brand-sea/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-brand-coral p-2.5 text-white shadow-sm">
              <Wand2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="flex items-center gap-2">
                Draft with Qwen
                <Badge variant="secondary">AI assist</Badge>
              </CardTitle>
              <CardDescription>
                Generate myth-vs-fact or daily myth drafts using your configured Qwen model. Staff review and publish before
                anything goes live.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label htmlFor="learn-topic">Topic</Label>
              <Input id="learn-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="learn-count">Count</Label>
                <Input
                  id="learn-count"
                  type="number"
                  min={1}
                  max={8}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 1)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="learn-kind">Kind</Label>
                <select
                  id="learn-kind"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as "quiz" | "daily")}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="quiz">Quiz</option>
                  <option value="daily">Daily myth</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="learn-guidance">Extra guidance (optional)</Label>
              <Textarea
                id="learn-guidance"
                value={guidance}
                onChange={(e) => setGuidance(e.target.value)}
                rows={4}
                className="mt-1.5"
              />
            </div>
            <Button type="button" onClick={generateDrafts} disabled={generating || !topic.trim()} className="w-full sm:w-auto">
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Generate drafts
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "draft", "published"] as StatusFilter[]).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={statusFilter === value ? "default" : "outline"}
              onClick={() => setStatusFilter(value)}
            >
              {value === "all" ? "All statuses" : value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "quiz", "daily"] as KindFilter[]).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={kindFilter === value ? "default" : "outline"}
              onClick={() => setKindFilter(value)}
            >
              {value === "all" ? "All kinds" : value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-brand-sea/30 bg-brand-sea/10 p-3 text-sm text-brand-ink" role="status">
          {message}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground" role="status">
          Loading questions…
        </p>
      ) : filteredCount === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-sand p-8 text-center text-sm text-muted-foreground" role="status">
          No questions match these filters yet. Generate a draft batch or seed content on first deploy.
        </p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionEditorCard
              key={question.id}
              question={question}
              busy={busyId === question.id}
              onSave={(payload) => updateQuestion(question.id, payload)}
              onPublish={() => updateQuestion(question.id, { status: "published" })}
              onUnpublish={() => updateQuestion(question.id, { status: "draft" })}
              onDelete={() => deleteQuestion(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type QuestionEditorCardProps = {
  question: LearnQuestion;
  busy: boolean;
  onSave: (payload: Partial<LearnQuestion>) => Promise<void>;
  onPublish: () => Promise<void>;
  onUnpublish: () => Promise<void>;
  onDelete: () => Promise<void>;
};

function QuestionEditorCard({ question, busy, onSave, onPublish, onUnpublish, onDelete }: QuestionEditorCardProps) {
  const [statement, setStatement] = useState(question.statement);
  const [answer, setAnswer] = useState(question.answer);
  const [explanation, setExplanation] = useState(question.explanation);
  const [topic, setTopic] = useState(question.topic || "");
  const [hint, setHint] = useState(question.hint || "");

  useEffect(() => {
    setStatement(question.statement);
    setAnswer(question.answer);
    setExplanation(question.explanation);
    setTopic(question.topic || "");
    setHint(question.hint || "");
  }, [question]);

  const dirty =
    statement !== question.statement ||
    answer !== question.answer ||
    explanation !== question.explanation ||
    topic !== (question.topic || "") ||
    hint !== (question.hint || "");

  return (
    <article className={cn("rounded-2xl border bg-white p-5 shadow-sm", question.status === "draft" ? "border-amber-200/80" : "border-brand-sand")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusBadgeVariant(question.status)}>{question.status}</Badge>
          <Badge variant="outline">{question.kind}</Badge>
          {question.topic ? <span className="text-xs text-brand-ink/55">{question.topic}</span> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {question.status === "draft" ? (
            <Button type="button" size="sm" onClick={onPublish} disabled={busy}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Publish
            </Button>
          ) : (
            <Button type="button" size="sm" variant="outline" onClick={onUnpublish} disabled={busy}>
              Unpublish
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={onDelete} disabled={busy} className="text-destructive">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <Label htmlFor={`statement-${question.id}`}>Statement</Label>
          <Textarea id={`statement-${question.id}`} value={statement} onChange={(e) => setStatement(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`answer-${question.id}`}>Answer</Label>
            <select
              id={`answer-${question.id}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="myth">Myth</option>
              <option value="fact">Fact</option>
            </select>
          </div>
          <div>
            <Label htmlFor={`topic-${question.id}`}>Topic</Label>
            <Input id={`topic-${question.id}`} value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        {question.kind === "daily" ? (
          <div>
            <Label htmlFor={`hint-${question.id}`}>Hint</Label>
            <Input id={`hint-${question.id}`} value={hint} onChange={(e) => setHint(e.target.value)} className="mt-1.5" />
          </div>
        ) : null}
        <div>
          <Label htmlFor={`explanation-${question.id}`}>Explanation</Label>
          <Textarea id={`explanation-${question.id}`} value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3} className="mt-1.5" />
        </div>
      </div>

      {dirty ? (
        <div className="mt-4">
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={() =>
              onSave({
                statement,
                answer,
                explanation,
                topic: topic || null,
                hint: hint || null,
              })
            }
          >
            Save changes
          </Button>
        </div>
      ) : null}
    </article>
  );
}
