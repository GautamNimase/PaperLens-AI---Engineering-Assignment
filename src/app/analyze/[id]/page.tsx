"use client";

import { KeyConcepts } from "@/components/result/KeyConcepts";
import { LearningCards } from "@/components/result/LearningCards";
import { MathMadeSimple } from "@/components/result/MathMadeSimple";
import { MindMap, MindMapData } from "@/components/result/MindMap";
import { RelatedTopics } from "@/components/result/RelatedTopics";
import { ResultSummaryCard } from "@/components/result/ResultSummaryCard";
import { Button } from "@/components/ui/shared/Button";
import { GlassCard } from "@/components/ui/shared/GlassCard";
import { ResultPageSkeleton } from "@/components/ui/shared/LoadingSkeleton";
import { AlertCircle, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const PdfPreview = dynamic(
  () => import("@/components/result/PdfPreview").then((m) => m.PdfPreview),
  { ssr: false }
);

/* ── Types ─────────────────────────────────────────────────────────── */
type PaperStatus = "processing" | "completed" | "failed";

type GeminiResult = {
  summary: {
    title: string;
    category: string;
    difficulty: string;
    oneLineSummary: string;
    problemSolved: string;
    methodUsed: string;
  };
  concepts: string[];
  math: {
    equation: string;
    meaning: string;
    symbols: Array<{ symbol: string; meaning: string }>;
    steps: string[];
    simpleExplanation: string;
  };
  mindmap: MindMapData;
  learningCards: Array<{ question: string; answer: string }>;
  relatedTopics: string[];
};

type ApiPaperResponse = {
  id: string;
  title: string;
  inputType: string;
  content: string | null;
  pdfUrl: string | null;
  sourceUrl: string | null;
  status: PaperStatus;
  error?: string | null;
  result?: GeminiResult;
  createdAt: string;
};

function emptyResult(): GeminiResult {
  return {
    summary: { title: "", category: "", difficulty: "", oneLineSummary: "", problemSolved: "", methodUsed: "" },
    concepts: [],
    math: { equation: "", meaning: "", symbols: [], steps: [], simpleExplanation: "" },
    mindmap: { nodes: [], edges: [] },
    learningCards: [],
    relatedTopics: [],
  };
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function AnalyzeResultPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id     = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<ApiPaperResponse | null>(null);

  const result = useMemo(() => data?.result ?? emptyResult(), [data]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/paper/${id}`);
      const json: ApiPaperResponse = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load result");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load result");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let mounted = true;
    const run = async () => { if (mounted) await load(); };
    void run();
    return () => { mounted = false; };
  }, [load]);

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100">

      {/* ── Sticky navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-200">
              PaperLens <span className="text-indigo-400">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {loading ? (
          <ResultPageSkeleton />
        ) : error ? (
          <GlassCard gradient className="p-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 ring-1 ring-red-500/20">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">Failed to load result</h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <Button
              className="mt-6"
              onClick={() => void load()}
              aria-label="Retry loading result"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </GlassCard>
        ) : (
          <div className="space-y-5">
            <ResultSummaryCard summary={result.summary} />
            <KeyConcepts concepts={result.concepts} />
            <MathMadeSimple data={result.math} />
            <PdfPreview
              pdfUrl={data?.pdfUrl ?? null}
              sourceUrl={data?.sourceUrl ?? null}
            />
            <MindMap data={result.mindmap} />
            <LearningCards summary={result.summary} concepts={result.concepts} />
            <RelatedTopics relatedTopics={result.relatedTopics} />

            <footer className="py-8 text-center text-xs text-slate-700">
              Generated by Llama 3.3 · 70B via Groq · Rendered from structured JSON
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
