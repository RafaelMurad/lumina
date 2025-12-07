# Lumina - Implementation Plan

## Sprint-Based Development (12 Weeks)

Each sprint is 1 week with clear deliverables. We build incrementally, always having a working product.

---

## Sprint Overview

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 1 | Foundation | Next.js 15 + Supabase + Auth |
| 2 | Basic R3F Scene | Canvas setup, performance tiers |
| 3 | The Lobby (Part 1) | Room environment, navigation |
| 4 | The Lobby (Part 2) | Interactive objects, transitions |
| 5 | Sandbox (Part 1) | Sandpack integration, basic editor |
| 6 | Sandbox (Part 2) | Multi-file, console, validation |
| 7 | Curriculum Engine | Lesson loading, progress tracking |
| 8 | Phase 1 Content | 8 Foundation lessons |
| 9 | Gamification (Part 1) | XP system, achievements |
| 10 | Gamification (Part 2) | 3D Skill Tree, Trophy Shelf |
| 11 | Phase 2 Content | 8 R3F lessons |
| 12 | Polish & Launch | Performance, testing, deployment |

---

## Sprint 1: Foundation (Week 1)

### Objective
Set up the project infrastructure with latest tech stack.

### Tasks

#### 1.1 Project Initialization
```bash
# Create Next.js 15 project with latest settings
npx create-next-app@latest lumina --typescript --tailwind --eslint --app --src-dir --turbopack

# Core dependencies
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install zustand @supabase/supabase-js @supabase/ssr
npm install framer-motion lucide-react clsx tailwind-merge

# Dev dependencies
npm install -D @types/three prisma
```

#### 1.2 Project Structure
```
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing page
│   ├── (app)/
│   │   ├── layout.tsx            # App layout with auth check
│   │   └── dashboard/page.tsx    # Temporary dashboard
│   ├── api/
│   │   └── auth/callback/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn-style components
│   └── providers/
│       └── AuthProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
├── stores/
│   └── userStore.ts
└── types/
    └── database.ts
```

#### 1.3 Supabase Setup
- Create Supabase project
- Configure OAuth providers (GitHub, Google)
- Create initial database tables (profiles, user_progress)
- Set up Row Level Security policies
- Generate TypeScript types

#### 1.4 Authentication Flow
- [ ] Sign in with GitHub
- [ ] Sign in with Google
- [ ] Email magic link (optional)
- [ ] Protected routes middleware
- [ ] User profile creation on first login

#### 1.5 Basic UI Shell
- [ ] Navigation header
- [ ] Auth buttons (Sign In/Sign Out)
- [ ] User avatar dropdown
- [ ] Dark mode support
- [ ] Loading states

### Deliverables
- [ ] Running Next.js 15 app on localhost:3000
- [ ] Working authentication (sign in/out)
- [ ] User data persisted in Supabase
- [ ] Clean folder structure established
- [ ] TypeScript strict mode enabled

### Files to Create
```
src/app/(marketing)/page.tsx
src/app/(app)/layout.tsx
src/app/(app)/dashboard/page.tsx
src/app/api/auth/callback/route.ts
src/components/providers/AuthProvider.tsx
src/components/ui/Button.tsx
src/components/ui/Avatar.tsx
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/middleware.ts
src/stores/userStore.ts
src/types/database.ts
middleware.ts
```

---

## Sprint 2: Basic R3F Scene (Week 2)

### Objective
Establish the 3D rendering foundation with performance optimization.

### Tasks

#### 2.1 R3F Canvas Setup
```typescript
// src/components/three/Canvas3D.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Suspense } from 'react';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';

export function Canvas3D({ children }) {
  const tier = usePerformanceTier();

  return (
    <Canvas
      dpr={tier.dpr}
      shadows={tier.shadows}
      gl={{ antialias: tier.antialias }}
      frameloop={tier.frameloop}
    >
      <Suspense fallback={<LoadingFallback />}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
```

