"use client";

import { Card } from "@/components/ui/shared/Card";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Status = "processing" | "completed" | "failed";

export default function ProcessingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;
  const [status, setStatus] = useState<Status>("processing");
  const [error, setError] = useState<string | null>(null);

  // Ref so checkStatus closure always has access to the latest interval id
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        const res = await fetch(`/api/status/${id}`);
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
          router.push(`/analyze/${id}`);
          return;
        }

        if (data.status === "failed") {
          stopPolling();
          setError(data.error ?? "Analysis failed");
          return;
        }
      } catch (e) {
        stopPolling();
        setStatus("failed");
        setError(e instanceof Error ? e.message : "Failed to check status");
      }
    };

    // Run immediately, then every 2 seconds
    void checkStatus();
    intervalRef.current = setInterval(() => void checkStatus(), 2000);

    // Cleanup on unmount or id/router change
    return () => stopPolling();
  }, [id, router]);

  const handleRetry = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">
          {status === "failed" ? "Analysis failed" : "Analyzing paper…"}
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          {status === "failed"
            ? "Something went wrong during processing."
            : "Generating summary, mind map, and learning cards."}
        </p>

        <div className="mt-6">
          <Card className="p-6 bg-white/5 ring-1 ring-white/10 rounded-2xl">
            <div className="text-sm text-slate-200">
              Status:{" "}
              <span
                className={
                  status === "failed"
                    ? "text-red-400"
                    : status === "completed"
                    ? "text-green-400"
                    : "text-indigo-300"
                }
              >
                {status}
              </span>
            </div>

            {error ? (
              <div className="mt-3 rounded-lg bg-red-500/15 p-3 text-sm text-red-200 ring-1 ring-red-500/30">
                {error}
              </div>
            ) : null}

            {status === "failed" ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/10 ring-1 ring-white/10 hover:brightness-105 transition"
                >
                  ← Try another paper
                </button>
              </div>
            ) : (
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              </div>
            )}

            <div className="mt-4 text-xs text-slate-400">
              Note: This is a simple polling approach (no queues).
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
