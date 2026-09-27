import "server-only";
import { getAllTasks } from "@/lib/services/tasks";
import { getEventsForToday, getEventsForTomorrow } from "@/lib/services/calendar";
import { getImportantEmails } from "@/lib/services/email";
import { isToday } from "@/lib/utils/time";
import type { Task, TodayOverview } from "@/lib/types/domain";

function isOverdue(task: Task): boolean {
  if (task.status === "completed" || task.status === "cancelled") return false;
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

export async function getTodayOverview(): Promise<TodayOverview> {
  const [tasks, agenda, tomorrowAgenda, importantEmails] = await Promise.all([
    getAllTasks(),
    getEventsForToday(),
    getEventsForTomorrow(),
    getImportantEmails(),
  ]);

  const todaysTasks = tasks.filter(
    (t) => t.status !== "cancelled" && (t.scheduledDate ? isToday(t.scheduledDate) : isOverdue(t)),
  );
  const overdueTasks = tasks.filter(isOverdue);
  const priorityTasks = [...todaysTasks]
    .filter((t) => t.status !== "completed")
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));

  return {
    date: new Date().toISOString().slice(0, 10),
    greetingName: null,
    meetingsCount: agenda.length,
    tasksCount: todaysTasks.length,
    overdueTasksCount: overdueTasks.length,
    importantEmailsCount: importantEmails.length,
    agenda,
    priorityTasks,
    importantEmails,
    tomorrowPreview: {
      meetingsCount: tomorrowAgenda.length,
      tasksCount: tasks.filter((t) => t.scheduledDate && !isToday(t.scheduledDate)).length,
    },
  };
}

function priorityWeight(p: Task["priority"]): number {
  return { urgent: 3, high: 2, normal: 1, low: 0 }[p];
}
