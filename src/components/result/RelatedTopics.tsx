"use client";

import { GlassCard } from "@/components/ui/shared/GlassCard";
import { SectionHeader } from "@/components/ui/shared/SectionHeader";
import { ArrowUpRight, Compass } from "lucide-react";

function buildSearchUrl(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(q + " research paper")}`;
}

export function RelatedTopics({ relatedTopics }: { relatedTopics: string[] }) {
  const topics = relatedTopics ?? [];

  return (
    <GlassCard className="p-6 animate-fade-up">
      <SectionHeader
        icon={<Compass className="h-4 w-4" />}
        title="Related Topics"
        description="Explore connected research areas and concepts."
      />

      {topics.length ? (
        <div className="flex flex-wrap gap-2">
          {topics.map((t, i) => (
            <a
              key={`${t}-${i}`}
              href={buildSearchUrl(t)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/[0.08] transition-all duration-200 hover:bg-indigo-500/15 hover:text-indigo-300 hover:ring-indigo-500/25 hover:scale-105"
            >
              {t}
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No related topics found.</p>
      )}
    </GlassCard>
  );
}
