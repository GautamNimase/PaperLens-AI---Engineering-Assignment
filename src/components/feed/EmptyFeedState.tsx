import { BookOpen, Sparkles } from "lucide-react";

export function EmptyFeedState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#0d1117] px-8 py-14 text-center ring-1 ring-white/[0.06]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/15">
        <BookOpen className="h-6 w-6 text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200">No papers analyzed yet</p>
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed max-w-xs">
          Analyze your first research paper above and it will appear here as a card.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
        <Sparkles className="h-3 w-3" />
        Results appear automatically after analysis completes
      </div>
    </div>
  );
}
