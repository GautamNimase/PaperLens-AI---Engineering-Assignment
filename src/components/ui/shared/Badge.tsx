"use client";

import React from "react";

type BadgeVariant = "default" | "indigo" | "purple" | "green" | "red" | "amber";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/8 text-slate-300 ring-white/10",
  indigo:  "bg-indigo-500/15 text-indigo-300 ring-indigo-500/20",
  purple:  "bg-purple-500/15 text-purple-300 ring-purple-500/20",
  green:   "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  red:     "bg-red-500/15 text-red-300 ring-red-500/20",
  amber:   "bg-amber-500/15 text-amber-300 ring-amber-500/20",
};

export function Badge({
  label,
  icon,
  variant = "default",
}: {
  label: string;
  icon?: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${variantStyles[variant]}`}
    >
      {icon ? <span className="opacity-80">{icon}</span> : null}
      {label}
    </span>
  );
}
