-- Family Command Centre Database Schema
-- Run this in Supabase SQL Editor

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text default 'member' check (role in ('admin', 'member')),
  preferences jsonb default '{}',
  created_at timestamptz default now()
);

-- Calendar Events Cache
create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  google_event_id text unique,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_movable boolean default true,
  user_id uuid references users(id) on delete cascade,
  synced_at timestamptz default now()
);

-- Meals
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  prep_time_mins int,
  tags text[] default '{}',
  is_favourite boolean default false,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz default now()
);

-- Meal Plan
create table if not exists meal_plan (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  meal_id uuid references meals(id) on delete cascade,
  cook_id uuid references users(id) on delete set null,
  created_at timestamptz default now(),
  unique(date)
);

-- Dinner Poll
create table if not exists dinner_poll (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  user_id uuid references users(id) on delete cascade,
  is_home boolean not null,
  responded_at timestamptz default now(),
  unique(date, user_id)
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('home', 'kids', 'admin', 'projects')),
  assigned_to uuid references users(id) on delete set null,
  created_by uuid references users(id) on delete set null,
  is_recurring boolean default false,
  recurrence_rule text check (recurrence_rule in ('daily', 'weekly', 'fortnightly', 'monthly')),
  next_due date,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Feedback (for learning agent)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('meal_suggestion', 'task', 'calendar')),
  entity_id uuid,
  user_id uuid references users(id) on delete cascade,
  rating int check (rating between -1 and 1),
  comment text,
  context jsonb default '{}',
  created_at timestamptz default now()
);

-- User Preferences (learned over time)
create table if not exists learned_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  preference_type text not null,
  preference_key text not null,
  preference_value jsonb not null,
  confidence float default 0.5,
  updated_at timestamptz default now(),
  unique(user_id, preference_type, preference_key)
);

-- Indexes for performance
create index if not exists idx_calendar_events_user on calendar_events(user_id);
create index if not exists idx_calendar_events_start on calendar_events(start_time);
create index if not exists idx_meal_plan_date on meal_plan(date);
create index if not exists idx_dinner_poll_date on dinner_poll(date);
create index if not exists idx_tasks_assigned on tasks(assigned_to);
create index if not exists idx_tasks_due on tasks(next_due);
create index if not exists idx_feedback_entity on feedback(entity_type, entity_id);

-- Row Level Security (enable after setting up auth)
-- alter table users enable row level security;
-- alter table calendar_events enable row level security;
-- alter table meals enable row level security;
-- alter table meal_plan enable row level security;
-- alter table dinner_poll enable row level security;
-- alter table tasks enable row level security;
-- alter table feedback enable row level security;
-- alter table learned_preferences enable row level security;

-- Seed the family members
insert into users (name, email, role, preferences) values
  ('Troy', 'troy@family.local', 'admin', '{"cooking_skill": "intermediate"}'),
  ('Lex', 'lex@family.local', 'admin', '{"cooking_skill": "advanced"}'),
  ('Luke', 'luke@family.local', 'member', '{"cooking_skill": "beginner"}'),
  ('Charlie', 'charlie@family.local', 'member', '{"cooking_skill": "beginner"}')
on conflict (email) do nothing;
