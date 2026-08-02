"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, HelpCircle, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

const learnWorkspaces = [
  {
    href: "/admin/learn/questions",
    label: "Questions",
    description: "Quiz and daily myth content — draft with Qwen, review, then publish.",
    icon: HelpCircle,
  },
  {
    href: "/admin/learn/resources",
    label: "Resources",
    description: "Articles, press links, and learning materials for teachers and parents.",
    icon: FileText,
  },
  {
    href: "/admin/learn/videos",
    label: "Short videos",
    description: "Curated YouTube clips shown on the Learn short videos page.",
    icon: Video,
  },
];

export default function AdminLearnHubPage() {
  const { t } = useTranslation("admin");
  const [counts, setCounts] = useState({ questions: 0, resources: 0, videos: 0 });

  useEffect(() => {
    api
      .adminOverview()
      .then((overview) =>
        setCounts({
          questions: overview.learn_question_count ?? 0,
          resources: overview.learn_resource_count ?? 0,
          videos: overview.learn_video_count ?? 0,
        }),
      )
      .catch(() => setCounts({ questions: 0, resources: 0, videos: 0 }));
  }, []);

  return (
    <>
      <AdminPageHeader
        title={t("learn.hubTitle")}
        description={t("learn.hubDescription")}
        actions={
          <Link
            href="/learn-play"
            className="inline-flex items-center rounded-md border border-brand-sand bg-white px-3 py-2 text-sm font-medium text-brand-ink hover:border-brand-coral/40"
          >
            <BookOpen className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t("learn.previewLearn")}
          </Link>
        }
      />

      <section aria-label="Learn content counts" className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/50">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Questions</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{counts.questions}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/50">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Resources</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{counts.resources}</p>
          </CardContent>
        </Card>
        <Card className="border-brand-sand bg-gradient-to-br from-white to-brand-cream/50">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/50">Videos</p>
            <p className="mt-2 text-3xl font-semibold text-brand-ink">{counts.videos}</p>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Learn workspaces">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-ink/55">Workspaces</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {learnWorkspaces.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-brand-sand bg-white p-5 shadow-sm transition hover:border-brand-coral/40 hover:shadow-md"
              >
                <span className="inline-flex rounded-xl bg-brand-coral/10 p-3 text-brand-coral">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-brand-ink">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-brand-ink/65">{item.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-coral">
                  Open workspace
                  <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
