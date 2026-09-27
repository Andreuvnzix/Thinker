"use client";

import { useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { useInbox } from "@/features/inbox/lib/use-inbox";
import type { InboxItem } from "@/lib/types/domain";
import { relativeTimeFromNow } from "@/lib/utils/time";

export function InboxView({ initialItems }: { initialItems: InboxItem[] }) {
  const { items, capture, dismiss } = useInbox(initialItems);
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    capture(value.trim());
    setValue("");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:px-8 md:pt-10">
      <h1 className="font-display text-display">Inbox</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Capture anything fast. Turn it into a task, note, or event when you have a second.
      </p>

      <form onSubmit={submit} className="mt-4 flex items-center gap-2 rounded-md border border-border px-3 py-2.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Llamar a Juan mañana…"
          style={{ fontSize: 16 }}
          className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Capture"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30"
        >
          <ArrowUp size={16} />
        </button>
      </form>

      {items.length === 0 ? (
        <p className="py-10 text-center text-body-sm text-muted-foreground">Inbox zero. Nice.</p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-body">{item.content}</p>
                <p className="text-[11px] text-muted-foreground">{relativeTimeFromNow(item.createdAt)}</p>
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(item.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
