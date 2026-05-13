import React from "react";

export function Textarea({
  value,
  onChange,
  rows,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className="w-full resize-none rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 placeholder:text-slate-500 outline-none focus:ring-indigo-400/40"
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
    />
  );
}

