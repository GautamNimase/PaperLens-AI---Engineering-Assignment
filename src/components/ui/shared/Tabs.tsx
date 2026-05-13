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
  const v = value;
  const ctx = useMemo<TabsCtx>(() => ({ value: v, setValue: onValueChange }), [v, onValueChange]);
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
    <div className={"flex rounded-xl p-1 " + (className ?? "")}>{children}</div>
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
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
        active
          ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-slate-100 ring-1 ring-white/15"
          : "text-slate-300 hover:bg-white/10"
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
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  if (ctx.value !== value) return null;
  return <div>{children}</div>;
}

