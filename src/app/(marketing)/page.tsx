import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Code2,
  Gamepad2,
  Layers,
  Zap,
  BookOpen,
  Trophy,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-400">
              Learn Inside the Medium
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              3D Web Development
            </span>
            <br />
            Through Immersion
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10">
            Learn Three.js, React Three Fiber, and WebGL by navigating a 3D
            world. Write code that matters. Build experiences that inspire.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="group">
                Start Learning Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="secondary" size="lg">
                View Curriculum
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-16 text-[var(--color-muted)]">
            <div>
              <p className="text-3xl font-bold text-[var(--color-foreground)]">
                50+
              </p>
              <p className="text-sm">Lessons</p>
            </div>
            <div className="w-px h-10 bg-[var(--color-border)]" />
            <div>
              <p className="text-3xl font-bold text-[var(--color-foreground)]">
                6
              </p>
              <p className="text-sm">Phases</p>
            </div>
            <div className="w-px h-10 bg-[var(--color-border)]" />
            <div>
              <p className="text-3xl font-bold text-[var(--color-foreground)]">
                100%
              </p>
              <p className="text-sm">Interactive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Lumina is Different
          </h2>
          <p className="text-center text-[var(--color-muted)] mb-12 max-w-2xl mx-auto">
            Traditional courses show you videos. Lumina puts you inside a 3D
            world where every interaction teaches you something new.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Spatial Lobby</h3>
              <p className="text-[var(--color-muted)]">
                Navigate a 3D environment to access lessons. Click on objects,
                explore spaces, and learn by doing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Code Sandbox</h3>
              <p className="text-[var(--color-muted)]">
                Write real code in the browser with instant 3D preview. Full npm
                support, TypeScript, and Three.js built-in.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3D Skill Tree</h3>
              <p className="text-[var(--color-muted)]">
                Watch your knowledge grow as a procedural 3D tree. Unlock
                achievements displayed on a trophy shelf.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">WebGPU Ready</h3>
              <p className="text-[var(--color-muted)]">
                Learn the future of web graphics with TSL (Three Shading
                Language) that compiles to both WebGL and WebGPU.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-rose-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Physics Engine</h3>
              <p className="text-[var(--color-muted)]">
                Build games and interactive experiences with Rapier physics.
                Create character controllers, rigid bodies, and more.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Structured Path</h3>
              <p className="text-[var(--color-muted)]">
                From WebGL fundamentals to production optimization. 6 phases, 50+
                lessons, all connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="py-20 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            The Learning Path
          </h2>
          <p className="text-center text-[var(--color-muted)] mb-12 max-w-2xl mx-auto">
            A structured curriculum taking you from zero to production-ready 3D
            developer.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                phase: 1,
                title: 'Foundations',
                lessons: 8,
                color: 'indigo',
              },
              {
                phase: 2,
                title: 'React Three Fiber',
                lessons: 8,
                color: 'purple',
              },
              {
                phase: 3,
                title: 'The Ecosystem',
                lessons: 8,
                color: 'cyan',
              },
              {
                phase: 4,
                title: 'Shaders & WebGPU',
                lessons: 10,
                color: 'amber',
              },
              {
                phase: 5,
                title: 'Physics & Games',
                lessons: 8,
                color: 'rose',
              },
              {
                phase: 6,
                title: 'Production',
                lessons: 8,
                color: 'emerald',
              },
            ].map((phase) => (
              <div
                key={phase.phase}
                className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`w-8 h-8 rounded-lg bg-${phase.color}-500/10 flex items-center justify-center text-${phase.color}-400 font-bold text-sm`}
                  >
                    {phase.phase}
                  </span>
                  <h3 className="font-semibold">{phase.title}</h3>
                </div>
                <p className="text-sm text-[var(--color-muted)]">
                  {phase.lessons} lessons
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Enter the 3D World?
          </h2>
          <p className="text-[var(--color-muted)] mb-8">
            Start your journey today. The first phase is completely free.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold">Lumina</span>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Built with Three.js, React Three Fiber, and Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
