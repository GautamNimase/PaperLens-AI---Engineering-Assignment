"use client";

import { GlassCard } from "@/components/ui/shared/GlassCard";
import { SectionHeader } from "@/components/ui/shared/SectionHeader";
import { Tag } from "lucide-react";

const PILL_COLORS = [
  "bg-indigo-500/15 text-indigo-300 ring-indigo-500/20 hover:bg-indigo-500/25",
  "bg-purple-500/15 text-purple-300 ring-purple-500/20 hover:bg-purple-500/25",
  "bg-sky-500/15 text-sky-300 ring-sky-500/20 hover:bg-sky-500/25",
  "bg-violet-500/15 text-violet-300 ring-violet-500/20 hover:bg-violet-500/25",
  "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/20 hover:bg-fuchsia-500/25",
] as const;

export function KeyConcepts({ concepts }: { concepts: string[] }) {
  const items = concepts ?? [];

  return (
    <GlassCard className="p-6 animate-fade-up">
      <SectionHeader
        icon={<Tag className="h-4 w-4" />}
        title="Key Concepts"
        description="Core ideas and terminology extracted from the paper."
      />

      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 transition-all duration-200 cursor-default select-none hover:scale-105 ${
                PILL_COLORS[i % PILL_COLORS.length]
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No concepts extracted.</p>
      )}
    </GlassCard>
  );
}
