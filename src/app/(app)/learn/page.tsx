'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BookOpen, Lock, Play, CheckCircle } from 'lucide-react';

// Placeholder curriculum data
const phases = [
  {
    id: 1,
    title: 'Foundations',
    description: 'Learn the basics of WebGL and Three.js',
    unlocked: true,
    lessons: [
      { id: 1, title: 'What is WebGL?', completed: false, unlocked: true },
      { id: 2, title: 'Your First Scene', completed: false, unlocked: true },
      { id: 3, title: 'Meshes & Geometries', completed: false, unlocked: false },
      { id: 4, title: 'Materials & Textures', completed: false, unlocked: false },
      { id: 5, title: 'Lights & Shadows', completed: false, unlocked: false },
      { id: 6, title: 'Camera Controls', completed: false, unlocked: false },
      { id: 7, title: 'Animation Basics', completed: false, unlocked: false },
      { id: 8, title: 'Project: Solar System', completed: false, unlocked: false },
    ],
  },
  {
    id: 2,
    title: 'React Three Fiber',
    description: 'Build 3D experiences with React',
    unlocked: false,
    lessons: [],
  },
  {
    id: 3,
    title: 'The Ecosystem',
    description: 'Drei, Postprocessing, and more',
    unlocked: false,
    lessons: [],
  },
  {
    id: 4,
    title: 'Shaders & WebGPU',
    description: 'Advanced graphics programming',
    unlocked: false,
    lessons: [],
  },
  {
    id: 5,
    title: 'Physics & Games',
    description: 'Interactive experiences with Rapier',
    unlocked: false,
    lessons: [],
  },
  {
    id: 6,
    title: 'Production',
    description: 'Optimization and deployment',
    unlocked: false,
    lessons: [],
  },
];

export default function LearnPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Learning Path</h1>
          <p className="text-[var(--color-muted)]">
            Master 3D web development step by step
          </p>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-8">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={`rounded-2xl border ${
              phase.unlocked
                ? 'bg-[var(--color-card)] border-[var(--color-border)]'
                : 'bg-[var(--color-card)]/50 border-[var(--color-border)]/50 opacity-60'
            }`}
          >
            {/* Phase Header */}
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      phase.unlocked
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {phase.unlocked ? (
                      <BookOpen className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      Phase {phase.id}: {phase.title}
                    </h2>
                    <p className="text-[var(--color-muted)]">{phase.description}</p>
                  </div>
                </div>
                {!phase.unlocked && (
                  <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-sm">
                    Locked
                  </span>
                )}
              </div>
            </div>

            {/* Lessons */}
            {phase.unlocked && phase.lessons.length > 0 && (
              <div className="p-6">
                <div className="grid gap-3">
                  {phase.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={
                        lesson.unlocked
                          ? `/learn/phase${phase.id}/lesson${lesson.id}`
                          : '#'
                      }
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                        lesson.unlocked
                          ? 'bg-[var(--color-background)] hover:bg-[var(--color-border)]/30 cursor-pointer'
                          : 'bg-[var(--color-background)]/50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            lesson.completed
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : lesson.unlocked
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : lesson.unlocked ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {phase.id}.{lesson.id} - {lesson.title}
                          </p>
                        </div>
                      </div>
                      {lesson.unlocked && !lesson.completed && (
                        <span className="text-sm text-indigo-400">Start →</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
