"use client";

import { Card } from "@/components/ui/shared/Card";

export function KeyConcepts({ concepts }: { concepts: string[] }) {
  return (
    <Card className="bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-sm font-medium text-indigo-100">Key concepts</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(concepts ?? []).length ? (
          (concepts ?? []).map((c, i) => (
            <div
              key={`${c}-${i}`}
              className="rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-4 py-2 text-xs text-slate-100 ring-1 ring-white/10 hover:brightness-110 transition"
            >
              {c}
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-300">No concepts extracted.</div>
        )}
      </div>
    </Card>
  );
}

