# Lumina - Product Requirements Document v1.0

## Immersive Spatial Learning Environment for WebGL/WebGPU & Three.js

---

## 1. Product Vision

**Lumina** is a next-generation educational platform that teaches WebGL, WebGPU, Three.js, and React Three Fiber through an immersive 3D experience. Unlike traditional video courses or documentation, Lumina embodies its subject matter—users learn 3D graphics by navigating a 3D world.

### Core Philosophy: "Learn Inside the Medium"

- **Immersive Context**: Navigate a 3D environment to access lessons
- **Active Recall**: Write code to progress, not just watch videos
- **Curated Authority**: Structured curriculum aligned with official docs
- **Visual Feedback**: 3D skill trees, trophy shelves, and spatial progress

---

## 2. Technology Stack (Latest Versions - December 2025)

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x (App Router) | Framework with RSC, streaming, turbopack |
| React | 19.x | UI library with concurrent features |
| TypeScript | 5.7.x | Type safety |
| Three.js | r170+ | 3D graphics engine |
| React Three Fiber | 9.x | React renderer for Three.js |
| @react-three/drei | 9.x | R3F helpers and abstractions |
| @react-three/rapier | 2.x | Physics engine (Rapier 3D) |
| @react-three/postprocessing | 3.x | Post-processing effects |
| Zustand | 5.x | State management |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.x | Animations |
| Sandpack | 2.x | In-browser code editor/bundler |

### Backend & Infrastructure
| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase | Latest | Database, Auth, Realtime, Storage |
| PostgreSQL | 15+ | Primary database (via Supabase) |
| Edge Functions | Deno | Serverless compute |
| Vercel | Latest | Deployment & edge network |

### 3D Asset Pipeline
| Tool | Purpose |
|------|---------|
| gltf-transform | Model optimization |
| Draco | Geometry compression |
| KTX2/Basis | Texture compression |
| HDRI Haven | Environment maps |

---

## 3. Feature Specifications

### 3.1 The 3D Spatial Lobby ("Developer's Loft")

A high-fidelity 3D environment serving as the main navigation hub.

#### Environment Design
```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPER'S LOFT                         │
│                                                             │
│   ┌─────────┐                              ┌─────────────┐  │
│   │ TROPHY  │                              │   SKILL     │  │
│   │  SHELF  │                              │    TREE     │  │
│   │ (Badges)│                              │ (Progress)  │  │
│   └─────────┘                              └─────────────┘  │
│                                                             │
│              ┌───────────────────────┐                      │
│              │    CODE TERMINAL      │                      │
│              │   (Click to Enter     │                      │
│              │    Sandbox Mode)      │                      │
│              └───────────────────────┘                      │
│                                                             │
│   ┌─────────┐                              ┌─────────────┐  │
│   │BOOKSHELF│                              │ WHITEBOARD  │  │
│   │(Modules)│                              │  (Theory)   │  │
│   └─────────┘                              └─────────────┘  │
│                                                             │
│                    [AVATAR]                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Interactive Elements
| Element | Interaction | Function |
|---------|-------------|----------|
| Code Terminal | Click → Camera zoom | Opens Sandpack coding environment |
| Bookshelf | Click book → Modal | Browse curriculum modules |
| Whiteboard | Click → Focus mode | View theory/diagrams |
| Trophy Shelf | Hover → Inspect | View earned achievements (3D models) |
| Skill Tree | Rotate → Explore | Visualize learning progress |
| Window | Look through | Shows real-time WebGPU demos |

#### Navigation System
- **Point-and-Click**: Raycast to floor NavMesh, avatar walks to point
- **Keyboard (WASD)**: Optional FPS-lite controls for gamers
- **Camera Transitions**: Smooth interpolation using GSAP or maath
- **Accessibility**: Tab navigation for keyboard-only users

#### Performance Tiers
```typescript
type PerformanceTier = 'ultra' | 'balanced' | 'minimal';