#### 2.2 Performance Detection
```typescript
// src/hooks/usePerformanceTier.ts
import { useDetectGPU } from '@react-three/drei';

export function usePerformanceTier() {
  const gpuInfo = useDetectGPU();

  // Determine tier based on GPU capabilities
  if (gpuInfo.tier >= 3) return TIER_ULTRA;
  if (gpuInfo.tier >= 2) return TIER_BALANCED;
  return TIER_MINIMAL;
}
```

#### 2.3 Basic Test Scene
- [ ] Rotating cube with standard material
- [ ] Ambient + directional lighting
- [ ] OrbitControls for testing
- [ ] Grid helper
- [ ] Performance monitor (r3f-perf in dev)

#### 2.4 Loading System
- [ ] Suspense boundaries
- [ ] Loading progress indicator
- [ ] Asset preloading strategy
- [ ] Error boundaries

#### 2.5 State Management
```typescript
// src/stores/sceneStore.ts
import { create } from 'zustand';

interface SceneState {
  isLoading: boolean;
  currentScene: 'lobby' | 'lesson' | 'sandbox';
  performanceTier: 'ultra' | 'balanced' | 'minimal';
  // Actions
  setScene: (scene: SceneState['currentScene']) => void;
  setPerformanceTier: (tier: SceneState['performanceTier']) => void;
}
```

### Deliverables
- [ ] R3F Canvas rendering in browser
- [ ] GPU detection and performance tiers working
- [ ] Smooth 60fps on capable devices
- [ ] Loading states and error handling
- [ ] Dev tools (perf monitor, axes helper)

### Files to Create
```
src/components/three/Canvas3D.tsx
src/components/three/LoadingScreen.tsx
src/components/three/PerformanceMonitor.tsx
src/components/three/shared/Lights.tsx
src/hooks/usePerformanceTier.ts
src/stores/sceneStore.ts
```

---

## Sprint 3: The Lobby - Part 1 (Week 3)

### Objective
Create the base environment and navigation system.

### Tasks

#### 3.1 Room Model
- [ ] Design room layout in Blender (or find CC0 asset)
- [ ] Export optimized GLTF
- [ ] Load model with useGLTF
- [ ] Baked lighting for performance
- [ ] Collision geometry for raycasting

#### 3.2 Environment Setup
```typescript
// src/components/three/Lobby/Environment.tsx
import { Environment, Lightformer } from '@react-three/drei';

export function LobbyEnvironment() {
  return (
    <Environment preset="apartment">
      <Lightformer position={[0, 5, 0]} intensity={0.5} />
    </Environment>
  );
}
```

#### 3.3 Camera System
```typescript
// src/components/three/Lobby/CameraController.tsx
// Smooth camera transitions between points of interest
// - Default: overview of room
// - Terminal: zoom into computer screen
// - Bookshelf: side view of books
// - Tree: orbit around skill tree
```

#### 3.4 Navigation (Point-and-Click)
- [ ] Floor raycast detection
- [ ] NavMesh for walkable areas
- [ ] Click to set destination
- [ ] Avatar lerp to destination
- [ ] Camera follow

#### 3.5 Simple Avatar
- [ ] Placeholder capsule/character
- [ ] Idle animation
- [ ] Walk animation
- [ ] Rotation towards movement direction

### Deliverables
- [ ] 3D room visible and lit
- [ ] Click on floor to move
- [ ] Camera smoothly follows
- [ ] Environment map reflections
- [ ] Runs at 60fps

### Files to Create
```
src/components/three/Lobby/Lobby.tsx
src/components/three/Lobby/Room.tsx
src/components/three/Lobby/Environment.tsx
src/components/three/Lobby/CameraController.tsx
src/components/three/Lobby/Avatar.tsx
src/components/three/Lobby/NavMesh.tsx
src/hooks/useLobbyNavigation.ts
public/models/room.glb
public/models/avatar.glb
```

