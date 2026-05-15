
export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className ?? ""}`} aria-hidden="true" />;
}

export function ResultPageSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-label="Loading results" aria-busy="true">
      {/* Summary skeleton */}
      <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] p-6">
        <div className="flex items-start gap-4">
          <LoadingSkeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2.5">
            <LoadingSkeleton className="h-5 w-3/4" />
            <LoadingSkeleton className="h-3.5 w-full" />
            <LoadingSkeleton className="h-3.5 w-2/3" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <LoadingSkeleton className="h-20 rounded-xl" />
          <LoadingSkeleton className="h-20 rounded-xl" />
        </div>
      </div>

      {/* Concepts skeleton */}
      <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] p-6">
        <LoadingSkeleton className="h-4 w-32 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-7 rounded-full" style={{ width: `${60 + i * 15}px` }} />
          ))}
        </div>
      </div>

      {/* Math skeleton */}
      <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] p-6">
        <LoadingSkeleton className="h-4 w-40 mb-4" />
        <LoadingSkeleton className="h-16 rounded-xl" />
      </div>

      {/* Mind map skeleton */}
      <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] p-6">
        <LoadingSkeleton className="h-4 w-28 mb-4" />
        <LoadingSkeleton className="h-[360px] rounded-xl" />
      </div>
    </div>
  );
}
