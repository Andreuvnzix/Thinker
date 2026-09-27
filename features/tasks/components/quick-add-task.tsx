"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { CreateTaskInput } from "@/lib/validation/task";

export function QuickAddTask({ onAdd }: { onAdd: (input: CreateTaskInput) => void }) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd({ title, priority: "normal" });
    setValue("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-b border-border py-3">
      <Plus size={17} className="shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a task…"
        style={{ fontSize: 16 }}
        className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground"
      />
    </form>
  );
}
