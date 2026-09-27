import { formatDayHeader } from "@/lib/utils/time";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 19) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader({ name }: { name?: string | null }) {
  const now = new Date();
  const { weekday, dateLabel } = formatDayHeader(now);

  return (
    <div>
      <h1 className="font-display text-display leading-tight">
        {greetingForHour(now.getHours())}
        {name ? `, ${name}` : ""}
      </h1>
      <p className="mt-1 text-micro font-medium tracking-wide text-muted-foreground">
        {weekday} · {dateLabel}
      </p>
    </div>
  );
}
