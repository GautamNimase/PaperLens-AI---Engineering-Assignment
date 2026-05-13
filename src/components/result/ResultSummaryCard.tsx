"use client";

import { Badge } from "@/components/ui/shared/Badge";
import { Card } from "@/components/ui/shared/Card";
import { FileText, GraduationCap, Layers, Sparkles } from "lucide-react";

type Summary = {
  title: string;
  category: string;
  difficulty: string;
  oneLineSummary: string;
  problemSolved: string;
  methodUsed: string;
};

export function ResultSummaryCard({ summary }: { summary: Summary }) {
  return (
    <Card className="relative overflow-hidden bg-white/5 p-6 ring-1 ring-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_50%)]" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-1 ring-white/10">
              <FileText className="h-5 w-5 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold leading-tight">{summary?.title || "Untitled"}</h2>
              <div className="mt-2 text-xs text-slate-300">{summary?.oneLineSummary}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge icon={<Layers className="h-3.5 w-3.5" />} label={summary?.category || "Category"} />
            <Badge icon={<GraduationCap className="h-3.5 w-3.5" />} label={summary?.difficulty || "Difficulty"} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Problem solved
            </div>
            <div className="mt-2 text-sm text-slate-300">{summary?.problemSolved}</div>
          </div>
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Method used
            </div>
            <div className="mt-2 text-sm text-slate-300">{summary?.methodUsed}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

