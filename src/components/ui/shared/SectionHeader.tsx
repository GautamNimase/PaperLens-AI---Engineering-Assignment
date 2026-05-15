import React from "react";

export function SectionHeader({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/20">
          <span className="text-indigo-400">{icon}</span>
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
