'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { useProgress } from '@/hooks/useProgress';
import { useSubscription } from '@/hooks/useSubscription';
import { getLessonByPhaseAndOrder, type Lesson } from '@/content/curriculum';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Loader2,
  BookOpen,
  Code,
  Trophy,
} from 'lucide-react';

// Dynamically import Sandpack
const SandpackEditor = dynamic(
  () =>
    import('@/components/ui/Editor/SandpackEditor').then(
      (mod) => mod.SandpackEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center bg-[#0a0a0f] rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    ),
  }
);

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { completeLesson, lessonProgress } = useProgress();
  const { checkPhaseAccess, isLoading: subscriptionLoading } = useSubscription();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise'>('theory');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<{
    xp: number;
    breakdown: { reason: string; amount: number }[];
    leveledUp?: boolean;
    newLevel?: number;
  } | null>(null);

  // Load lesson data and check access
  useEffect(() => {
    const phaseIdStr = params.phaseId as string;
    const lessonIdStr = params.lessonId as string;

    // Extract numbers from "phase1" and "lesson1" format
    const phaseId = parseInt(phaseIdStr.replace('phase', ''));
    const lessonOrder = parseInt(lessonIdStr.replace('lesson', ''));

    if (isNaN(phaseId) || isNaN(lessonOrder)) {
      router.push('/learn');
      return;
    }

    const lessonData = getLessonByPhaseAndOrder(phaseId, lessonOrder);
    if (!lessonData) {
      router.push('/learn');
      return;
    }

    setLesson(lessonData);

    // Check subscription access
    if (!subscriptionLoading) {
      const canAccess = checkPhaseAccess(phaseId);
      setHasAccess(canAccess);
    }
  }, [params, router, checkPhaseAccess, subscriptionLoading]);

  const handleComplete = async () => {
    if (!lesson) return;

    setIsCompleting(true);
    try {
      const result = await completeLesson(lesson.id, {
        hintsUsed,
        timeSpent: 300, // Mock time - would track actual time
        expectedTime: lesson.estimatedMinutes * 60,
      });

      setCompletionResult(result);
      setShowCompletionModal(true);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNextLesson = () => {
    if (!lesson) return;
    setShowCompletionModal(false);
    const nextOrder = lesson.order + 1;
    router.push(`/learn/phase${lesson.phaseId}/lesson${nextOrder}`);
  };

  const handleShowHint = () => {
    if (!lesson || hintsUsed >= lesson.exercise.hints.length) return;
    setHintsUsed((h) => h + 1);
    setShowHint(true);
  };

  if (!lesson || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Show upgrade prompt if user doesn't have access
  if (!hasAccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to lessons
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <UpgradePrompt
            phaseId={lesson.phaseId}
            feature={`Phase ${lesson.phaseId}: ${lesson.title}`}
          />
        </div>
      </div>
    );
  }

  const hasExercise = Object.keys(lesson.exercise.starterCode).length > 0;
  const currentProgress = lessonProgress[lesson.id];
  const isCompleted = currentProgress?.status === 'completed' || currentProgress?.status === 'mastered';

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((block, i) => {
        // Headers
        if (block.startsWith('# ')) {
          return (
            <h1 key={i} className="text-2xl font-bold mt-0 mb-4">
              {block.slice(2)}
            </h1>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="text-xl font-semibold mt-8 mb-4 text-indigo-400">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="text-lg font-medium mt-6 mb-3">
              {block.slice(4)}
            </h3>
          );
        }

        // Code blocks
        if (block.startsWith('```')) {
          const lines = block.split('\n');
          const code = lines.slice(1, -1).join('\n');
          return (
            <pre key={i} className="bg-[#0a0a0f] p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm text-gray-300">{code}</code>
            </pre>
          );
        }

        // List items
        if (block.match(/^[-*]\s/m)) {
          const items = block.split('\n').filter((line) => line.match(/^[-*]\s/));
          return (
            <ul key={i} className="list-disc list-inside mb-4 space-y-1">
              {items.map((item, j) => (
                <li key={j} className="text-gray-300">
                  {item.replace(/^[-*]\s/, '')}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered lists
        if (block.match(/^\d+\.\s/m)) {
          const items = block.split('\n').filter((line) => line.match(/^\d+\.\s/));
          return (
            <ol key={i} className="list-decimal list-inside mb-4 space-y-1">
              {items.map((item, j) => (
                <li key={j} className="text-gray-300">
                  {item.replace(/^\d+\.\s/, '')}
                </li>
              ))}
            </ol>
          );
        }

        // Regular paragraph with inline formatting
        let text = block;
        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
        // Inline code
        text = text.replace(
          /`([^`]+)`/g,
          '<code class="bg-[var(--color-background)] px-1.5 py-0.5 rounded text-indigo-400 text-sm">$1</code>'
        );

        return (
          <p
            key={i}
            className="mb-4 text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        );
      });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/learn">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <p className="text-sm text-[var(--color-muted)]">
              Phase {lesson.phaseId} • Lesson {lesson.order}
            </p>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      {/* Tab Switcher (only if has exercise) */}
      {hasExercise && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'theory'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-card)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Theory
          </button>
          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'exercise'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-card)]'
            }`}
          >
            <Code className="w-4 h-4" />
            Exercise
          </button>
        </div>
      )}

      {/* Theory Content */}
      {(activeTab === 'theory' || !hasExercise) && (
        <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="max-w-none">{renderContent(lesson.theory.content)}</div>

          {!hasExercise && (
            <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
              <Button onClick={handleComplete} isLoading={isCompleting} disabled={isCompleted}>
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </Button>
            </div>
          )}

          {hasExercise && (
            <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
              <Button onClick={() => setActiveTab('exercise')}>
                Continue to Exercise
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Exercise */}
      {activeTab === 'exercise' && hasExercise && (
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              Instructions
            </h3>
            <p className="text-[var(--color-muted)] whitespace-pre-line">
              {lesson.exercise.instructions}
            </p>
          </div>

          {/* Hints */}
          {lesson.exercise.hints.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowHint}
                disabled={hintsUsed >= lesson.exercise.hints.length}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Show Hint ({hintsUsed}/{lesson.exercise.hints.length})
              </Button>

              {showHint && hintsUsed > 0 && (
                <div className="flex-1 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
                  <p className="text-sm text-amber-400">
                    <strong>Hint {hintsUsed}:</strong> {lesson.exercise.hints[hintsUsed - 1]}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Code Editor */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
            <SandpackEditor
              template="vanilla"
              initialFiles={lesson.exercise.starterCode}
              showConsole={true}
              showFileExplorer={false}
            />
          </div>

          {/* Complete Button */}
          <div className="flex justify-end">
            <Button onClick={handleComplete} isLoading={isCompleting} disabled={isCompleted}>
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                'Complete Exercise'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && completionResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-card)] rounded-2xl p-8 max-w-md w-full border border-[var(--color-border)] text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
            <p className="text-[var(--color-muted)] mb-6">
              Great job completing &quot;{lesson.title}&quot;
            </p>

            {/* XP Breakdown */}
            <div className="bg-[var(--color-background)] rounded-xl p-4 mb-6">
              <div className="space-y-2">
                {completionResult.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">{item.reason}</span>
                    <span className="text-amber-400">+{item.amount} XP</span>
                  </div>
                ))}
                <div className="border-t border-[var(--color-border)] pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-amber-400">+{completionResult.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {completionResult.leveledUp && (
              <div className="bg-purple-500/20 rounded-lg px-4 py-3 mb-6">
                <p className="text-purple-400 font-medium">
                  Level Up! You&apos;re now level {completionResult.newLevel}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCompletionModal(false);
                  router.push('/learn');
                }}
                className="flex-1"
              >
                Back to Lessons
              </Button>
              <Button onClick={handleNextLesson} className="flex-1">
                Next Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
