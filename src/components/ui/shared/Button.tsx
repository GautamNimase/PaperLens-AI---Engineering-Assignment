import React from "react";

type ButtonVariant = "primary" | "ghost" | "outline";

export function Button({
  className,
  disabled,
  onClick,
  children,
  variant = "primary",
  type = "button",
  "aria-label": ariaLabel,
}: {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-50 select-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98]",
    ghost:
      "bg-white/5 text-slate-200 px-4 py-2 ring-1 ring-white/8 hover:bg-white/10 hover:text-white active:scale-[0.98]",
    outline:
      "bg-transparent text-slate-300 px-4 py-2 ring-1 ring-white/15 hover:bg-white/5 hover:text-white active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
