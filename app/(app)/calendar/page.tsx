import { getEventsForToday } from "@/lib/services/calendar";
import { CalendarDayView } from "@/features/calendar/components/calendar-day-view";

export default async function CalendarPage() {
  const events = await getEventsForToday();
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:px-8 md:pt-10">
      <h1 className="font-display text-display">Calendar</h1>
      <div className="mt-4">
        <CalendarDayView events={events} />
      </div>
    </div>
  );
}
