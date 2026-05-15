import React from "react";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
