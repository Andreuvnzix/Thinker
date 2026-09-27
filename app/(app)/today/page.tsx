import { getTodayOverview } from "@/lib/services/today";
import { GreetingHeader } from "@/features/today/components/greeting-header";
import { DaySummary } from "@/features/today/components/day-summary";
import { Timeline } from "@/features/today/components/timeline";
import { PriorityTasks } from "@/features/today/components/priority-tasks";
import { ImportantEmails } from "@/features/today/components/important-emails";
import { TomorrowPreview } from "@/features/today/components/tomorrow-preview";
import { Section } from "@/features/today/components/section";
import { PlanMyDaySheet } from "@/features/planning/components/plan-my-day-sheet";
import { QuickCaptureBar } from "@/features/inbox/components/quick-capture-bar";

export default async function TodayPage() {
  const overview = await getTodayOverview();

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:px-8 md:pt-10">
      <div className="flex items-start justify-between gap-4">
        <GreetingHeader />
        <PlanMyDaySheet tasks={overview.priorityTasks} events={overview.agenda} />
      </div>

      <div className="mt-4">
        <DaySummary overview={overview} />
      </div>

      <Section title="Agenda">
        <Timeline events={overview.agenda} />
      </Section>

      <Section title="Priority tasks">
        <PriorityTasks tasks={overview.priorityTasks} />
      </Section>

      <Section title="Important emails">
        <ImportantEmails emails={overview.importantEmails} />
      </Section>

      <div className="pb-8">
        <TomorrowPreview preview={overview.tomorrowPreview} />
      </div>

      <QuickCaptureBar />
    </div>
  );
}
