# Lumina MVP Roadmap

## Overview

This roadmap outlines the path from current prototype to monetizable MVP. Organized by priority and dependency order.

---

## Phase 1: Infrastructure (Foundation)

**Goal**: Real authentication, database, and deployment

### 1.1 Supabase Setup
- [ ] Create production Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations (schema already exists in `/supabase/migrations/`)
- [ ] Enable Row Level Security (RLS) policies
- [ ] Set up database backups

### 1.2 Authentication
- [ ] Configure OAuth providers:
  - [ ] GitHub (primary - developer audience)
  - [ ] Google (broad reach)
  - [ ] Email/password (fallback)
- [ ] Implement proper session management
- [ ] Add email verification flow
- [ ] Create password reset flow
- [ ] Migrate guest progress to account on signup

### 1.3 Deployment
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up preview deployments
- [ ] Configure custom domain
- [ ] Enable Vercel Analytics

**Deliverable**: Users can sign up, log in, and their progress persists

---

## Phase 2: Monetization (Revenue)

**Goal**: Accept payments and gate premium content

### 2.1 Pricing Strategy
```
Free Tier:
- Phase 1 lessons (WebGL Foundations)
- Guest mode with localStorage
- Basic sandbox

Pro Tier ($19/month or $149/year):
- All phases unlocked
- Advanced sandbox features
- Priority support
- Certificates of completion
- Discord community access
```

### 2.2 Stripe Integration
- [ ] Create Stripe account and products
- [ ] Install dependencies:
  ```bash
  npm install stripe @stripe/stripe-js
  ```
- [ ] Create pricing page component
- [ ] Implement checkout flow
- [ ] Set up Stripe webhooks for:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_failed`
- [ ] Store subscription status in Supabase
- [ ] Create subscription management portal

### 2.3 Access Control
- [ ] Create subscription check middleware
- [ ] Gate premium lessons by subscription status
- [ ] Show upgrade prompts on locked content
- [ ] Handle expired subscriptions gracefully

### 2.4 Database Schema Addition
```sql
-- Add to existing schema
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
  plan TEXT NOT NULL, -- 'monthly', 'yearly'
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
```

**Deliverable**: Users can subscribe and access premium content

---

## Phase 3: Content (Value)

**Goal**: Enough content to justify subscription

### 3.1 Curriculum Expansion

#### Phase 1: WebGL Foundations (Free) - 8 lessons
- [x] What is WebGL?
- [x] Your First Scene
- [x] Geometries
- [x] Materials & Textures
- [x] Lighting
- [ ] Animation Basics
- [ ] Camera Controls
- [ ] Loading 3D Models

#### Phase 2: React Three Fiber (Pro) - 8 lessons
- [x] Why React Three Fiber?
- [x] Your First R3F Scene
- [x] The useFrame Hook
- [ ] Events & Interactions
- [ ] Using Drei Helpers
- [ ] Performance Optimization
- [ ] Post-Processing Effects
- [ ] Physics with Rapier

#### Phase 3: Advanced Techniques (Pro) - 8 lessons
- [ ] Custom Shaders (GLSL)
- [ ] Shader Materials in R3F
- [ ] Instanced Rendering
- [ ] GPU Particles
- [ ] Environment & HDR
- [ ] Realistic Materials (PBR)
- [ ] Shadows Deep Dive
- [ ] WebGPU Introduction

#### Phase 4: Real-World Projects (Pro) - 6 lessons
- [ ] Product Configurator
- [ ] Interactive Data Visualization
- [ ] Portfolio Website
- [ ] Game Prototype
- [ ] AR/VR Basics
- [ ] Deployment & Optimization

### 3.2 Content Quality
- [ ] Each lesson needs:
  - Theory section with code examples
  - Interactive exercise with hints
  - Solution code
  - XP rewards calibrated to difficulty
- [ ] Add video walkthroughs (optional, Phase 2)
- [ ] Create downloadable resources

**Deliverable**: 30 lessons across 4 phases

---

## Phase 4: Polish (Trust)

**Goal**: Production-quality user experience

### 4.1 Error Handling
- [ ] Add React Error Boundaries
- [ ] Implement toast notifications for errors
- [ ] Create fallback UI for 3D failures
- [ ] Add retry logic for API calls
- [ ] Log errors to monitoring service

### 4.2 Testing
- [ ] Set up Vitest for unit tests
- [ ] Add tests for:
  - [ ] XP calculation
  - [ ] Achievement triggers
  - [ ] Level progression
  - [ ] Auth flows
- [ ] Set up Playwright for E2E tests
- [ ] Add tests for:
  - [ ] User signup/login
  - [ ] Lesson completion
  - [ ] Payment flow (test mode)
- [ ] Aim for 70%+ coverage on critical paths

### 4.3 Monitoring
- [ ] Set up Sentry for error tracking
- [ ] Add performance monitoring
- [ ] Create health check endpoint
- [ ] Set up uptime monitoring (e.g., BetterStack)

### 4.4 Security
- [ ] Security audit of auth flows
- [ ] Add rate limiting to API routes
- [ ] Implement CSRF protection
- [ ] Validate all user inputs
- [ ] Set up Content Security Policy

### 4.5 Legal
- [ ] Create Terms of Service
- [ ] Create Privacy Policy
- [ ] Add cookie consent banner
- [ ] GDPR compliance (data export/deletion)

**Deliverable**: Production-ready, trustworthy application

---

## Phase 5: Growth (Scale)

**Goal**: Acquire and retain users

### 5.1 SEO & Marketing Pages
- [ ] Optimize meta tags
- [ ] Create landing page with benefits
- [ ] Add testimonials section
- [ ] Create blog for content marketing
- [ ] Add structured data (JSON-LD)

### 5.2 User Engagement
- [ ] Email onboarding sequence
- [ ] Weekly progress emails
- [ ] Achievement notification emails
- [ ] Re-engagement emails for inactive users

### 5.3 Community
- [ ] Create Discord server
- [ ] Add link in dashboard
- [ ] Set up showcase channel for projects
- [ ] Q&A and support channels

### 5.4 Analytics
- [ ] Track key metrics:
  - [ ] Signup conversion
  - [ ] Free to paid conversion
  - [ ] Lesson completion rates
  - [ ] Churn rate
- [ ] Set up analytics dashboard

**Deliverable**: Sustainable growth engine

---

## Implementation Priority

```
Week 1-2: Phase 1 (Infrastructure)
├── Supabase production setup
├── OAuth configuration
└── Vercel deployment

