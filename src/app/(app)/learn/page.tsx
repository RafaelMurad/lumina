'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useProgress } from '@/hooks/useProgress';
import { useSubscription } from '@/hooks/useSubscription';
import { curriculum } from '@/content/curriculum';
import { ArrowLeft, BookOpen, Lock, Play, CheckCircle, Crown, Clock, Loader2 } from 'lucide-react';

export default function LearnPage() {
  const { lessonProgress, isLoading: progressLoading } = useProgress();
  const { checkPhaseAccess, isPro, isLoading: subscriptionLoading } = useSubscription();

  const isLoading = progressLoading || subscriptionLoading;

  // Calculate if a lesson is unlocked (all previous lessons completed OR first lesson of accessible phase)
  const isLessonUnlocked = (phaseId: number, lessonOrder: number, lessonId: string): boolean => {
    const hasAccess = checkPhaseAccess(phaseId);
    if (!hasAccess) return false;

    // First lesson of each phase is always unlocked if phase is accessible
    if (lessonOrder === 1) return true;

    // Otherwise, previous lesson must be completed
    const phase = curriculum.find(p => p.id === phaseId);
    if (!phase) return false;

    const prevLesson = phase.lessons.find(l => l.order === lessonOrder - 1);
    if (!prevLesson) return true;

    const prevProgress = lessonProgress[prevLesson.id];
    return prevProgress?.status === 'completed' || prevProgress?.status === 'mastered';
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    const progress = lessonProgress[lessonId];
    return progress?.status === 'completed' || progress?.status === 'mastered';
  };

  // Calculate phase progress
  const getPhaseProgress = (phaseId: number) => {
    const phase = curriculum.find(p => p.id === phaseId);
    if (!phase) return { completed: 0, total: 0 };

    const completed = phase.lessons.filter(l => isLessonCompleted(l.id)).length;
    return { completed, total: phase.lessons.length };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

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
        {curriculum.map((phase) => {
          const hasAccess = checkPhaseAccess(phase.id);
          const progress = getPhaseProgress(phase.id);
          const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border ${
                hasAccess
                  ? 'bg-[var(--color-card)] border-[var(--color-border)]'
                  : 'bg-[var(--color-card)]/50 border-[var(--color-border)]/50'
              }`}
            >
              {/* Phase Header */}
              <div className="p-6 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center`}
                      style={{
                        backgroundColor: hasAccess ? `${phase.color}20` : 'rgb(107 114 128 / 0.2)',
                        color: hasAccess ? phase.color : 'rgb(156 163 175)'
                      }}
                    >
                      {hasAccess ? (
                        <BookOpen className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        Phase {phase.id}: {phase.title}
                        {phase.id > 1 && !isPro && (
                          <Crown className="w-4 h-4 text-amber-400" />
                        )}
                      </h2>
                      <p className="text-[var(--color-muted)]">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {hasAccess && progress.total > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{progress.completed}/{progress.total} lessons</p>
                        <div className="w-32 h-2 bg-[var(--color-background)] rounded-full mt-1">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progressPercent}%`,
                              backgroundColor: phase.color
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {!hasAccess && (
                      <Link href="/pricing">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition-colors cursor-pointer">
                          Upgrade to Pro
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Lessons */}
              {phase.lessons.length > 0 && (
                <div className="p-6">
                  <div className="grid gap-3">
                    {phase.lessons.map((lesson) => {
                      const unlocked = isLessonUnlocked(phase.id, lesson.order, lesson.id);
                      const completed = isLessonCompleted(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={unlocked ? `/learn/phase${phase.id}/lesson${lesson.order}` : '#'}
                          className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                            unlocked
                              ? 'bg-[var(--color-background)] hover:bg-[var(--color-border)]/30 cursor-pointer'
                              : 'bg-[var(--color-background)]/50 cursor-not-allowed opacity-50'
                          }`}
                          onClick={(e) => !unlocked && e.preventDefault()}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                completed
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : unlocked
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : unlocked ? (
                                <Play className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {phase.id}.{lesson.order} - {lesson.title}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] mt-1">
                                <span className={`px-2 py-0.5 rounded ${
                                  lesson.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                  lesson.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {lesson.difficulty}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.estimatedMinutes} min
                                </span>
                                <span className="text-amber-400">+{lesson.rewards.xp} XP</span>
                              </div>
                            </div>
                          </div>
                          {unlocked && !completed && (
                            <span className="text-sm text-indigo-400">Start →</span>
                          )}
                          {completed && (
                            <span className="text-sm text-emerald-400">Review →</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty Phase Placeholder */}
              {phase.lessons.length === 0 && (
                <div className="p-6 text-center text-[var(--color-muted)]">
                  <p>Lessons coming soon...</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
