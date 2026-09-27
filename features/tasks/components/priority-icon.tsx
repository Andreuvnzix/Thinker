import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/types/domain";

/** A small left-edge signal, never a colored badge blob — see DESIGN_SYSTEM.md §7. */
export function PriorityMark({ priority }: { priority: TaskPriority }) {
  if (priority === "urgent") return <span className="block h-full w-0.5 shrink-0 self-stretch rounded-full bg-accent-signal" />;
  if (priority === "high")
    return <span className="block h-full w-0.5 shrink-0 self-stretch rounded-full bg-accent-signal/40" />;
  return <span className={cn("block h-full w-0.5 shrink-0 self-stretch rounded-full bg-transparent")} />;
}
