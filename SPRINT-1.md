# Sprint 1: Foundation

**Duration**: Week 1
**Status**: 🟡 In Progress
**Goal**: Set up project infrastructure with latest tech stack

---

## Objectives

1. Initialize Next.js 15 project with App Router
2. Configure Supabase for auth and database
3. Implement OAuth authentication (GitHub, Google)
4. Create basic UI shell and navigation
5. Establish TypeScript types and folder structure

---

## Technology Versions (December 2025)

| Package | Target Version |
|---------|----------------|
| Next.js | 15.x |
| React | 19.x |
| TypeScript | 5.7.x |
| Tailwind CSS | 4.x |
| Three.js | 0.170.x |
| React Three Fiber | 9.x |
| @react-three/drei | 9.x |
| Zustand | 5.x |
| @supabase/supabase-js | 2.x |
| @supabase/ssr | 0.5.x |

---

## Task Breakdown

### Day 1: Project Initialization

- [ ] Create Next.js 15 project
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --turbopack --yes
  ```

- [ ] Install dependencies
  ```bash
  # 3D
  npm install three @react-three/fiber @react-three/drei @react-three/postprocessing

  # State
  npm install zustand

  # Auth & DB
  npm install @supabase/supabase-js @supabase/ssr

  # UI
  npm install framer-motion lucide-react clsx tailwind-merge

  # Dev
  npm install -D @types/three
  ```

- [ ] Configure TypeScript strict mode
- [ ] Set up path aliases (@/...)
- [ ] Create .env.local template

### Day 2: Project Structure

Create the following folder structure:

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Marketing layout
│   ├── (app)/
│   │   ├── layout.tsx         # App layout (auth required)
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Temp dashboard
│   │   └── lobby/
│   │       └── page.tsx       # 3D lobby (placeholder)
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts       # OAuth callback
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   └── error/
│   │       └── page.tsx       # Auth error page
│   ├── api/
│   │   └── user/
│   │       └── route.ts       # User API
│   ├── layout.tsx             # Root layout
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Avatar.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── providers/
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Auth middleware
│   └── utils.ts               # Utility functions
├── stores/
│   └── userStore.ts           # Zustand store
├── types/
│   ├── database.ts            # Supabase types
│   └── index.ts
└── hooks/
    └── useUser.ts
```

### Day 3: Supabase Setup

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project "lumina"
   - Note down URL and anon key

2. **Configure Environment**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Create Database Tables**
   ```sql
   -- Profiles table (extends auth.users)
   CREATE TABLE public.profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     username TEXT UNIQUE,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Policy: Users can read their own profile
   CREATE POLICY "Users can read own profile"
     ON public.profiles FOR SELECT
     USING (auth.uid() = id);

   -- Policy: Users can update their own profile
   CREATE POLICY "Users can update own profile"
     ON public.profiles FOR UPDATE
     USING (auth.uid() = id);

   -- Trigger: Create profile on user signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, full_name, avatar_url)
     VALUES (
       NEW.id,
       NEW.raw_user_meta_data->>'full_name',
       NEW.raw_user_meta_data->>'avatar_url'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

4. **Configure OAuth Providers**
   - GitHub: Create OAuth app, add redirect URL
   - Google: Create OAuth credentials, add redirect URL
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Day 4: Authentication Implementation

1. **Supabase Client Setup**

   ```typescript
   // src/lib/supabase/client.ts
   import { createBrowserClient } from '@supabase/ssr';

   export function createClient() {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );
   }
   ```

   ```typescript
   // src/lib/supabase/server.ts
   import { createServerClient } from '@supabase/ssr';
   import { cookies } from 'next/headers';

   export async function createClient() {
     const cookieStore = await cookies();
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           getAll() { return cookieStore.getAll(); },
           setAll(cookiesToSet) {
             cookiesToSet.forEach(({ name, value, options }) => {
               cookieStore.set(name, value, options);
             });
           },
         },
       }
     );
   }
   ```

2. **Auth Middleware**

   ```typescript
   // src/middleware.ts
   import { createServerClient } from '@supabase/ssr';
   import { NextResponse, type NextRequest } from 'next/server';

   export async function middleware(request: NextRequest) {
     // Refresh session and protect routes
   }

   export const config = {
     matcher: ['/dashboard/:path*', '/lobby/:path*', '/learn/:path*'],
   };
   ```

3. **OAuth Callback Handler**

   ```typescript
   // src/app/auth/callback/route.ts
   import { createClient } from '@/lib/supabase/server';
   import { NextResponse } from 'next/server';

   export async function GET(request: Request) {
     const { searchParams, origin } = new URL(request.url);
     const code = searchParams.get('code');
     const next = searchParams.get('next') ?? '/dashboard';

     if (code) {
       const supabase = await createClient();
       const { error } = await supabase.auth.exchangeCodeForSession(code);
       if (!error) {
         return NextResponse.redirect(`${origin}${next}`);
       }
     }

     return NextResponse.redirect(`${origin}/auth/error`);
   }
   ```

### Day 5: UI Shell

1. **Header Component**
   - Logo (Lumina)
   - Navigation links
   - Auth button (Sign In / User Avatar)
   - Theme toggle

2. **Landing Page**
   - Hero section with tagline
   - Feature highlights
   - CTA buttons
   - Footer

3. **Dashboard Page** (Placeholder)
   - Welcome message
   - User profile card
   - "Enter Lobby" button
   - Quick stats

---

## Acceptance Criteria

### Must Have
- [ ] `npm run dev` starts without errors
- [ ] Landing page renders at `/`
- [ ] Sign in with GitHub works
- [ ] Sign in with Google works
- [ ] User redirected to `/dashboard` after auth
- [ ] User data saved to Supabase profiles table
- [ ] Protected routes redirect to login if not authenticated
- [ ] Sign out works and clears session

### Should Have
- [ ] Dark mode support
- [ ] Responsive design (mobile-friendly)
- [ ] Loading states for auth actions
- [ ] Error handling with user-friendly messages

### Nice to Have
- [ ] Animated transitions
- [ ] Skeleton loading states
- [ ] Toast notifications

---

## Definition of Done

1. All acceptance criteria met
2. No TypeScript errors
3. No console errors/warnings
4. Code reviewed and documented
5. Deployed to Vercel preview
6. README updated with setup instructions

---

## Notes

- Keep the landing page simple; we'll enhance it later
- Focus on auth reliability over UI polish
- Document any issues with latest package versions
- Test on Chrome, Firefox, Safari

---

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)
