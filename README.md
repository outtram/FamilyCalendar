# Family Command Centre

A family coordination app for managing shift pickups, meal planning, and household tasks. Built to reduce mental load and help the family stay organized.

## Features

### Phase 1: Calendar & Availability
- Google Calendar integration
- Traffic light availability view (Green/Amber/Red)
- Quick shift availability check for SOS requests
- Generate "available days" list for hospital submission

### Phase 2: Meals & Dinner Coordination
- "Who's home for dinner?" daily poll
- AI-powered meal suggestions (Claude)
- Weekly meal planning
- Family favourites library

### Phase 3: Tasks & Chores
- Task categories: Home, Kids, Admin, Projects
- Recurring tasks support
- Mental load distribution visualization
- Task assignment

### Phase 4: Intelligence & Learning
- Daily digest (6am AEST)
- Learning agent that improves suggestions over time
- Feedback mechanism

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Supabase (Postgres, Auth, Edge Functions)
- **AI**: Claude API (Sonnet 4)
- **Calendar**: Google Calendar API
- **Notifications**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Anthropic API key
- Google Cloud project with Calendar API enabled

### Setup

1. Clone the repository:
```bash
git clone https://github.com/outtram/FamilyCalendar.git
cd family-command-centre
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Set up the database:
   - Create a new Supabase project
   - Run the SQL in `supabase/schema.sql` in the SQL Editor

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
family-command-centre/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── calendar/          # Calendar/availability page
│   ├── meals/             # Meal planning pages
│   └── tasks/             # Task management page
├── agents/                # Claude Agent SDK agents
│   ├── calendar-agent.ts  # Calendar availability logic
│   ├── meal-agent.ts      # Meal suggestions
│   ├── task-agent.ts      # Task management
│   ├── orchestrator.ts    # Agent coordination
│   └── learning-agent.ts  # Preference learning
├── components/            # React components
├── lib/                   # Utilities (Supabase, Claude clients)
├── types/                 # TypeScript types
└── supabase/             # Database schema
```

## Architecture

Multi-agent design using Claude Agent SDK:
- **Calendar Agent**: Handles availability checks, conflicts
- **Meal Agent**: AI meal suggestions, preferences
- **Task Agent**: CRUD, recurring tasks, load balancing
- **Orchestrator**: Coordinates cross-agent queries
- **Learning Agent**: Persists feedback, builds preferences

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## License

Private - Outtram Family
