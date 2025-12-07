'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Code, BookOpen, Play, CheckCircle } from 'lucide-react';

// Placeholder lesson content
const lessonContent: Record<string, { title: string; description: string; content: string[] }> = {
  'phase1-lesson1': {
    title: 'What is WebGL?',
    description: 'Understanding the foundation of 3D graphics on the web',
    content: [
      'WebGL (Web Graphics Library) is a JavaScript API that allows you to render 3D and 2D graphics in any compatible web browser.',
      'It provides a way to use the GPU (Graphics Processing Unit) directly from your browser, enabling high-performance graphics.',
      'WebGL is based on OpenGL ES, which is a subset of the desktop OpenGL API designed for embedded systems and mobile devices.',
      'Three.js is a popular library that abstracts away the complexity of raw WebGL, making it easier to create 3D scenes.',
    ],
  },
  'phase1-lesson2': {
    title: 'Your First Scene',
    description: 'Creating a basic Three.js scene with a rotating cube',
    content: [
      'Every Three.js scene requires three main components: a Scene, a Camera, and a Renderer.',
      'The Scene acts as a container for all your 3D objects, lights, and cameras.',
      'The Camera defines the viewpoint from which the scene is rendered.',
      'The Renderer draws the scene to the HTML canvas element.',
    ],
  },
};

export default function LessonPage() {
  const params = useParams();
  const phaseId = params.phaseId as string;
  const lessonId = params.lessonId as string;
  
  const lessonKey = `${phaseId}-${lessonId}`;
  const lesson = lessonContent[lessonKey] || {
    title: 'Lesson Coming Soon',
    description: 'This lesson is under development',
    content: ['Check back soon for the full lesson content!'],
  };

  const phaseNum = parseInt(phaseId.replace('phase', ''));
  const lessonNum = parseInt(lessonId.replace('lesson', ''));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-[var(--color-border)] bg-[var(--color-card)] p-6 flex flex-col">
        <Link href="/learn" className="mb-6">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Link>

        <div className="flex-1">
          <div className="mb-6">
            <p className="text-sm text-[var(--color-muted)] mb-1">
              Phase {phaseNum}
            </p>
            <h1 className="text-xl font-bold">{lesson.title}</h1>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              {lesson.description}
            </p>
          </div>

          {/* Lesson sections */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Theory</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-border)]/30 transition-colors cursor-pointer">
              <Code className="w-4 h-4 text-[var(--color-muted)]" />
              <span className="text-sm">Exercise</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-border)]/30 transition-colors cursor-pointer">
              <CheckCircle className="w-4 h-4 text-[var(--color-muted)]" />
              <span className="text-sm">Quiz</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-6 border-t border-[var(--color-border)] space-y-2">
          <Button variant="primary" className="w-full">
            Mark Complete
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
          <Link href={`/learn/phase${phaseNum}/lesson${lessonNum + 1}`}>
            <Button variant="secondary" className="w-full">
              Next Lesson
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">
              Lesson {phaseNum}.{lessonNum}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-2">{lesson.title}</h1>
            <p className="text-[var(--color-muted)]">{lesson.description}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            {lesson.content.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Placeholder for 3D preview */}
          <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Play className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">Interactive Demo</h3>
            </div>
            <div className="aspect-video rounded-xl bg-[var(--color-background)] flex items-center justify-center">
              <p className="text-[var(--color-muted)]">
                3D preview coming in Sprint 2
              </p>
            </div>
          </div>

          {/* Exercise teaser */}
          <div className="mt-8 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold">Try it Yourself</h3>
            </div>
            <p className="text-[var(--color-muted)] mb-4">
              Ready to practice? Open the sandbox and try what you&apos;ve learned.
            </p>
            <Link href="/sandbox">
              <Button>Open Sandbox</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
