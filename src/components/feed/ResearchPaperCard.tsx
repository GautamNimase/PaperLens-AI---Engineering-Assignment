"use client";

import type { FeedPaper } from "@/components/feed/types";
import { ArrowUpRight, BookOpen, Calendar, FileText, Globe, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useMemo } from "react";

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function difficultyColor(d?: string): string {
  if (!d) return "text-slate-500 bg-slate-500/10 ring-slate-500/15";
  const l = d.toLowerCase();
  if (l.includes("beginner") || l.includes("easy"))
    return "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20";
  if (l.includes("advanced") || l.includes("expert"))
    return "text-red-400 bg-red-500/10 ring-red-500/20";
  return "text-amber-400 bg-amber-500/10 ring-amber-500/20";
}

function inputTypeIcon(t: string) {
  if (t === "pdf") return <FileText className="h-3 w-3" />;
  if (t === "url") return <Globe className="h-3 w-3" />;
  return <BookOpen className="h-3 w-3" />;
}

/* ── Thumbnail placeholder ───────────────────────────────────────── */
function PaperThumbnail({ title, inputType }: { title: string; inputType: string }) {
  // Deterministic color from title length — gives each card a unique accent
  const hues = [220, 250, 270, 200, 240] as const;
  const hue  = hues[title.length % hues.length];

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl"
      style={{ background: `hsl(${hue} 40% 8%)` }}
    >
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(hsl(${hue} 60% 40% / 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(${hue} 60% 40% / 0.15) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />
      {/* Center icon */}
      <div
        className="relative flex h-10 w-10 items-center justify-center rounded-xl ring-1"
        style={{
          background: `hsl(${hue} 60% 20% / 0.6)`,
          ringColor: `hsl(${hue} 60% 40% / 0.3)`,
        }}
      >
        <FileText className="h-5 w-5" style={{ color: `hsl(${hue} 70% 65%)` }} />
      </div>
      {/* Input type badge */}
      <span
        className="absolute bottom-2 right-2 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
        style={{
          background: `hsl(${hue} 60% 20% / 0.8)`,
          color: `hsl(${hue} 70% 65%)`,
        }}
      >
        {inputType}
      </span>
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────────────── */
export const ResearchPaperCard = memo(function ResearchPaperCard({
  paper,
}: {
  paper: FeedPaper;
}) {
  const router  = useRouter();
  const summary = paper.result?.summary;
  const concepts = (paper.result?.concepts ?? []).slice(0, 4);

  const category   = summary?.category   ?? paper.inputType;
  const difficulty = summary?.difficulty ?? "";
  const oneLiner   = summary?.oneLineSummary ?? "";

  const diffClass = useMemo(() => difficultyColor(difficulty), [difficulty]);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open analysis for ${paper.title}`}
      onClick={() => router.push(`/analyze/${paper.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(`/analyze/${paper.id}`);
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-[#0d1117] ring-1 ring-white/[0.07] transition-all duration-200 ease-out hover:ring-white/[0.14] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
    >
      {/* Top section: text left, thumbnail right */}
      <div className="flex gap-4 p-5">

        {/* Left — metadata */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {category && (
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 ring-1 ring-indigo-500/20">
                <Tag className="h-2.5 w-2.5" />
                {category}
              </span>
            )}
            {difficulty && (
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${diffClass}`}>
                {difficulty}
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-slate-600">
              {inputTypeIcon(paper.inputType)}
              {paper.inputType.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold leading-snug text-slate-100 group-hover:text-white transition-colors duration-150 line-clamp-2">
            {paper.title}
          </h3>

          {/* One-liner */}
          {oneLiner && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {oneLiner}
            </p>
          )}

          {/* Date */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Calendar className="h-3 w-3" />
            {formatDate(paper.createdAt)}
          </div>
        </div>

        {/* Right — thumbnail */}
        <div className="h-[100px] w-[76px] shrink-0 overflow-hidden rounded-xl ring-1 ring-white/[0.07]">
          <PaperThumbnail title={paper.title} inputType={paper.inputType} />
        </div>
      </div>

      {/* Divider */}
      {concepts.length > 0 && (
        <div className="mx-5 h-px bg-white/[0.05]" />
      )}

      {/* Bottom — concept tags + arrow */}
      {concepts.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {concepts.map((c, i) => (
              <span
                key={i}
                className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-slate-500 ring-1 ring-white/[0.06]"
              >
                {c}
              </span>
            ))}
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-700 transition-all duration-200 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}

      {/* Hover glow edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), rgba(99,102,241,0.04), transparent 60%)",
        }}
      />
    </article>
  );
});