const tierConfigs = {
  ultra: {
    dpr: [1.5, 2],
    shadows: 'soft',
    postProcessing: ['bloom', 'ssao', 'dof'],
    textures: '2k',
  },
  balanced: {
    dpr: [1, 1.5],
    shadows: 'basic',
    postProcessing: ['bloom'],
    textures: '1k',
  },
  minimal: {
    dpr: [0.75, 1],
    shadows: false,
    postProcessing: [],
    textures: '512',
    frameloop: 'demand',
  },
};
```

---

### 3.2 Enhanced Sandbox (Sandpack + R3F)

A professional-grade coding environment embedded in the 3D world.

#### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    SANDBOX VIEW                              │
├─────────────────────────────┬───────────────────────────────┤
│                             │                               │
│     CODE EDITOR             │      3D PREVIEW               │
│     (Monaco/Sandpack)       │      (Live R3F Canvas)        │
│                             │                               │
│  ┌───────────────────────┐  │  ┌─────────────────────────┐  │
│  │ // Your code here     │  │  │                         │  │
│  │ <Canvas>              │  │  │    [Live 3D Scene]      │  │
│  │   <mesh>              │  │  │                         │  │
│  │     <boxGeometry />   │  │  │                         │  │
│  │   </mesh>             │  │  │                         │  │
│  │ </Canvas>             │  │  │                         │  │
│  └───────────────────────┘  │  └─────────────────────────┘  │
│                             │                               │
├─────────────────────────────┴───────────────────────────────┤
│  [Run] [Reset] [Hint] [Solution] [Share]    Console ▼       │
└─────────────────────────────────────────────────────────────┘
```

#### Features
| Feature | Implementation |
|---------|----------------|
| **Live Preview** | Sandpack bundler with Three.js/R3F pre-configured |
| **Multi-file Support** | Tabs for Experience.tsx, Model.tsx, store.ts |
| **NPM Packages** | drei, rapier, postprocessing, leva, gsap |
| **TypeScript** | Full type checking with Three.js types |
| **Auto-save** | Debounced save to Supabase |
| **Code Diff** | Monaco diff view against solution |
| **Ghost Overlay** | Solution scene rendered as semi-transparent overlay |
| **Leva Controls** | Runtime parameter tweaking |
| **Console Panel** | Captured logs, errors, warnings |
| **Share** | Generate shareable link or Discord post |

#### Code Templates
```typescript
// Starter template for each lesson type
const templates = {
  vanilla: {
    files: {
      'index.js': vanillaThreeTemplate,
      'style.css': basicStyles,
    },
    dependencies: { three: 'latest' },
  },
  r3f: {
    files: {
      'App.tsx': r3fTemplate,
      'Experience.tsx': experienceTemplate,
      'index.tsx': entryTemplate,
    },
    dependencies: {
      three: 'latest',
      '@react-three/fiber': 'latest',
      '@react-three/drei': 'latest',
    },
  },
  shader: {
    files: {
      'App.tsx': shaderTemplate,
      'shaders/vertex.glsl': vertexShader,
      'shaders/fragment.glsl': fragmentShader,
    },
    dependencies: {
      three: 'latest',
      '@react-three/fiber': 'latest',
      'glslify': 'latest',
    },
  },
};
```

---

### 3.3 Curriculum Structure

A comprehensive learning path from zero to mastery.

#### Phase Overview
```
PHASE 1: Foundations          PHASE 2: React Three Fiber
├── The Render Pipeline       ├── Thinking in Components
├── Scene, Camera, Renderer   ├── The R3F Canvas
├── Geometries & Meshes       ├── Events & Interactions
├── Materials Deep Dive       ├── Hooks (useFrame, useThree)
└── The Animation Loop        └── Loading Models (GLTF)

PHASE 3: The Ecosystem        PHASE 4: Shaders & WebGPU
├── Drei Helpers              ├── GLSL Fundamentals
├── Environment & Lighting    ├── Vertex Shaders
├── Camera Controls           ├── Fragment Shaders
├── Text & HTML in 3D         ├── TSL (Three Shading Language)
└── Post-Processing           └── WebGPU Compute

PHASE 5: Physics & Games      PHASE 6: Production
├── Rapier Physics Engine     ├── Performance Profiling
├── Rigid Bodies & Colliders  ├── Instancing & LOD
├── Character Controllers     ├── Asset Optimization
├── Sensors & Triggers        ├── Deployment Strategies
└── Game State Patterns       └── Accessibility
```

#### Lesson Structure
```typescript
interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;

  // Content
  theory: {
    video?: string;          // Optional video URL
    markdown: string;        // Theory content
    diagrams: string[];      // SVG/image URLs
  };

  // Exercise
  exercise: {
    instructions: string;
    starterCode: Record<string, string>;
    solutionCode: Record<string, string>;
    validationRules: ValidationRule[];
    hints: string[];
  };

  // Gamification
  rewards: {
    xp: number;
    achievements?: string[];
    unlocks?: string[];
  };
}
```

#### Module Breakdown

**Phase 1: Foundations (8 lessons)**
1. What is WebGL? The GPU Pipeline
2. Your First Triangle (Raw WebGL)
3. Three.js: Scene, Camera, Renderer
4. Geometries: Boxes, Spheres, Planes
5. Materials: Basic, Standard, Physical
6. Meshes & The Scene Graph
7. The Animation Loop (requestAnimationFrame)
8. **Project**: Geometric Composition

