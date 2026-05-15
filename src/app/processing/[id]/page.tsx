"use client";

import { Button } from "@/components/ui/shared/Button";
import { GlassCard } from "@/components/ui/shared/GlassCard";
import { AlertCircle, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Status = "processing" | "completed" | "failed";

const STEPS = [
  "Parsing paper content",
  "Extracting key concepts",
  "Building mind map",
  "Generating learning cards",
  "Finalizing analysis",
] as const;

export default function ProcessingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id     = params.id;

  const [status, setStatus]   = useState<Status>("processing");
  const [error, setError]     = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Step ticker (visual only) ─────────────────────────────────── */
  useEffect(() => {
    stepRef.current = setInterval(() => {
      setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 4000);
    return () => { if (stepRef.current) clearInterval(stepRef.current); };
  }, []);

  /* ── Polling ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!id) return;

    const stopPolling = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const checkStatus = async () => {
      try {
        const res  = await fetch(`/api/status/${id}`);
        const data: { status: Status; error?: string } = await res.json();

        if (!res.ok) {
          stopPolling();
          setStatus("failed");
          setError(data?.error ?? "Failed to fetch status");
          return;
        }

        setStatus(data.status);

        if (data.status === "completed") {
          stopPolling();
          if (stepRef.current) clearInterval(stepRef.current);
          router.push(`/analyze/${id}`);
          return;
        }

        if (data.status === "failed") {
          stopPolling();
          if (stepRef.current) clearInterval(stepRef.current);
          setError(data.error ?? "Analysis failed");
          return;
        }
      } catch (e) {
        stopPolling();
        setStatus("failed");
        setError(e instanceof Error ? e.message : "Failed to check status");
      }
    };

    void checkStatus();
    intervalRef.current = setInterval(() => void checkStatus(), 2000);
    return () => stopPolling();
  }, [id, router]);

  const isFailed = status === "failed";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080b14] text-slate-100">

      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-indigo-600/8 blur-[100px] animate-pulse-glow" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#080b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
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

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-lg px-6 py-20">
        <div className="text-center animate-fade-up">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10">
            {isFailed ? (
              <AlertCircle className="h-7 w-7 text-red-400" />
            ) : (
              <Sparkles className="h-7 w-7 text-indigo-300 animate-pulse" />
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isFailed ? "Analysis Failed" : "Analyzing Paper"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isFailed
              ? "Something went wrong during processing."
              : "AI is reading and structuring your paper…"}
          </p>
        </div>

        {/* Card */}
        <GlassCard gradient className="mt-8 p-6 animate-fade-up" style={{ animationDelay: "80ms" }}>

          {/* Error state */}
          {isFailed && error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl bg-red-500/10 p-4 ring-1 ring-red-500/20"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Processing steps */}
          {!isFailed && (
            <div className="space-y-3 mb-5">
              {STEPS.map((step, i) => {
                const done    = i < stepIdx;
                const current = i === stepIdx;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                      current
                        ? "bg-indigo-500/10 ring-1 ring-indigo-500/20"
                        : done
                        ? "opacity-40"
                        : "opacity-20"
                    }`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      done    ? "bg-emerald-500/20 ring-1 ring-emerald-500/30"
                      : current ? "bg-indigo-500/20 ring-1 ring-indigo-500/30"
                      : "bg-white/5 ring-1 ring-white/10"
                    }`}>
                      {done ? (
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                      ) : current ? (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${current ? "text-slate-200" : "text-slate-500"}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progress bar */}
          {!isFailed && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                style={{ width: `${((stepIdx + 1) / STEPS.length) * 85}%` }}
              />
            </div>
          )}

          {/* Retry button */}
          {isFailed && (
            <Button
              className="w-full"
              onClick={() => router.push("/")}
              aria-label="Try another paper"
            >
              <ArrowLeft className="h-4 w-4" />
              Try Another Paper
            </Button>
          )}

          {!isFailed && (
            <p className="mt-4 text-center text-[11px] text-slate-700">
              Polling every 2 s · Results ready in ~15 seconds
            </p>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
