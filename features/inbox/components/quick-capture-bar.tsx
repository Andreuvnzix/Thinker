"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useInbox } from "@/features/inbox/lib/use-inbox";

/** Persistent one-line capture — never a modal, never a FAB. See DESIGN_SYSTEM.md §9. */
export function QuickCaptureBar() {
  const { capture } = useInbox([]);
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    capture(value.trim());
    setValue("");
  }

  return (
    <form
      onSubmit={submit}
      className="safe-bottom fixed inset-x-0 bottom-14 z-30 mx-auto max-w-2xl px-4 pb-2 md:sticky md:bottom-0 md:px-0 md:pb-0"
    >
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-2.5 shadow-sm">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Capture anything — call Juan, review invoice…"
          className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground"
          style={{ fontSize: 16 }}
        />
        <button
          type="submit"
          aria-label="Capture"
          disabled={!value.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </form>
  );
}
