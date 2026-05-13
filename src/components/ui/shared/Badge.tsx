"use client";

import React from "react";

export function Badge({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-3 py-1 text-xs text-slate-100 ring-1 ring-white/10">
      {icon ? <span className="text-indigo-100">{icon}</span> : null}
      <span>{label}</span>
    </div>
  );
}

