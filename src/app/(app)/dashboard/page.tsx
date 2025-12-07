'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  Sparkles,
  Trophy,
  Flame,
  BookOpen,
  ArrowRight,
  Play,
  Target,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - will be replaced with real data from Supabase
  const stats = {
    level: 1,
    currentXp: 0,
    totalXp: 0,
    streak: 0,
    lessonsCompleted: 0,
    achievements: 0,
  };

  const xpProgress = {
    current: 0,
    required: 100,
    percentage: 0,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.user_metadata?.avatar_url}
            alt={user?.user_metadata?.full_name || 'User'}
            size="xl"
          />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Explorer'}!
            </h1>
            <p className="text-[var(--color-muted)]">
              Ready to continue your 3D journey?
            </p>
          </div>
        </div>

        <Link href="/lobby">
          <Button size="lg" className="group">
            Enter the Lobby
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Level */}
        <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-[var(--color-muted)]">Level</span>
          </div>
          <p className="text-3xl font-bold">{stats.level}</p>
          <div className="mt-2">
            <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              {xpProgress.current} / {xpProgress.required} XP
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-[var(--color-muted)]">Streak</span>
          </div>
          <p className="text-3xl font-bold">{stats.streak}</p>
          <p className="text-xs text-[var(--color-muted)] mt-1">days</p>
        </div>

        {/* Lessons */}
        <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-[var(--color-muted)]">Lessons</span>
          </div>
          <p className="text-3xl font-bold">{stats.lessonsCompleted}</p>
          <p className="text-xs text-[var(--color-muted)] mt-1">completed</p>
        </div>

        {/* Achievements */}
        <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-[var(--color-muted)]">Trophies</span>
          </div>
          <p className="text-3xl font-bold">{stats.achievements}</p>
          <p className="text-xs text-[var(--color-muted)] mt-1">earned</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Continue Learning */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold">Continue Learning</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Pick up where you left off
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-background)]/50 mb-4">
            <p className="text-sm text-[var(--color-muted)] mb-1">Next Lesson</p>
            <p className="font-medium">Phase 1: What is WebGL?</p>
          </div>

          <Link href="/learn/phase1/lesson1">
            <Button className="w-full">Start Lesson</Button>
          </Link>
        </div>

        {/* Sandbox */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold">Free Sandbox</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Experiment with Three.js
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--color-muted)] mb-4">
            Open the sandbox to write Three.js code, test ideas, and build
            projects outside the curriculum.
          </p>

          <Link href="/sandbox">
            <Button variant="secondary" className="w-full">
              Open Sandbox
            </Button>
          </Link>
        </div>
      </div>

      {/* Curriculum Overview */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Progress</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { phase: 1, title: 'Foundations', progress: 0, total: 8, unlocked: true },
            { phase: 2, title: 'React Three Fiber', progress: 0, total: 8, unlocked: false },
            { phase: 3, title: 'The Ecosystem', progress: 0, total: 8, unlocked: false },
            { phase: 4, title: 'Shaders & WebGPU', progress: 0, total: 10, unlocked: false },
            { phase: 5, title: 'Physics & Games', progress: 0, total: 8, unlocked: false },
            { phase: 6, title: 'Production', progress: 0, total: 8, unlocked: false },
          ].map((phase) => (
            <div
              key={phase.phase}
              className={`p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] ${
                !phase.unlocked ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {phase.phase}
                  </span>
                  <h3 className="font-medium">{phase.title}</h3>
                </div>
                {!phase.unlocked && (
                  <span className="text-xs text-[var(--color-muted)]">Locked</span>
                )}
              </div>

              <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(phase.progress / phase.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                {phase.progress} / {phase.total} lessons
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