**Phase 2: React Three Fiber (8 lessons)**
1. Why R3F? Declarative 3D
2. The Canvas Component
3. Your First R3F Scene
4. useFrame: The Animation Hook
5. useThree: Accessing Three.js
6. Events: onClick, onPointerOver
7. Loading GLTF Models
8. **Project**: Interactive Product Viewer

**Phase 3: The Ecosystem (8 lessons)**
1. Drei: OrbitControls, Stage
2. Environment Maps & HDRIs
3. Lighting: Ambient, Directional, Spot
4. Shadows Configuration
5. Text3D & Html Components
6. Float, MeshTransmission, MeshPortal
7. Post-Processing Effects
8. **Project**: Portfolio Scene

**Phase 4: Shaders (10 lessons)**
1. What is a Shader?
2. GLSL Syntax & Types
3. Vertex Shader: Positions
4. Fragment Shader: Colors
5. Uniforms & Varyings
6. Noise Functions
7. ShaderMaterial in R3F
8. TSL Introduction
9. WebGPU & WGSL
10. **Project**: Procedural Terrain

**Phase 5: Physics (8 lessons)**
1. Physics Engines Overview
2. Rapier: Setup & World
3. RigidBodies & Colliders
4. Forces & Impulses
5. Character Controllers
6. Sensors & Triggers
7. Joints & Constraints
8. **Project**: Mini-Golf Game

**Phase 6: Production (8 lessons)**
1. Performance Monitoring (r3f-perf)
2. InstancedMesh for Scale
3. Level of Detail (LOD)
4. Texture Optimization
5. GLTF Compression (Draco/Meshopt)
6. Code Splitting & Suspense
7. SEO & Accessibility
8. **Project**: Galaxy Visualization (1M particles)

---

### 3.4 Gamification System

#### 3D Skill Tree
A procedural, organic tree structure visualizing progress.

```typescript
interface SkillTreeNode {
  id: string;
  moduleId: string;
  position: [number, number, number];
  state: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
  children: string[];
}

// Visual States
const nodeVisuals = {
  locked: { color: '#4a4a4a', emissive: 0, scale: 0.5 },
  available: { color: '#ffd700', emissive: 0.2, scale: 0.8 },
  in_progress: { color: '#00ff88', emissive: 0.5, scale: 1.0, pulse: true },
  completed: { color: '#00ff88', emissive: 0.3, scale: 1.0 },
  mastered: { color: '#ff00ff', emissive: 0.8, scale: 1.2, particles: true },
};
```

#### Achievement System
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;           // 2D icon for notifications
  model: string;          // 3D GLB model for trophy shelf
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  trigger: AchievementTrigger;
  xpReward: number;
}

// Example Achievements
const achievements = [
  {
    id: 'first_render',
    name: 'Hello, World!',
    description: 'Render your first 3D scene',
    rarity: 'common',
    xpReward: 50,
  },
  {
    id: 'shader_wizard',
    name: 'Shader Wizard',
    description: 'Complete all shader lessons',
    rarity: 'epic',
    xpReward: 500,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a lesson in under 5 minutes',
    rarity: 'rare',
    xpReward: 100,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 lessons without using hints',
    rarity: 'legendary',
    xpReward: 1000,
  },
];
```

#### XP & Leveling
```typescript
interface UserProgress {
  level: number;
  currentXp: number;
  totalXp: number;
  streak: number;
  lessonsCompleted: string[];
  achievements: string[];
}

// XP Requirements (exponential curve)
const xpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

// XP Sources
const xpRewards = {
  lessonComplete: 100,
  exerciseFirstTry: 50,
  noHintsBonus: 25,
  streakBonus: (streak: number) => Math.min(streak * 10, 100),
  achievementBase: 50, // + rarity multiplier
};
```

#### Trophy Shelf (3D)
- Physical shelf in the Developer's Loft
- Each achievement is a 3D model (GLB)
- Hover to see achievement details
- Click to replay unlock animation
- "Empty slot" silhouettes for unearned trophies

---

## 4. Database Schema (Supabase/PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'mastered')),
  attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  best_score INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Code Submissions
CREATE TABLE code_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  code JSONB NOT NULL,  -- { filename: content }
  passed BOOLEAN DEFAULT FALSE,
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Saved Projects (Sandbox)
CREATE TABLE saved_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT,
  title TEXT NOT NULL,
  code JSONB NOT NULL,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- (Similar policies for other tables...)
```

---

## 5. API Routes (Next.js App Router)

