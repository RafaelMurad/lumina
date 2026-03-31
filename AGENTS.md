# Lumina

Interactive 3D learning platform for Three.js/WebGL. Gamified curriculum with a navigable lobby scene.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS 4.
Three.js/R3F 9, Supabase (auth + PostgreSQL + realtime), Stripe, Zustand 5.
`npm` for packages. Path alias: `@/*` → `./src/*`.
No test setup.

## Development

```bash
npm run type-check   # must pass clean
npm run lint         # must pass clean
npm run build        # verify before finishing
```

Supabase migrations in `supabase/migrations/` — apply via Supabase CLI.
`subscriptions` table types not yet in `src/types/database.ts` — update after schema changes.

## Conventions

- Route groups: `(marketing)` for public pages, `(app)` for authenticated shell, `auth` for auth flows.
- Performance tier system (`usePerformanceTier`): ultra/balanced/minimal — auto-detects GPU. Affects DPR, shadows, post-processing.
- Guest mode supported: localStorage progress, cookie-based session, migrates on real auth.
- Stripe plans in `lib/stripe/config.ts` — phase access gated by subscription tier.
- Gamification: XP/levels/achievements in `lib/gamification/`. 23 achievements across 4 rarity tiers.
- Zustand stores: `sceneStore` (3D state, not persisted), `userStore` (profile/progress, persisted to localStorage).
- Curriculum content hardcoded in `src/content/curriculum/index.ts`.
