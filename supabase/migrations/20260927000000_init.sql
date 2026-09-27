-- Daily OS — initial schema
-- Every user-owned table carries user_id uuid references auth.users(id) and is RLS-scoped to auth.uid().

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type task_status as enum ('pending', 'in_progress', 'completed', 'cancelled');
create type task_priority as enum ('low', 'normal', 'high', 'urgent');
create type inbox_item_status as enum ('captured', 'converted', 'archived');
create type inbox_item_type as enum ('task', 'note', 'event');
create type calendar_provider as enum ('google');
create type email_provider as enum ('gmail');
create type integration_status as enum ('connected', 'disconnected', 'error', 'needs_authorization');
create type daily_plan_status as enum ('draft', 'active', 'completed');
create type plan_block_type as enum ('task', 'event', 'break', 'buffer');
create type plan_block_status as enum ('suggested', 'accepted', 'modified', 'discarded');
create type sync_status as enum ('success', 'partial', 'failed');

-- ---------------------------------------------------------------------------
-- Core: profiles, preferences
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  working_hours_start time not null default '09:00',
  working_hours_end time not null default '18:00',
  week_starts_on smallint not null default 1, -- 0 = Sunday
  default_task_duration_minutes integer not null default 30,
  theme text not null default 'system',
  notification_prefs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tasks
-- ---------------------------------------------------------------------------

create table task_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  color text,
  position integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  list_id uuid references task_lists(id) on delete set null,
  title text not null,
  description text,
  status task_status not null default 'pending',
  priority task_priority not null default 'normal',
  scheduled_date date,
  scheduled_time time,
  due_date date,
  estimated_minutes integer,
  notes text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  deleted_at timestamptz
);

create table task_labels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table task_label_relations (
  task_id uuid not null references tasks(id) on delete cascade,
  label_id uuid not null references task_labels(id) on delete cascade,
  primary key (task_id, label_id)
);

-- ---------------------------------------------------------------------------
-- Inbox (universal quick capture)
-- ---------------------------------------------------------------------------

create table inbox_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  status inbox_item_status not null default 'captured',
  converted_to_type inbox_item_type,
  converted_to_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Calendar integration
-- ---------------------------------------------------------------------------

create table calendar_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider calendar_provider not null default 'google',
  email text not null,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  scope text,
  status integration_status not null default 'needs_authorization',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider, email)
);

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  calendar_account_id uuid not null references calendar_accounts(id) on delete cascade,
  provider_event_id text not null,
  provider_calendar_id text,
  calendar_name text,
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  all_day boolean not null default false,
  attendees jsonb not null default '[]'::jsonb,
  meeting_url text,
  is_cancelled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (calendar_account_id, provider_event_id)
);

-- ---------------------------------------------------------------------------
-- Email integration
-- ---------------------------------------------------------------------------

create table email_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider email_provider not null default 'gmail',
  email text not null,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  scope text,
  history_id text,
  status integration_status not null default 'needs_authorization',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider, email)
);

create table emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  email_account_id uuid not null references email_accounts(id) on delete cascade,
  provider_message_id text not null,
  thread_id text,
  sender_name text,
  sender_email text,
  subject text,
  snippet text,
  received_at timestamptz not null,
  is_read boolean not null default false,
  is_important boolean not null default false,
  needs_reply boolean not null default false,
  labels jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email_account_id, provider_message_id)
);

create table email_task_relations (
  id uuid primary key default gen_random_uuid(),
  email_id uuid not null references emails(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (email_id, task_id)
);

-- ---------------------------------------------------------------------------
-- Daily briefing & planning
-- ---------------------------------------------------------------------------

create table daily_briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  briefing_date date not null,
  summary text,
  priorities jsonb not null default '[]'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  model_used text,
  generated_at timestamptz not null default now(),
  unique (user_id, briefing_date)
);

create table daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_date date not null,
  status daily_plan_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_date)
);

