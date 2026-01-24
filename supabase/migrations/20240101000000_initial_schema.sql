-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Profiles Table
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  recovery_style text check (recovery_style in ('Social Recharger', 'Solo Decompressor', 'Physical Resetter', 'Mental Unplugger')),
  workday_start time not null default '09:00',
  workday_end time not null default '17:00',
  break_frequency_mins integer not null default 90,
  break_duration_mins integer not null default 15,
  onboarding_completed boolean not null default false,
  reminder_enabled boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Time Off Entries Table
create table public.time_off_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  type text not null check (type in ('vacation', 'sick', 'personal', 'other')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Break Logs Table (for tracking actual breaks taken)
create table public.break_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  break_date date not null,
  break_time time not null,
  duration_mins integer not null,
  activity text,
  energy_before integer check (energy_before >= 1 and energy_before <= 5),
  energy_after integer check (energy_after >= 1 and energy_after <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.time_off_entries enable row level security;
alter table public.break_logs enable row level security;

-- User Profiles policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Time Off Entries policies
create policy "Users can view own time off entries"
  on public.time_off_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own time off entries"
  on public.time_off_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own time off entries"
  on public.time_off_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own time off entries"
  on public.time_off_entries for delete
  using (auth.uid() = user_id);

-- Break Logs policies
create policy "Users can view own break logs"
  on public.break_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own break logs"
  on public.break_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own break logs"
  on public.break_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own break logs"
  on public.break_logs for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index user_profiles_recovery_style_idx on public.user_profiles(recovery_style);
create index time_off_entries_user_id_idx on public.time_off_entries(user_id);
create index time_off_entries_dates_idx on public.time_off_entries(start_date, end_date);
create index break_logs_user_id_idx on public.break_logs(user_id);
create index break_logs_date_idx on public.break_logs(break_date);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_time_off_entries_updated_at
  before update on public.time_off_entries
  for each row
  execute procedure public.handle_updated_at();
