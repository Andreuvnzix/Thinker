import { getAllTasks } from "@/lib/services/tasks";
import { TasksView } from "@/features/tasks/components/tasks-view";

export default async function TasksPage() {
  const tasks = await getAllTasks();
  return <TasksView initialTasks={tasks} />;
}
