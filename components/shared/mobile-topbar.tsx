"use client";

import { Search } from "lucide-react";
import { useCommandBar } from "@/features/command-bar/components/command-bar-context";

export function MobileTopBar() {
  const { setOpen } = useCommandBar();

  return (
    <header className="safe-top flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
      <span className="font-display text-lg">Daily OS</span>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground active:bg-secondary"
      >
        <Search size={19} strokeWidth={1.75} />
      </button>
    </header>
  );
}