---

## Sprint 4: The Lobby - Part 2 (Week 4)

### Objective
Add interactive objects and scene transitions.

### Tasks

#### 4.1 Interactive Objects System
```typescript
// Unified interaction system
interface InteractiveObject {
  id: string;
  type: 'terminal' | 'bookshelf' | 'trophy' | 'tree' | 'whiteboard';
  position: [number, number, number];
  onInteract: () => void;
  hoverEffect: 'glow' | 'scale' | 'outline';
}
```

#### 4.2 Computer Terminal
- [ ] 3D computer model with screen
- [ ] Hover highlight effect
- [ ] Click triggers camera zoom
- [ ] Screen shows code preview
- [ ] Transition to sandbox mode

#### 4.3 Bookshelf (Module Browser)
- [ ] 3D bookshelf model
- [ ] Books represent modules
- [ ] Hover shows module name
- [ ] Click opens module modal
- [ ] Visual state (locked/available/completed)

#### 4.4 Scene Transitions
```typescript
// src/hooks/useSceneTransition.ts
// Smooth transitions between lobby and lesson/sandbox
// - Fade to black
// - Camera interpolation
// - Scene swap
// - Fade in
```

#### 4.5 UI Overlays (Diegetic)
- [ ] Floating labels on hover
- [ ] Mini tooltips
- [ ] Progress indicators
- [ ] "Press E to interact" prompts

### Deliverables
- [ ] Click terminal → transition to sandbox
- [ ] Click bookshelf → module browser modal
- [ ] Hover effects on all interactive objects
- [ ] Smooth camera transitions
- [ ] Back button returns to lobby

### Files to Create
```
src/components/three/Lobby/Terminal.tsx
src/components/three/Lobby/Bookshelf.tsx
src/components/three/Lobby/InteractiveObject.tsx
src/components/three/Lobby/HoverLabel.tsx
src/components/ui/ModuleBrowser.tsx
src/hooks/useSceneTransition.ts
src/hooks/useInteraction.ts
```

---

## Sprint 5: Sandbox - Part 1 (Week 5)

### Objective
Integrate Sandpack for in-browser coding.

### Tasks

#### 5.1 Sandpack Setup
```bash
npm install @codesandbox/sandpack-react
```

```typescript
// src/components/ui/Editor/SandpackEditor.tsx
import { Sandpack } from '@codesandbox/sandpack-react';

const r3fTemplate = {
  files: {
    '/App.tsx': appCode,
    '/Experience.tsx': experienceCode,
    '/index.tsx': indexCode,
  },
  customSetup: {
    dependencies: {
      'three': 'latest',
      '@react-three/fiber': 'latest',
      '@react-three/drei': 'latest',
    },
  },
};
```

#### 5.2 Editor Layout
```
┌──────────────────────────────────────────────────────────┐
│  [Files] [Run] [Reset] [Hint] [Solution]    [Back]       │
├─────────────────────────────┬────────────────────────────┤
│                             │                            │
│     Monaco Editor           │     3D Preview (iframe)    │
│     (Sandpack CodeEditor)   │     (Sandpack Preview)     │
│                             │                            │
├─────────────────────────────┴────────────────────────────┤
│  Console Output                                          │
└──────────────────────────────────────────────────────────┘
```

#### 5.3 Custom Theme
- [ ] Match Lumina dark theme
- [ ] Syntax highlighting for GLSL
- [ ] Custom font (JetBrains Mono)
- [ ] Line numbers
- [ ] Error highlighting

#### 5.4 Basic Controls
- [ ] Run button (hot reload is default)
- [ ] Reset to starter code
- [ ] Full screen preview toggle
- [ ] Split view resize

### Deliverables
- [ ] Sandpack editor rendering
- [ ] Code changes reflect in preview
- [ ] R3F template working
- [ ] Custom dark theme applied
- [ ] Resizable panels

