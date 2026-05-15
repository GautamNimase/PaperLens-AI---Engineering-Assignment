"use client";

import React, { createContext, useContext, useMemo } from "react";

type TabsCtx = {
  value: string;
  setValue: (v: string) => void;
};

const Ctx = createContext<TabsCtx | null>(null);

export function Tabs({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const ctx = useMemo<TabsCtx>(
    () => ({ value, setValue: onValueChange }),
    [value, onValueChange]
  );
  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tablist"
      className={`flex rounded-xl bg-white/5 p-1 ring-1 ring-white/8 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("TabsTrigger must be inside <Tabs>");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ease-out ${
        active
          ? "bg-gradient-to-r from-indigo-500/25 to-purple-500/25 text-white ring-1 ring-white/12 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
      }`}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("TabsContent must be inside <Tabs>");
  if (ctx.value !== value) return null;
  return <div role="tabpanel">{children}</div>;
}
