# Lumina

> An Immersive Spatial Learning Environment for WebGL, WebGPU, and Three.js

Lumina teaches 3D web development through an immersive 3D experience. Navigate a spatial lobby, write code in an embedded sandbox, and watch your skills grow on a 3D skill tree.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.x
- **3D Engine**: Three.js + React Three Fiber 9
- **Physics**: Rapier 3D
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (GitHub, Google OAuth)
- **Styling**: Tailwind CSS 4
- **State**: Zustand 5

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run the migration in SQL Editor:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy and paste into SQL Editor
   - Run the query
4. Configure OAuth providers:
   - Go to Authentication > Providers
   - Enable GitHub and/or Google
   - Add callback URL: `https://your-project.supabase.co/auth/v1/callback`

### Development

```bash
# Start development server with Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages (landing)
│   ├── (app)/              # Authenticated pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── lobby/          # 3D Spatial lobby
│   │   ├── learn/          # Lesson pages
│   │   └── sandbox/        # Code sandbox
│   └── auth/               # Authentication pages
├── components/
│   ├── three/              # R3F 3D components
│   ├── ui/                 # UI components
│   ├── layout/             # Layout components
│   └── providers/          # React providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & configs
├── stores/                 # Zustand stores
└── types/                  # TypeScript types
```

## Features

### Sprint 1: Foundation (Current)
- [x] Next.js 16 setup
- [x] Supabase authentication
- [x] Basic UI components
- [x] Database schema

### Sprint 2: Basic R3F Scene (Coming)
- [ ] Canvas setup with performance tiers
- [ ] GPU detection
- [ ] Loading system

### Sprint 3-4: The Lobby
- [ ] 3D room environment
- [ ] Point-and-click navigation
- [ ] Interactive objects

### Sprint 5-6: Sandbox
- [ ] Sandpack integration
- [ ] Code validation
- [ ] Live preview

### Sprint 7-8: Curriculum
- [ ] Lesson engine
- [ ] Progress tracking
- [ ] Phase 1 content

### Sprint 9-10: Gamification
- [ ] XP system
- [ ] 3D Skill Tree
- [ ] Trophy shelf

## Documentation

- [PRD.md](./PRD.md) - Full product requirements
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Sprint breakdown
- [SPRINT-1.md](./SPRINT-1.md) - Current sprint details

## License

MIT