### Files to Create
```
src/app/(app)/sandbox/page.tsx
src/components/ui/Editor/SandpackEditor.tsx
src/components/ui/Editor/EditorToolbar.tsx
src/components/ui/Editor/PreviewPanel.tsx
src/lib/sandpack/templates.ts
src/lib/sandpack/theme.ts
```

---

## Sprint 6: Sandbox - Part 2 (Week 6)

### Objective
Add console, validation, and assistance features.

### Tasks

#### 6.1 Console Panel
```typescript
// Capture console.log, warn, error from preview iframe
// Display with timestamps and log levels
// Clear button
// Filter by type
```

#### 6.2 Code Validation
```typescript
// src/lib/validation/codeValidator.ts
interface ValidationRule {
  id: string;
  pattern: RegExp | ((code: string) => boolean);
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// Check for required elements in exercises
const sceneValidation: ValidationRule[] = [
  {
    id: 'has-canvas',
    pattern: /<Canvas/,
    message: 'Missing <Canvas> component',
    severity: 'error',
  },
  // ...
];
```

#### 6.3 Hint System
- [ ] Hints stored per exercise
- [ ] Progressive reveal (hint 1, 2, 3...)
- [ ] Hints usage tracked in DB
- [ ] Visual indicator when hints available

#### 6.4 Solution Comparison
- [ ] "Show Solution" button
- [ ] Monaco diff view
- [ ] Syntax highlighting in diff
- [ ] Copy solution to clipboard

#### 6.5 Ghost Overlay (Visual Comparison)
```typescript
// Render solution scene to texture
// Overlay with adjustable opacity
// Slider control for compare
```

### Deliverables
- [ ] Console shows logs from preview
- [ ] Validation errors shown in editor
- [ ] Hint system working
- [ ] Diff view for solution
- [ ] Exercise pass/fail detection

### Files to Create
```
src/components/ui/Editor/Console.tsx
src/components/ui/Editor/HintPanel.tsx
src/components/ui/Editor/DiffView.tsx
src/components/three/Sandbox/GhostOverlay.tsx
src/lib/validation/codeValidator.ts
src/lib/validation/rules/index.ts
```

---

## Sprint 7: Curriculum Engine (Week 7)

### Objective
Build the lesson loading and progress tracking system.

### Tasks

#### 7.1 Lesson Data Structure
```typescript
// src/types/lesson.ts
interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;

  theory: {
    content: string;        // MDX content
    videoUrl?: string;
  };

  exercise: {
    instructions: string;
    starterCode: Record<string, string>;
    solutionCode: Record<string, string>;
    validationRules: string[];  // Rule IDs
    hints: string[];
  };

  rewards: {
    xp: number;
    achievements?: string[];
  };
}
```

#### 7.2 Content Loading
```typescript
// Load lessons from /content/curriculum/
// Support MDX for theory content
// Code blocks for starter/solution
// Frontmatter for metadata
```

#### 7.3 Progress API
```typescript
// POST /api/lessons/[id]/progress
// - Update lesson status
// - Record time spent
// - Track hints used

// POST /api/lessons/[id]/submit
// - Validate code submission
// - Award XP if passed
// - Check achievement triggers
```

#### 7.4 Lesson Page
```
┌──────────────────────────────────────────────────────────┐
│  Module: Foundations  >  Lesson 3: Scene Setup    [Back] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  THEORY                                                  │
│  ──────                                                  │
│  The Three.js scene is the container for all 3D         │
│  objects. Think of it as the "world" where everything   │
│  exists...                                               │
│                                                          │
│  [▶ Watch Video (5 min)]                                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  EXERCISE                                                │
│  ────────                                                │
│  Create a scene and add a red cube at position (0,1,0)  │
│                                                          │
│  [Launch Sandbox]                                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Progress: ████████░░ 80%              [Mark Complete]   │
└──────────────────────────────────────────────────────────┘
```

