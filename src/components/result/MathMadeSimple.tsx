"use client";

import { GlassCard } from "@/components/ui/shared/GlassCard";
import { SectionHeader } from "@/components/ui/shared/SectionHeader";
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
    <GlassCard className="p-6 animate-fade-up">
      <SectionHeader
        icon={<Sigma className="h-4 w-4" />}
        title="Math Made Simple"
        description="Key equations broken down into plain language."
      />

      {!hasEquation ? (
        <div className="rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-slate-500 ring-1 ring-white/[0.06]">
          No major mathematical equations found in this paper.
        </div>
      ) : (
        <div className="space-y-3">

          {/* Equation block */}
          <div className="rounded-xl bg-[#0d1117] p-4 ring-1 ring-white/[0.08]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
              Equation
            </p>
            <code className="font-mono text-base text-indigo-300 leading-relaxed">
              {data.equation}
            </code>
          </div>

          {/* Meaning */}
          <div className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
              Meaning
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{data.meaning}</p>
          </div>

          {/* Symbols table */}
          {data.symbols?.length ? (
            <div className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
                Symbol Reference
              </p>
              <div className="space-y-2">
                {data.symbols.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-white/[0.05]"
                  >
                    <code className="w-16 shrink-0 font-mono text-sm font-semibold text-indigo-300">
                      {s.symbol}
                    </code>
                    <span className="text-sm text-slate-400 leading-relaxed">{s.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Steps */}
          {data.steps?.length ? (
            <div className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
                Step-by-Step
              </p>
              <div className="space-y-2">
                {data.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-400 ring-1 ring-indigo-500/20 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">{st}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Simple explanation */}
          {data.simpleExplanation && (
            <div className="rounded-xl bg-indigo-500/8 p-4 ring-1 ring-indigo-500/15">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
                In Plain English
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">{data.simpleExplanation}</p>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
