"use client";

import { useCallback, useState, useTransition } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { captureInboxItemAction } from "@/lib/actions/inbox";
import type { InboxItem } from "@/lib/types/domain";

export function useInbox(initialItems: InboxItem[]) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  const capture = useCallback((content: string) => {
    if (!content.trim()) return;
    if (!isSupabaseConfigured) {
      setItems((prev) => [
        { id: `local-${crypto.randomUUID()}`, userId: "demo-user", content, status: "captured", convertedToType: null, convertedToId: null, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      return;
    }
    startTransition(async () => {
      const item = await captureInboxItemAction({ content });
      setItems((prev) => [item, ...prev]);
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, isPending, capture, dismiss };
}
