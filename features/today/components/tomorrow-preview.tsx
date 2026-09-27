import type { TodayOverview } from "@/lib/types/domain";

export function TomorrowPreview({ preview }: { preview: TodayOverview["tomorrowPreview"] }) {
  return (
    <div className="flex items-center gap-4 rounded-md bg-secondary/50 px-4 py-3 text-body-sm">
      <span className="text-micro font-medium tracking-wide text-muted-foreground">TOMORROW</span>
      <span>{preview.meetingsCount} {preview.meetingsCount === 1 ? "meeting" : "meetings"}</span>
      <span className="text-muted-foreground">·</span>
      <span>{preview.tasksCount} {preview.tasksCount === 1 ? "task" : "tasks"}</span>
    </div>
  );
}
