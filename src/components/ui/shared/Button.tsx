import React from "react";

export function Button({
  className,
  disabled,
  onClick,
  children,
}: {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/10 ring-1 ring-white/10 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 ${
        className ?? ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

