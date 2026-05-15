import React from "react";

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  id,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-slate-100 ring-1 ring-white/10 placeholder:text-slate-500 outline-none transition-all duration-200 focus:ring-indigo-500/40 focus:bg-white/8 hover:ring-white/15"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
