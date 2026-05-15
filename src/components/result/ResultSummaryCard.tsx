"use client";

import { Badge } from "@/components/ui/shared/Badge";
import { GlassCard } from "@/components/ui/shared/GlassCard";
import { BookOpen, GraduationCap, Layers, Lightbulb, Sparkles } from "lucide-react";

type Summary = {
  title: string;
  category: string;
  difficulty: string;
  oneLineSummary: string;
  problemSolved: string;
  methodUsed: string;
};

const difficultyVariant = (d: string) => {
  const lower = d.toLowerCase();
  if (lower.includes("beginner") || lower.includes("easy"))   return "green"  as const;
  if (lower.includes("advanced") || lower.includes("expert")) return "red"    as const;
  return "amber" as const;
};

export function ResultSummaryCard({ summary }: { summary: Summary }) {
  return (
    <GlassCard gradient className="p-6 md:p-8 animate-fade-up">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.12),transparent_60%)]"
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-1 ring-white/10">
              <BookOpen className="h-5 w-5 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                {summary?.title || "Untitled Paper"}
              </h2>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                {summary?.oneLineSummary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {summary?.category && (
              <Badge
                label={summary.category}
                icon={<Layers className="h-3 w-3" />}
                variant="indigo"
              />
            )}
            {summary?.difficulty && (
              <Badge
                label={summary.difficulty}
                icon={<GraduationCap className="h-3 w-3" />}
                variant={difficultyVariant(summary.difficulty)}
              />
            )}
          </div>
        </div>

        {/* Detail cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.07] hover:bg-white/[0.06] transition-colors duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Problem Solved
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {summary?.problemSolved || "—"}
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.07] hover:bg-white/[0.06] transition-colors duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-2">
              <Lightbulb className="h-3.5 w-3.5" />
              Method Used
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {summary?.methodUsed || "—"}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
