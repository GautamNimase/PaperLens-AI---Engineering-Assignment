import React from "react";

/**
 * Premium glass card with optional gradient border.
 * Use `gradient` for hero/featured sections.
 */
export function GlassCard({
  children,
  className,
  gradient = false,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}) {
  if (gradient) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent p-px">
        <div
          className={`rounded-2xl bg-[#0d1117] ${hover ? "transition-all duration-200 hover:bg-[#111827]" : ""} ${className ?? ""}`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] ${
        hover ? "transition-all duration-200 hover:bg-white/[0.06] hover:ring-white/[0.12]" : ""
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
