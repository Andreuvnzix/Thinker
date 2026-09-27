/**
 * Domain models — the shapes features work with in memory.
 * Distinct from `database.ts` (raw Supabase rows) and any UI-only view models
 * defined inside a feature's own `lib/` folder.
 */

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export interface Task {
  id: string;
  userId: string;
  listId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null; // ISO date, no time
  scheduledTime: string | null; // HH:mm
  dueDate: string | null;
  estimatedMinutes: number | null;
  notes: string | null;
  labelIds: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskList {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  position: number;
  archivedAt: string | null;
}

export interface TaskLabel {
  id: string;
  userId: string;
  name: string;
  color: string | null;
}

export type InboxItemStatus = "captured" | "converted" | "archived";
export type InboxItemType = "task" | "note" | "event";

export interface InboxItem {
  id: string;
  userId: string;
  content: string;
  status: InboxItemStatus;
  convertedToType: InboxItemType | null;
  convertedToId: string | null;
  createdAt: string;
}

export type IntegrationStatus = "connected" | "disconnected" | "error" | "needs_authorization";

export interface CalendarEvent {
  id: string;
  userId: string;
  calendarAccountId: string;
  providerEventId: string;
  calendarName: string | null;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string; // ISO datetime
  endAt: string;
  allDay: boolean;
  attendees: { email: string; name?: string; responseStatus?: string }[];
  meetingUrl: string | null;
  isCancelled: boolean;
}

export interface CalendarAccount {
  id: string;
  userId: string;
  provider: "google";
  email: string;
  status: IntegrationStatus;
  lastSyncedAt: string | null;
}

export interface Email {
  id: string;
  userId: string;
  emailAccountId: string;
  providerMessageId: string;
  threadId: string | null;
  senderName: string | null;
  senderEmail: string | null;
  subject: string | null;
  snippet: string | null;
  receivedAt: string;
  isRead: boolean;
  isImportant: boolean;
  needsReply: boolean;
  labels: string[];
  linkedTaskIds: string[];
}

export interface EmailAccount {
  id: string;
  userId: string;
  provider: "gmail";
  email: string;
  status: IntegrationStatus;
  lastSyncedAt: string | null;
}

export interface DailyBriefing {
  userId: string;
  briefingDate: string;
  summary: string;
  priorities: string[];
  warnings: string[];
  generatedAt: string;
}

export type DailyPlanStatus = "draft" | "active" | "completed";
export type PlanBlockType = "task" | "event" | "break" | "buffer";
export type PlanBlockStatus = "suggested" | "accepted" | "modified" | "discarded";

export interface DailyPlanBlock {
  id: string;
  type: PlanBlockType;
  title: string;
  startAt: string;
  endAt: string;
  taskId: string | null;
  calendarEventId: string | null;
  status: PlanBlockStatus;
  position: number;
}

export interface DailyPlan {
  id: string;
  userId: string;
  planDate: string;
  status: DailyPlanStatus;
  blocks: DailyPlanBlock[];
}

export interface UserPreferences {
  userId: string;
  workingHoursStart: string; // HH:mm
  workingHoursEnd: string;
  weekStartsOn: 0 | 1;
  defaultTaskDurationMinutes: number;
  theme: "system" | "light" | "dark";
}

/** Aggregated view backing the /today screen. */
export interface TodayOverview {
  date: string;
  greetingName: string | null;
  meetingsCount: number;
  tasksCount: number;
  overdueTasksCount: number;
  importantEmailsCount: number;
  agenda: CalendarEvent[];
  priorityTasks: Task[];
  importantEmails: Email[];
  tomorrowPreview: { meetingsCount: number; tasksCount: number };
}
