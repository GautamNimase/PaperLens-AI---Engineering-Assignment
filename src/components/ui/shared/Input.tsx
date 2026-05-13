import React from "react";

export function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 placeholder:text-slate-500 outline-none focus:ring-indigo-400/40"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

