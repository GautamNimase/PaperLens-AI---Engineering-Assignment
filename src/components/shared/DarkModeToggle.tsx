"use client";

import { Button } from "@/components/ui/shared/Button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "paperlens-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Theme = stored === "light" || stored === "dark" ? stored : "dark";
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);


  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <Button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 text-xs"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {theme === "dark" ? "Dark" : "Light"}
    </Button>
  );
}

