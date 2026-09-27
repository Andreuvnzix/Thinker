"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface CommandBarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandBarContext = createContext<CommandBarContextValue | null>(null);

export function CommandBarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <CommandBarContext.Provider value={{ open, setOpen }}>{children}</CommandBarContext.Provider>;
}

export function useCommandBar() {
  const ctx = useContext(CommandBarContext);
  if (!ctx) throw new Error("useCommandBar must be used within CommandBarProvider");
  return ctx;
}