create table daily_plan_blocks (
  id uuid primary key default gen_random_uuid(),
  daily_plan_id uuid not null references daily_plans(id) on delete cascade,
  type plan_block_type not null,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  task_id uuid references tasks(id) on delete set null,
  calendar_event_id uuid references calendar_events(id) on delete set null,
  position integer not null default 0,
  status plan_block_status not null default 'suggested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Integrations & sync bookkeeping
-- ---------------------------------------------------------------------------

create table integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider text not null,
  status integration_status not null default 'disconnected',
  connected_at timestamptz,
  last_synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table sync_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  integration_id uuid references integrations(id) on delete set null,
  provider text not null,
  sync_type text not null,
  status sync_status not null,
  items_synced integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index tasks_user_status_idx on tasks (user_id, status) where deleted_at is null;
create index tasks_user_scheduled_date_idx on tasks (user_id, scheduled_date) where deleted_at is null;
create index tasks_user_due_date_idx on tasks (user_id, due_date) where deleted_at is null;
create index inbox_items_user_status_idx on inbox_items (user_id, status);
create index calendar_events_user_start_idx on calendar_events (user_id, start_at);
create index calendar_events_account_idx on calendar_events (calendar_account_id);
create index emails_user_received_idx on emails (user_id, received_at desc);
create index emails_user_needs_reply_idx on emails (user_id, needs_reply) where needs_reply = true;
create index daily_plan_blocks_plan_idx on daily_plan_blocks (daily_plan_id, position);
create index sync_logs_user_idx on sync_logs (user_id, started_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles for each row execute function set_updated_at();
create trigger set_updated_at before update on user_preferences for each row execute function set_updated_at();
create trigger set_updated_at before update on task_lists for each row execute function set_updated_at();
create trigger set_updated_at before update on tasks for each row execute function set_updated_at();
create trigger set_updated_at before update on inbox_items for each row execute function set_updated_at();
create trigger set_updated_at before update on calendar_accounts for each row execute function set_updated_at();
create trigger set_updated_at before update on calendar_events for each row execute function set_updated_at();
create trigger set_updated_at before update on email_accounts for each row execute function set_updated_at();
create trigger set_updated_at before update on emails for each row execute function set_updated_at();
create trigger set_updated_at before update on daily_plans for each row execute function set_updated_at();
create trigger set_updated_at before update on daily_plan_blocks for each row execute function set_updated_at();
create trigger set_updated_at before update on integrations for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security — every user-owned table is scoped to auth.uid()
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table user_preferences enable row level security;
alter table task_lists enable row level security;
alter table tasks enable row level security;
alter table task_labels enable row level security;
alter table task_label_relations enable row level security;
alter table inbox_items enable row level security;
alter table calendar_accounts enable row level security;
alter table calendar_events enable row level security;
alter table email_accounts enable row level security;
alter table emails enable row level security;
alter table email_task_relations enable row level security;
alter table daily_briefings enable row level security;
alter table daily_plans enable row level security;
alter table daily_plan_blocks enable row level security;
alter table integrations enable row level security;
alter table sync_logs enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own preferences" on user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own task lists" on task_lists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own tasks" on tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own task labels" on task_labels for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own task label relations" on task_label_relations for all
  using (exists (select 1 from tasks where tasks.id = task_id and tasks.user_id = auth.uid()))
  with check (exists (select 1 from tasks where tasks.id = task_id and tasks.user_id = auth.uid()));
create policy "own inbox items" on inbox_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own calendar accounts" on calendar_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own calendar events" on calendar_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own email accounts" on email_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own emails" on emails for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own email task relations" on email_task_relations for all
  using (exists (select 1 from emails where emails.id = email_id and emails.user_id = auth.uid()))
  with check (exists (select 1 from emails where emails.id = email_id and emails.user_id = auth.uid()));
create policy "own daily briefings" on daily_briefings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own daily plans" on daily_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own daily plan blocks" on daily_plan_blocks for all
  using (exists (select 1 from daily_plans where daily_plans.id = daily_plan_id and daily_plans.user_id = auth.uid()))
  with check (exists (select 1 from daily_plans where daily_plans.id = daily_plan_id and daily_plans.user_id = auth.uid()));
create policy "own integrations" on integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own sync logs" on sync_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
