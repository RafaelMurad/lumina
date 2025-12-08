'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useProgress } from '@/hooks/useProgress';
import { curriculum } from '@/content/curriculum';
import Link from 'next/link';
import { Award, Lock, Loader2, ArrowRight, Trophy } from 'lucide-react';

export default function CertificatesPage() {
  const { user, isGuest } = useAuth();
  const { lessonProgress, isLoading } = useProgress();

  // Calculate completion for each phase
  const phaseStatus = curriculum.map((phase) => {
    const completedCount = phase.lessons.filter((lesson) => {
      const lp = lessonProgress[lesson.id];
      return lp?.status === 'completed' || lp?.status === 'mastered';
    }).length;
    const totalCount = phase.lessons.length;
    const isCompleted = totalCount > 0 && completedCount === totalCount;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      ...phase,
      completedCount,
      totalCount,
      isCompleted,
      percentage,
    };
  });

  const earnedCertificates = phaseStatus.filter((p) => p.isCompleted);
  const inProgressCertificates = phaseStatus.filter((p) => !p.isCompleted && p.completedCount > 0);
  const lockedCertificates = phaseStatus.filter((p) => p.completedCount === 0);

  if (isGuest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Earn Certificates</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Sign up to track your progress and earn certificates for completing courses!
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Sign Up / Log In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Certificates
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          Complete courses to earn certificates and showcase your achievements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-xl p-4 border border-yellow-500/30">
          <Award className="w-6 h-6 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold">{earnedCertificates.length}</p>
          <p className="text-sm text-[var(--color-muted)]">Earned</p>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
          <Loader2 className="w-6 h-6 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold">{inProgressCertificates.length}</p>
          <p className="text-sm text-[var(--color-muted)]">In Progress</p>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
          <Lock className="w-6 h-6 text-[var(--color-muted)] mb-2" />
          <p className="text-2xl font-bold">{lockedCertificates.length}</p>
          <p className="text-sm text-[var(--color-muted)]">Locked</p>
        </div>
      </div>

      {/* Earned Certificates */}
      {earnedCertificates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Earned Certificates
          </h2>
          <div className="grid gap-4">
            {earnedCertificates.map((phase) => (
              <Link
                key={phase.id}
                href={`/certificate/${phase.id}`}
                className="group bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{phase.title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">
                        {phase.totalCount} lessons completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">View Certificate</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* In Progress */}
      {inProgressCertificates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-indigo-400" />
            In Progress
          </h2>
          <div className="grid gap-4">
            {inProgressCertificates.map((phase) => (
              <div
                key={phase.id}
                className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Award className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{phase.title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">
                        {phase.completedCount}/{phase.totalCount} lessons completed
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-indigo-400">{phase.percentage}%</span>
                </div>
                <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${phase.percentage}%` }}
                  />
                </div>
                <Link
                  href="/learn"
                  className="text-sm text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Continue learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {lockedCertificates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--color-muted)]" />
            Locked
          </h2>
          <div className="grid gap-4">
            {lockedCertificates.map((phase) => (
              <div
                key={phase.id}
                className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-card)] flex items-center justify-center">
                    <Lock className="w-7 h-7 text-[var(--color-muted)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{phase.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      Complete {phase.totalCount} lessons to earn this certificate
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {earnedCertificates.length === 0 && inProgressCertificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-[var(--color-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
          <p className="text-[var(--color-muted)] mb-6">
            Complete your first lesson to begin earning certificates!
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Start Learning
          </Link>
        </div>
      )}
    </div>
  );
}