#### 7.5 Progress Persistence
- [ ] Auto-save on code change (debounced)
- [ ] Track time spent per lesson
- [ ] Sync across devices
- [ ] Offline support (local storage fallback)

### Deliverables
- [ ] Lesson content loads from files
- [ ] Theory renders with MDX
- [ ] Progress saves to Supabase
- [ ] Lesson completion updates user stats
- [ ] Resume from last position

### Files to Create
```
src/app/(app)/learn/[lessonId]/page.tsx
src/components/ui/Lesson/TheoryPanel.tsx
src/components/ui/Lesson/ExercisePanel.tsx
src/components/ui/Lesson/ProgressBar.tsx
src/lib/curriculum/loader.ts
src/lib/curriculum/progress.ts
src/app/api/lessons/[lessonId]/progress/route.ts
src/app/api/lessons/[lessonId]/submit/route.ts
content/curriculum/phase1/module1/lesson1.mdx
```

---

## Sprint 8: Phase 1 Content (Week 8)

### Objective
Create the first 8 Foundation lessons.

### Lessons to Create

#### Lesson 1: What is WebGL?
- Theory: GPU pipeline, vertices, fragments
- Exercise: None (theory only)
- Assets: Pipeline diagram

#### Lesson 2: Your First Triangle (Raw WebGL)
- Theory: Vertex buffers, shaders basics
- Exercise: Draw a colored triangle
- Validation: Canvas has content

#### Lesson 3: Three.js Introduction
- Theory: Scene, Camera, Renderer abstraction
- Exercise: Create minimal Three.js app
- Validation: Scene renders

#### Lesson 4: Geometries
- Theory: Built-in geometries, parameters
- Exercise: Create box, sphere, torus
- Validation: 3 meshes in scene

#### Lesson 5: Materials
- Theory: MeshBasicMaterial, MeshStandardMaterial
- Exercise: Apply different materials
- Validation: Material properties set

#### Lesson 6: The Scene Graph
- Theory: Parent/child relationships, transforms
- Exercise: Create rotating solar system
- Validation: Nested objects

#### Lesson 7: Animation Loop
- Theory: requestAnimationFrame, delta time
- Exercise: Animate rotation over time
- Validation: useFrame callback

#### Lesson 8: Project - Geometric Composition
- No new theory
- Create artistic composition with learned concepts
- Free-form validation (screenshot comparison)

### Deliverables
- [ ] 8 lessons with theory + exercises
- [ ] All validation rules working
- [ ] XP awards on completion
- [ ] Smooth progression through module

### Files to Create
```
content/curriculum/phase1/
├── module.json
├── lesson1-webgl-intro.mdx
├── lesson2-first-triangle.mdx
├── lesson3-threejs-intro.mdx
├── lesson4-geometries.mdx
├── lesson5-materials.mdx
├── lesson6-scene-graph.mdx
├── lesson7-animation-loop.mdx
└── lesson8-project.mdx
```

---

## Sprint 9: Gamification - Part 1 (Week 9)

### Objective
Implement XP system and achievements.

### Tasks

#### 9.1 XP System
```typescript
// src/lib/gamification/xp.ts
export const XP_REWARDS = {
  lessonComplete: 100,
  exerciseFirstTry: 50,
  noHintsBonus: 25,
  streakBonus: (days: number) => Math.min(days * 10, 100),
};

export function calculateLevelFromXP(totalXP: number): number {
  // Level 1: 0-99, Level 2: 100-249, Level 3: 250-499...
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}
```

#### 9.2 Achievement Definitions
```typescript
// src/lib/gamification/achievements.ts
export const ACHIEVEMENTS = [
  {
    id: 'first_render',
    name: 'Hello, World!',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50,
    trigger: { type: 'lesson_complete', count: 1 },
  },
  {
    id: 'week_streak',
    name: 'Dedicated Learner',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 200,
    trigger: { type: 'streak', days: 7 },
  },
  // ... more achievements
];
```

