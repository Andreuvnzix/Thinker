"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div suppressHydrationWarning className="flex gap-1 rounded-md border border-border p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          suppressHydrationWarning
          className={cn(
            "rounded-sm px-3 py-1.5 text-body-sm text-muted-foreground",
            theme === opt.value && "bg-secondary text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
