"use client";

import { EmptyFeedState } from "@/components/feed/EmptyFeedState";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import { ResearchPaperCard } from "@/components/feed/ResearchPaperCard";
import type { FeedPaper } from "@/components/feed/types";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type FeedState = "loading" | "loaded" | "error";

export function ResearchFeed() {
  const [papers, setPapers]   = useState<FeedPaper[]>([]);
  const [state, setState]     = useState<FeedState>("loading");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setState("loading");
    else setRefreshing(true);

    try {
      const res  = await fetch("/api/papers");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setPapers(json.papers ?? []);
      setState("loaded");
    } catch {
      setState("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <section aria-label="Recent papers">
      {/* Section header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 tracking-tight">
            Recent Papers
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            {state === "loaded" && papers.length > 0
              ? `${papers.length} paper${papers.length !== 1 ? "s" : ""} analyzed`
              : "Your analyzed papers appear here"}
          </p>
        </div>

        {state === "loaded" && papers.length > 0 && (
          <button
            type="button"
            onClick={() => void load(true)}
            disabled={refreshing}
            aria-label="Refresh feed"
            className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-[11px] text-slate-500 ring-1 ring-white/[0.07] transition-all duration-200 hover:bg-white/[0.07] hover:text-slate-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        )}
      </div>

      {/* States */}
      {state === "loading" && <FeedSkeleton />}

      {state === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#0d1117] px-6 py-10 text-center ring-1 ring-white/[0.06]">
          <p className="text-sm text-slate-400">Could not load papers</p>
          <button
            type="button"
            onClick={() => void load()}
            className="text-xs text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
          >
            Try again
          </button>
        </div>
      )}

      {state === "loaded" && papers.length === 0 && <EmptyFeedState />}

      {state === "loaded" && papers.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 animate-fade-in">
          {papers.map((paper) => (
            <ResearchPaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </section>
  );
}