Week 3-4: Phase 2 (Monetization)
├── Stripe integration
├── Subscription flow
└── Access control

Week 5-6: Phase 3 (Content)
├── Complete Phase 1 lessons (3 more)
├── Complete Phase 2 lessons (5 more)
└── Start Phase 3 lessons

Week 7-8: Phase 4 (Polish)
├── Error handling
├── Testing setup
├── Security review
└── Legal pages

Week 9+: Phase 5 (Growth)
├── Marketing pages
├── Email sequences
└── Analytics
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| 3D | Three.js + React Three Fiber |
| Editor | Sandpack |
| Auth | Supabase Auth |
| Database | Supabase (Postgres) |
| Payments | Stripe |
| Hosting | Vercel |
| Monitoring | Sentry |
| Analytics | Vercel Analytics + PostHog |
| Email | Resend |

---

## Cost Estimates (Monthly)

| Service | Free Tier | Paid (at scale) |
|---------|-----------|-----------------|
| Vercel | $0 | $20/mo |
| Supabase | $0 (500MB) | $25/mo |
| Stripe | 2.9% + $0.30/txn | Same |
| Sentry | $0 (5k errors) | $26/mo |
| Resend | $0 (3k emails) | $20/mo |
| Domain | - | $15/yr |
| **Total** | **~$0** | **~$100/mo** |

Break-even: ~6 subscribers at $19/mo

---

## Success Metrics

### MVP Launch (Week 8)
- [ ] 100 signups
- [ ] 10 paid subscribers
- [ ] <1% error rate
- [ ] >50% lesson completion rate (Phase 1)

### Month 3
- [ ] 500 signups
- [ ] 50 paid subscribers ($950 MRR)
- [ ] 30 lessons published
- [ ] NPS > 40

### Month 6
- [ ] 2000 signups
- [ ] 200 paid subscribers ($3800 MRR)
- [ ] All 30 lessons complete
- [ ] Mobile-responsive

---

## Next Immediate Steps

1. **Create Supabase project** at supabase.com
2. **Configure OAuth** (GitHub first)
3. **Deploy to Vercel** for testing
4. **Create Stripe account** and test products
5. **Write 3 more Phase 1 lessons** to complete free tier
