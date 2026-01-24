# Supabase Setup

## Quick Start

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Update Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Run Database Migrations**

   **Option A: Using Supabase Dashboard (Easiest)**
   - Go to your project's SQL Editor in the Supabase dashboard
   - Copy and paste the contents of `migrations/20240101000000_initial_schema.sql`
   - Run the SQL

   **Option B: Using Supabase CLI**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Push migrations
   supabase db push
   ```

## Database Schema

### Tables

#### `user_profiles`
Stores user preferences and settings
- `id`: User UUID (references auth.users)
- `recovery_style`: One of 4 recovery types
- `workday_start/end`: Work schedule
- `break_frequency_mins`: How often to suggest breaks
- `break_duration_mins`: Default break length
- `onboarding_completed`: Whether user finished setup
- `reminder_enabled`: Push notification preference

#### `time_off_entries`
Tracks planned time off
- `id`: UUID
- `user_id`: References user_profiles
- `title`: Description of time off
- `start_date/end_date`: Date range
- `type`: vacation, sick, personal, other
- `notes`: Optional details

#### `break_logs`
Records actual breaks taken (for insights)
- `id`: UUID
- `user_id`: References user_profiles
- `break_date/time`: When break was taken
- `duration_mins`: Length of break
- `activity`: What user did during break
- `energy_before/after`: Self-reported energy (1-5)

### Security

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Testing

To verify your setup:

1. Create a test account at `/signup`
2. Complete the onboarding flow
3. Check the Supabase dashboard to confirm data is being saved
