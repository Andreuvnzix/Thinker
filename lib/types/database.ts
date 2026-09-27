/**
 * Hand-authored stand-in for the Supabase-generated database types.
 * Regenerate for real once the Supabase project exists:
 *   supabase gen types typescript --project-id <id> > lib/types/database.ts
 * Keep this file's shape in sync with supabase/migrations/20260927000000_init.sql
 * until that command can run. `Relationships: []` on every table and the empty
 * `Views`/`Functions` maps are required by supabase-js's GenericSchema constraint.
 */

export type TaskStatusRow = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriorityRow = "low" | "normal" | "high" | "urgent";
export type InboxItemStatusRow = "captured" | "converted" | "archived";
export type InboxItemTypeRow = "task" | "note" | "event";
export type IntegrationStatusRow = "connected" | "disconnected" | "error" | "needs_authorization";
export type DailyPlanStatusRow = "draft" | "active" | "completed";
export type PlanBlockTypeRow = "task" | "event" | "break" | "buffer";
export type PlanBlockStatusRow = "suggested" | "accepted" | "modified" | "discarded";
export type SyncStatusRow = "success" | "partial" | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          working_hours_start: string;
          working_hours_end: string;
          week_starts_on: number;
          default_task_duration_minutes: number;
          theme: string;
          notification_prefs: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_preferences"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["user_preferences"]["Row"]>;
        Relationships: [];
      };
      task_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          position: number;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["task_lists"]["Row"]> & { user_id: string; name: string };
        Update: Partial<Database["public"]["Tables"]["task_lists"]["Row"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          list_id: string | null;
          title: string;
          description: string | null;
          status: TaskStatusRow;
          priority: TaskPriorityRow;
          scheduled_date: string | null;
          scheduled_time: string | null;
          due_date: string | null;
          estimated_minutes: number | null;
          notes: string | null;
          position: number;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["tasks"]["Row"]> & { user_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Row"]>;
        Relationships: [];
      };
      task_labels: {
        Row: { id: string; user_id: string; name: string; color: string | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["task_labels"]["Row"]> & { user_id: string; name: string };
        Update: Partial<Database["public"]["Tables"]["task_labels"]["Row"]>;
        Relationships: [];
      };
      task_label_relations: {
        Row: { task_id: string; label_id: string };
        Insert: { task_id: string; label_id: string };
        Update: Partial<{ task_id: string; label_id: string }>;
        Relationships: [];
      };
      inbox_items: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          status: InboxItemStatusRow;
          converted_to_type: InboxItemTypeRow | null;
          converted_to_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inbox_items"]["Row"]> & { user_id: string; content: string };
        Update: Partial<Database["public"]["Tables"]["inbox_items"]["Row"]>;
        Relationships: [];
      };
      calendar_accounts: {
        Row: {
          id: string;
          user_id: string;
          provider: "google";
          email: string;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          scope: string | null;
          status: IntegrationStatusRow;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["calendar_accounts"]["Row"]> & { user_id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["calendar_accounts"]["Row"]>;
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string;
          calendar_account_id: string;
          provider_event_id: string;
          provider_calendar_id: string | null;
          calendar_name: string | null;
          title: string;
          description: string | null;
          location: string | null;
          start_at: string;
          end_at: string;
          all_day: boolean;
          attendees: { email: string; name?: string; responseStatus?: string }[];
          meeting_url: string | null;
          is_cancelled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["calendar_events"]["Row"]> & {
          user_id: string;
          calendar_account_id: string;
          provider_event_id: string;
          title: string;
          start_at: string;
          end_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_events"]["Row"]>;
        Relationships: [];
      };
      email_accounts: {
        Row: {
          id: string;
          user_id: string;
          provider: "gmail";
          email: string;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          scope: string | null;
          history_id: string | null;
          status: IntegrationStatusRow;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["email_accounts"]["Row"]> & { user_id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["email_accounts"]["Row"]>;
        Relationships: [];
      };
      emails: {
        Row: {
          id: string;
          user_id: string;
          email_account_id: string;
          provider_message_id: string;
          thread_id: string | null;
          sender_name: string | null;
          sender_email: string | null;
          subject: string | null;
          snippet: string | null;
          received_at: string;
          is_read: boolean;
          is_important: boolean;
          needs_reply: boolean;
          labels: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["emails"]["Row"]> & {
          user_id: string;
          email_account_id: string;
          provider_message_id: string;
          received_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["emails"]["Row"]>;
        Relationships: [];
      };
      email_task_relations: {
        Row: { id: string; email_id: string; task_id: string; created_at: string };
        Insert: { email_id: string; task_id: string };
        Update: Partial<{ email_id: string; task_id: string }>;
        Relationships: [];
      };
      daily_briefings: {
        Row: {
          id: string;
          user_id: string;
          briefing_date: string;
          summary: string | null;
          priorities: string[];
          warnings: string[];
          model_used: string | null;
          generated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_briefings"]["Row"]> & {
          user_id: string;
          briefing_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_briefings"]["Row"]>;
        Relationships: [];
      };
      daily_plans: {
        Row: {
          id: string;
          user_id: string;
          plan_date: string;
          status: DailyPlanStatusRow;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_plans"]["Row"]> & { user_id: string; plan_date: string };
        Update: Partial<Database["public"]["Tables"]["daily_plans"]["Row"]>;
        Relationships: [];
      };
      daily_plan_blocks: {
        Row: {
          id: string;
          daily_plan_id: string;
          type: PlanBlockTypeRow;
          title: string;
          start_at: string;
          end_at: string;
          task_id: string | null;
          calendar_event_id: string | null;
          position: number;
          status: PlanBlockStatusRow;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_plan_blocks"]["Row"]> & {
          daily_plan_id: string;
          type: PlanBlockTypeRow;
          title: string;
          start_at: string;
          end_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_plan_blocks"]["Row"]>;
        Relationships: [];
      };
      integrations: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          status: IntegrationStatusRow;
          connected_at: string | null;
          last_synced_at: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["integrations"]["Row"]> & { user_id: string; provider: string };
        Update: Partial<Database["public"]["Tables"]["integrations"]["Row"]>;
        Relationships: [];
      };
      sync_logs: {
        Row: {
          id: string;
          user_id: string;
          integration_id: string | null;
          provider: string;
          sync_type: string;
          status: SyncStatusRow;
          items_synced: number;
          error_message: string | null;
          started_at: string;
          finished_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["sync_logs"]["Row"]> & {
          user_id: string;
          provider: string;
          sync_type: string;
          status: SyncStatusRow;
        };
        Update: Partial<Database["public"]["Tables"]["sync_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
