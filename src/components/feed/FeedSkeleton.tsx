import { LoadingSkeleton } from "@/components/ui/shared/LoadingSkeleton";

export function FeedSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-busy="true" aria-label="Loading papers">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#0d1117] ring-1 ring-white/[0.07] p-5"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex gap-1.5">
                <LoadingSkeleton className="h-4 w-16 rounded-md" />
                <LoadingSkeleton className="h-4 w-12 rounded-md" />
              </div>
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-4 w-4/5" />
              <LoadingSkeleton className="h-3 w-2/3" />
              <LoadingSkeleton className="h-3 w-20" />
            </div>
            <LoadingSkeleton className="h-[100px] w-[76px] shrink-0 rounded-xl" />
          </div>
          <div className="mt-4 h-px bg-white/[0.04]" />
          <div className="mt-3 flex gap-1.5">
            <LoadingSkeleton className="h-4 w-14 rounded-full" />
            <LoadingSkeleton className="h-4 w-18 rounded-full" />
            <LoadingSkeleton className="h-4 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
