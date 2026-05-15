import React from "react";

export function Textarea({
  value,
  onChange,
  rows,
  placeholder,
  id,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <textarea
      id={id}
      className="w-full resize-none rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 placeholder:text-slate-500 outline-none transition-all duration-200 focus:ring-indigo-500/40 focus:bg-white/8 hover:ring-white/15 leading-relaxed"
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
