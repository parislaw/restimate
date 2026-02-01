-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create daily_plans table
create table if not exists public.daily_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  date date not null,
  morning_break_minutes integer default 0,
  afternoon_break_minutes integer default 0,
  evening_rest_minutes integer default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Create time_off_entries table
create table if not exists public.time_off_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  start_date date not null,
  end_date date not null,
  type varchar(50) not null default 'vacation', -- 'vacation', 'sick_leave', 'personal_day', etc.
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create action_library table
create table if not exists public.action_library (
  id uuid default gen_random_uuid() primary key,
  name varchar(255) not null,
  description text,
  category varchar(100), -- 'physical', 'mental', 'social', 'creative', etc.
  duration_minutes integer,
  difficulty varchar(50), -- 'easy', 'medium', 'hard'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create daily_actions table (junction between daily plans and actions)
create table if not exists public.daily_actions (
  id uuid default gen_random_uuid() primary key,
  daily_plan_id uuid references public.daily_plans on delete cascade not null,
  action_id uuid references public.action_library on delete cascade not null,
  time_of_day varchar(50) not null, -- 'morning', 'afternoon', 'evening'
  completed boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(daily_plan_id, action_id, time_of_day)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.daily_plans enable row level security;
alter table public.time_off_entries enable row level security;
alter table public.daily_actions enable row level security;

-- Create RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create RLS policies for daily_plans
create policy "Users can view their own daily plans"
  on public.daily_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily plans"
  on public.daily_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own daily plans"
  on public.daily_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own daily plans"
  on public.daily_plans for delete
  using (auth.uid() = user_id);

-- Create RLS policies for time_off_entries
create policy "Users can view their own time off entries"
  on public.time_off_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own time off entries"
  on public.time_off_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own time off entries"
  on public.time_off_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own time off entries"
  on public.time_off_entries for delete
  using (auth.uid() = user_id);

-- Create RLS policies for daily_actions
create policy "Users can view daily actions for their plans"
  on public.daily_actions for select
  using (
    exists (
      select 1 from public.daily_plans
      where daily_plans.id = daily_actions.daily_plan_id
      and daily_plans.user_id = auth.uid()
    )
  );

create policy "Users can insert daily actions for their plans"
  on public.daily_actions for insert
  with check (
    exists (
      select 1 from public.daily_plans
      where daily_plans.id = daily_actions.daily_plan_id
      and daily_plans.user_id = auth.uid()
    )
  );

create policy "Users can update daily actions for their plans"
  on public.daily_actions for update
  using (
    exists (
      select 1 from public.daily_plans
      where daily_plans.id = daily_actions.daily_plan_id
      and daily_plans.user_id = auth.uid()
    )
  );

create policy "Users can delete daily actions for their plans"
  on public.daily_actions for delete
  using (
    exists (
      select 1 from public.daily_plans
      where daily_plans.id = daily_actions.daily_plan_id
      and daily_plans.user_id = auth.uid()
    )
  );

-- action_library is public read-only
create policy "Anyone can view action library"
  on public.action_library for select
  using (true);

-- Create indexes for performance
create index if not exists daily_plans_user_id_date_idx on public.daily_plans(user_id, date);
create index if not exists time_off_entries_user_id_idx on public.time_off_entries(user_id);
create index if not exists daily_actions_daily_plan_id_idx on public.daily_actions(daily_plan_id);
