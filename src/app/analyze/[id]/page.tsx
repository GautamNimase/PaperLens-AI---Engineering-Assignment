"use client";

import { KeyConcepts } from "@/components/result/KeyConcepts";
import { LearningCards } from "@/components/result/LearningCards";
import { MathMadeSimple } from "@/components/result/MathMadeSimple";
import { MindMap, MindMapData } from "@/components/result/MindMap";
import { RelatedTopics } from "@/components/result/RelatedTopics";
import { ResultSummaryCard } from "@/components/result/ResultSummaryCard";
import DarkModeToggle from "@/components/shared/DarkModeToggle";
import { Card } from "@/components/ui/shared/Card";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const PdfPreview = dynamic(
  () =>
    import("@/components/result/PdfPreview").then(
      (mod) => mod.PdfPreview
    ),
  {
    ssr: false,
  }
);

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
    symbols: Array<{
      symbol: string;
      meaning: string;
    }>;
    steps: string[];
    simpleExplanation: string;
  };
  mindmap: MindMapData;

  learningCards: Array<{
    question: string;
    answer: string;
  }>;

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
    summary: {
      title: "",
      category: "",
      difficulty: "",
      oneLineSummary: "",
      problemSolved: "",
      methodUsed: "",
    },

    concepts: [],

    math: {
      equation: "",
      meaning: "",
      symbols: [],
      steps: [],
      simpleExplanation: "",
    },

    mindmap: {
      nodes: [],
      edges: [],
    },

    learningCards: [],

    relatedTopics: [],
  };
}

export default function AnalyzeResultPage() {
  const params = useParams<{ id: string }>();

  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<ApiPaperResponse | null>(null);

  const result = useMemo((): GeminiResult => {
    return data?.result ?? emptyResult();
  }, [data]);

  /**
   * Fetch paper result
   */
  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    setError(null);

    try {
      const res = await fetch(`/api/paper/${id}`);

      const json: ApiPaperResponse = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to load result");
      }

      setData(json);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load result"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Load on page mount / id change
   */
  useEffect(() => {
  let mounted = true;

  const fetchData = async () => {
    if (!mounted) return;

    try {
      await load();
    } catch (error) {
      console.error(error);
    }
  };

  void fetchData();

  return () => {
    mounted = false;
  };
}, [load]);

  const summary = result.summary;

  const concepts = result.concepts;

  const math = result.math;

  const mindmap = result.mindmap;

  const relatedTopics = result.relatedTopics;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Navbar */}
        <div className="mb-8 flex items-center justify-between">

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/10 transition"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3">

            <div className="hidden sm:block">
              <div className="text-sm font-medium">
                PaperLens AI
              </div>

              <div className="text-xs text-slate-400">
                Visual research understanding
              </div>
            </div>

            <DarkModeToggle />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">

            <Card className="p-6 bg-white/5 ring-1 ring-white/10">
              Loading result…
            </Card>

            <Card className="p-6 bg-white/5 ring-1 ring-white/10">
              Preparing sections A–G…
            </Card>

          </div>

        ) : error ? (

          /* Error State */
          <Card className="p-6 bg-red-500/10 ring-1 ring-red-500/20">

            <div className="text-sm font-medium">
              {error}
            </div>

            <div className="mt-4 flex gap-3">

              <button
                type="button"
                onClick={() => void load()}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/10 ring-1 ring-white/10 hover:brightness-105"
              >
                Retry
              </button>

            </div>
          </Card>

        ) : (

          /* Success State */
          <div className="space-y-6">

            <ResultSummaryCard summary={summary} />

            <KeyConcepts concepts={concepts} />

            <MathMadeSimple data={math} />

            <PdfPreview
              pdfUrl={data?.pdfUrl ?? null}
              sourceUrl={data?.sourceUrl ?? null}
            />

            {/* Mind Map */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-[1px]">

              <div className="rounded-2xl bg-slate-950/40">

                <div className="px-6 py-5">

                  <div className="text-sm font-medium text-indigo-100">
                    Mind map
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Memory-friendly node graph of concepts.
                  </div>

                </div>

                <div className="px-6 pb-6">
                  <MindMap data={mindmap} />
                </div>

              </div>
            </div>

            <LearningCards
              summary={summary}
              concepts={concepts}
            />

            <RelatedTopics relatedTopics={relatedTopics} />

            <div className="py-10">
              <div className="text-center text-xs text-slate-400">
                Generated by Gemini. Rendered from structured JSON.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}