#### 9.3 Achievement Triggers
- [ ] On lesson complete
- [ ] On streak update
- [ ] On hint-free completion
- [ ] On module complete
- [ ] On first-try pass

#### 9.4 Toast Notifications
```typescript
// Animated toasts for:
// - XP gain: "+100 XP" with number animation
// - Level up: "Level 5!" with celebration
// - Achievement: Icon + name + description
```

#### 9.5 Profile Stats Display
- [ ] Current level with progress bar
- [ ] Total XP
- [ ] Current streak
- [ ] Lessons completed
- [ ] Achievement count

### Deliverables
- [ ] XP awards on lesson completion
- [ ] Level calculation and display
- [ ] Achievement unlocks trigger
- [ ] Toast notifications animate
- [ ] Stats visible in profile

### Files to Create
```
src/lib/gamification/xp.ts
src/lib/gamification/achievements.ts
src/lib/gamification/triggers.ts
src/components/ui/Toast/XPToast.tsx
src/components/ui/Toast/AchievementToast.tsx
src/components/ui/Toast/LevelUpToast.tsx
src/components/ui/Profile/StatsPanel.tsx
src/hooks/useAchievements.ts
src/app/api/achievements/unlock/route.ts
```

---

## Sprint 10: Gamification - Part 2 (Week 10)

### Objective
Create 3D Skill Tree and Trophy Shelf visualizations.

### Tasks

#### 10.1 Skill Tree Design
```typescript
// Procedural tree generation
// Each module = branch
// Each lesson = node on branch
// States: locked (grey), available (gold), completed (green), mastered (purple)
```

#### 10.2 Skill Tree Component
```typescript
// src/components/three/Lobby/SkillTree.tsx
// - Central trunk
// - Branches for each module
// - Nodes with glow effects
// - Click node to see lesson details
// - Animated growth when progress made
```

#### 10.3 Trophy Shelf
```typescript
// src/components/three/Lobby/TrophyShelf.tsx
// - Physical shelf model
// - Achievement trophies as 3D models
// - Empty slots for locked achievements
// - Hover to see details
// - Click for unlock animation replay
```

#### 10.4 Trophy Models
- [ ] Create/source 5 basic trophy GLBs
- [ ] Rarity-based materials (bronze, silver, gold, diamond)
- [ ] Particle effects for legendary

#### 10.5 Progress Animations
- [ ] Tree grows when lesson completed
- [ ] Trophy appears with flourish
- [ ] Level-up celebration effect
- [ ] Streak fire animation

### Deliverables
- [ ] 3D skill tree in lobby
- [ ] Tree reflects real progress
- [ ] Trophy shelf displays achievements
- [ ] Animations on state changes
- [ ] Interactive (click for details)

### Files to Create
```
src/components/three/Lobby/SkillTree.tsx
src/components/three/Lobby/SkillNode.tsx
src/components/three/Lobby/TrophyShelf.tsx
src/components/three/Lobby/Trophy.tsx
src/components/three/effects/GrowAnimation.tsx
src/components/three/effects/ParticleSystem.tsx
public/models/trophies/common.glb
public/models/trophies/rare.glb
public/models/trophies/epic.glb
public/models/trophies/legendary.glb
```

---

## Sprint 11: Phase 2 Content (Week 11)

### Objective
Create React Three Fiber curriculum (8 lessons).

### Lessons to Create

#### Lesson 1: Why React Three Fiber?
- Theory: Declarative vs imperative, React reconciler
- Exercise: Convert vanilla Three.js to R3F

#### Lesson 2: The Canvas Component
- Theory: Canvas props, WebGL context, color management
- Exercise: Configure Canvas with shadows, dpr