```
/api
├── /auth
│   ├── /callback          # OAuth callback
│   └── /logout            # Clear session
├── /user
│   ├── /profile           # GET/PATCH profile
│   └── /progress          # GET progress summary
├── /lessons
│   ├── /[lessonId]        # GET lesson content
│   │   ├── /progress      # GET/POST lesson progress
│   │   ├── /submit        # POST code submission
│   │   └── /hint          # POST get hint (increments counter)
│   └── /completed         # GET all completed lessons
├── /achievements
│   ├── /                  # GET all user achievements
│   └── /unlock            # POST unlock achievement
├── /projects
│   ├── /                  # GET/POST saved projects
│   ├── /[projectId]       # GET/PATCH/DELETE project
│   └── /share             # POST generate share link
└── /assets
    └── /optimize          # POST upload & optimize GLTF
```

---

## 6. Component Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/page.tsx
│   │   └── about/page.tsx
│   ├── (app)/                    # Authenticated app
│   │   ├── layout.tsx            # App shell
│   │   ├── lobby/page.tsx        # 3D Lobby
│   │   ├── learn/[lessonId]/page.tsx
│   │   ├── sandbox/page.tsx      # Free coding
│   │   └── profile/page.tsx
│   └── api/                      # API routes
├── components/
│   ├── three/                    # R3F Components
│   │   ├── Lobby/
│   │   │   ├── Lobby.tsx         # Main lobby scene
│   │   │   ├── Room.tsx          # Environment model
│   │   │   ├── Terminal.tsx      # Interactive computer
│   │   │   ├── Bookshelf.tsx     # Module navigation
│   │   │   ├── TrophyShelf.tsx   # Achievement display
│   │   │   ├── SkillTree.tsx     # Progress visualization
│   │   │   └── Avatar.tsx        # Player character
│   │   ├── Sandbox/
│   │   │   ├── PreviewCanvas.tsx # Live 3D preview
│   │   │   └── GhostOverlay.tsx  # Solution comparison
│   │   └── shared/
│   │       ├── PerformanceMonitor.tsx
│   │       ├── LoadingScreen.tsx
│   │       └── CameraController.tsx
│   ├── ui/                       # 2D UI Components
│   │   ├── Editor/
│   │   │   ├── SandpackEditor.tsx
│   │   │   ├── FileTree.tsx
│   │   │   └── Console.tsx
│   │   ├── Lesson/
│   │   │   ├── TheoryPanel.tsx
│   │   │   ├── InstructionsPanel.tsx
│   │   │   └── HintButton.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Toast.tsx
│   └── providers/
│       ├── AuthProvider.tsx
│       ├── ProgressProvider.tsx
│       └── ThreeProvider.tsx
├── hooks/
│   ├── useProgress.ts
│   ├── useAchievements.ts
│   ├── usePerformanceTier.ts
│   └── useLobbyNavigation.ts
├── stores/
│   ├── userStore.ts
│   ├── lessonStore.ts
│   └── sandboxStore.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── validation/
│   │   └── codeValidator.ts
│   └── utils/
│       ├── xp.ts
│       └── achievements.ts
├── content/
│   └── curriculum/
│       ├── phase1/
│       ├── phase2/
│       └── ...
└── types/
    ├── lesson.ts
    ├── user.ts
    └── three.ts
```

---

## 7. Non-Functional Requirements

### Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **3D Scene Load**: < 5s (with loading screen)
- **Frame Rate**: 60fps on Tier A/B, 30fps on Tier C
- **Bundle Size**: < 500KB initial JS (code-split 3D)

### Accessibility
- Keyboard navigation for all core functions
- Screen reader support for UI elements
- Reduced motion mode (disable 3D transitions)
- Color blind friendly palette
- Focus indicators

### Security
- Sandpack iframe isolation (different origin)
- RLS on all database tables
- Rate limiting on API routes
- Input sanitization
- CSP headers

### SEO
- Server-rendered marketing pages
- Dynamic OG images for shared projects
- Structured data for courses
- Sitemap generation

---

## 8. Success Metrics

### Engagement
- Daily Active Users (DAU)
- Lesson completion rate
- Average session duration
- Streak retention (7-day, 30-day)

### Learning
- Exercise pass rate
- Hints usage rate
- Time to completion per lesson
- Re-attempt frequency

### Technical
- Core Web Vitals scores
- Error rate (JS, API)
- 3D performance (FPS distribution)
- Load time percentiles

---

## 9. Future Considerations (Post-MVP)

- **Multiplayer Lobby**: See other students' avatars
- **Discord Integration**: Auto-role assignment, showcase sharing
- **AI Assistant**: Code hints powered by Claude
- **Custom Projects**: User-created levels/scenes
- **Certification**: Verified completion badges
- **Enterprise**: Team dashboards, custom curricula
- **Mobile**: Touch-optimized controls, PWA
