"use client";

import { Card } from "@/components/ui/shared/Card";
import { Sigma } from "lucide-react";

export type MathData = {
  equation: string;
  meaning: string;
  symbols: Array<{ symbol: string; meaning: string }>;
  steps: string[];
  simpleExplanation: string;
};

export function MathMadeSimple({ data }: { data: MathData }) {
  const hasEquation = !!data?.equation?.trim();

  return (
    <Card className="bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
        <Sigma className="h-4 w-4 text-indigo-200" />
        Math made simple
      </div>

      <div className="mt-4">
        {!hasEquation ? (
          <div className="rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10 text-sm text-slate-300">
            No major mathematical equation found in this paper.
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
              <div className="text-xs text-slate-400">Equation</div>
              <div className="mt-2 font-mono text-sm text-slate-100">{data.equation}</div>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
              <div className="text-xs text-slate-400">Meaning</div>
              <div className="mt-2 text-sm text-slate-200">{data.meaning}</div>
            </div>

            {data.symbols?.length ? (
              <div className="rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">Symbols</div>
                <div className="mt-2 grid gap-2">
                  {data.symbols.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                      <div className="font-mono text-sm text-indigo-100">{s.symbol}</div>
                      <div className="text-sm text-slate-300">{s.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {data.steps?.length ? (
              <div className="rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">Step-by-step breakdown</div>
                <div className="mt-2 grid gap-2">
                  {data.steps.map((st, i) => (
                    <div key={i} className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10 text-sm text-slate-300">
                      <span className="font-medium text-indigo-100">Step {i + 1}:</span> {st}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
              <div className="text-xs text-slate-400">Simple explanation</div>
              <div className="mt-2 text-sm text-slate-200">{data.simpleExplanation}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