#### Lesson 3: Your First R3F Scene
- Theory: JSX elements map to Three.js objects
- Exercise: Create scene with multiple meshes

#### Lesson 4: useFrame Hook
- Theory: Animation loop in R3F, delta time
- Exercise: Rotate objects with useFrame

#### Lesson 5: useThree Hook
- Theory: Accessing renderer, camera, scene
- Exercise: Responsive camera adjustment

#### Lesson 6: Events System
- Theory: onClick, onPointerOver, raycasting
- Exercise: Interactive color-changing objects

#### Lesson 7: Loading Models
- Theory: useGLTF, useTexture, Suspense
- Exercise: Load and display GLTF model

#### Lesson 8: Project - Product Viewer
- No new theory
- Build interactive product configurator
- Change colors, rotate, zoom

### Deliverables
- [ ] 8 R3F lessons complete
- [ ] All exercises validated
- [ ] Module completion achievement
- [ ] Smooth progression

### Files to Create
```
content/curriculum/phase2/
├── module.json
├── lesson1-why-r3f.mdx
├── lesson2-canvas.mdx
├── lesson3-first-r3f-scene.mdx
├── lesson4-useframe.mdx
├── lesson5-usethree.mdx
├── lesson6-events.mdx
├── lesson7-loading-models.mdx
└── lesson8-product-viewer.mdx
```

---

## Sprint 12: Polish & Launch (Week 12)

### Objective
Performance optimization, testing, and deployment.

### Tasks

#### 12.1 Performance Optimization
- [ ] Code splitting (dynamic imports)
- [ ] Image optimization (next/image)
- [ ] Font optimization
- [ ] 3D asset compression
- [ ] Bundle analysis

#### 12.2 Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for API
- [ ] E2E tests (critical paths)
- [ ] Performance testing (Lighthouse)
- [ ] Cross-browser testing

#### 12.3 Error Handling
- [ ] Global error boundary
- [ ] Sentry integration
- [ ] Graceful degradation
- [ ] Offline support basics

#### 12.4 SEO & Meta
- [ ] Open Graph images
- [ ] Twitter cards
- [ ] Structured data
- [ ] Sitemap
- [ ] robots.txt

#### 12.5 Deployment
- [ ] Vercel configuration
- [ ] Environment variables
- [ ] Domain setup
- [ ] Analytics (PostHog/Plausible)
- [ ] Monitoring

#### 12.6 Documentation
- [ ] README with setup instructions
- [ ] Contributing guide
- [ ] Architecture overview
- [ ] API documentation

### Deliverables
- [ ] Production deployment live
- [ ] Core Web Vitals passing
- [ ] No critical bugs
- [ ] Monitoring in place
- [ ] Launch announcement ready

### Files to Create
```
.env.example
vercel.json
README.md
CONTRIBUTING.md
docs/architecture.md
docs/api.md
tests/
├── unit/
├── integration/
└── e2e/
```

---

## Post-MVP Roadmap

After the initial 12-week sprint, consider:

### Phase 2 (Months 4-6)
- Phases 3-4 curriculum (Ecosystem + Shaders)
- Multiplayer lobby (see other students)
- Discord integration
- AI code assistant

### Phase 3 (Months 7-9)
- Phases 5-6 curriculum (Physics + Production)
- Asset optimization pipeline
- Custom project hosting
- Certification system

### Phase 4 (Months 10-12)
- Mobile optimization
- Enterprise features
- Community features
- Monetization

---

## Sprint Tracking Template

For each sprint, track:

```markdown
## Sprint N: [Name]

### Status: 🟡 In Progress / 🟢 Complete / 🔴 Blocked

### Completed
- [x] Task 1
- [x] Task 2

### In Progress
- [ ] Task 3

### Blocked
- [ ] Task 4 (reason)

### Notes
- Any decisions made
- Blockers encountered
- Scope changes

### Demo
- Link to deployed preview
- Screenshots/recordings
```
