# Restimate ☯

> Plan Your Recovery, Protect Your Energy

A comprehensive rest planning app that helps you schedule intentional breaks, plan restorative time off, and maintain sustainable work rhythms.

## Features

- **📅 Daily Break Planning** - Get personalized break schedules based on your work rhythm
- **🌴 Time-Off Mapping** - Visualize your annual recovery plan and avoid burnout
- **🎯 Recovery Action Library** - Discover 30+ activities matched to your recovery style
- **💡 Energy Insights** - Track patterns and optimize your rest strategy
- **🔐 Secure Authentication** - Email/password and magic link sign-in via Supabase

## Tech Stack

- **Frontend:** React 19 + Vite 7
- **Backend:** Supabase (PostgreSQL + Auth)
- **Routing:** React Router v7
- **Styling:** CSS Modules with design tokens
- **Hosting:** Netlify

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `.env.example` to `.env.local` and add your credentials:

```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the database migration:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/20240101000000_initial_schema.sql`
   - Execute the SQL

See [supabase/README.md](./supabase/README.md) for detailed setup instructions.

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── actions/      # Recovery action library
│   ├── auth/         # Login, signup, protected routes
│   ├── daily/        # Daily break planning
│   ├── layout/       # App shell, sidebar
│   ├── onboarding/   # Recovery style assessment
│   ├── timeoff/      # Time-off planning
│   └── ui/           # Reusable UI components
├── contexts/         # React contexts (Auth, UserData, TimeOff)
├── hooks/            # Custom React hooks
├── pages/            # Route pages
│   ├── app/          # Authenticated app pages
│   └── Landing.jsx   # Public landing page
├── data/             # Static data (recovery actions)
└── styles/           # Global styles and design tokens

supabase/
├── migrations/       # Database schema
└── README.md         # Supabase setup guide
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

The app is configured for Netlify deployment with the included `netlify.toml`.

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Documentation

- [Product Requirements Document (PRD)](./PRD.md) - Full feature specifications
- [Supabase Setup Guide](./supabase/README.md) - Database configuration

## License

MIT
