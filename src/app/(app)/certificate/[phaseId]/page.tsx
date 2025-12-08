'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useProgress } from '@/hooks/useProgress';
import { curriculum } from '@/content/curriculum';
import { Download, Share2, ArrowLeft, Loader2, Award, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { lessonProgress, isLoading } = useProgress();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const phaseId = parseInt(params.phaseId as string);
  const phase = curriculum.find((p) => p.id === phaseId);

  // Check if phase is completed
  const isPhaseCompleted = phase?.lessons.every((lesson) => {
    const lp = lessonProgress[lesson.id];
    return lp?.status === 'completed' || lp?.status === 'mastered';
  }) ?? false;

  const completedLessonsCount = phase?.lessons.filter((lesson) => {
    const lp = lessonProgress[lesson.id];
    return lp?.status === 'completed' || lp?.status === 'mastered';
  }).length ?? 0;

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);

    try {
      // Use html2canvas for generating image
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `lumina-certificate-phase-${phaseId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareText = `I just completed ${phase?.title} on Lumina! 🎉 Learning 3D web development with Three.js and React Three Fiber. Check it out at lumina.dev`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lumina Certificate',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      } catch {
        alert('Failed to copy share text');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Phase Not Found</h2>
          <p className="text-[var(--color-muted)] mb-4">This certificate doesn't exist.</p>
          <Link href="/learn" className="text-indigo-400 hover:underline">
            Back to Learning
          </Link>
        </div>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Earn Your Certificate</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Sign up to earn certificates for completing courses and share your achievements!
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

  if (!isPhaseCompleted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Complete the Phase</h2>
          <p className="text-[var(--color-muted)] mb-4">
            Complete all lessons in {phase.title} to earn your certificate.
          </p>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            Progress: {completedLessonsCount}/{phase.lessons.length} lessons completed
          </p>
          <div className="h-2 w-64 mx-auto bg-[var(--color-surface)] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${(completedLessonsCount / phase.lessons.length) * 100}%` }}
            />
          </div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning
        </Link>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div
        ref={certificateRef}
        className="bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] rounded-2xl p-12 border border-[var(--color-border)] relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              LUMINA
            </div>
          </div>

          {/* Certificate Title */}
          <h1 className="text-2xl text-[var(--color-muted)] mb-2">Certificate of Completion</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 rounded-full" />

          {/* Recipient */}
          <p className="text-lg text-[var(--color-muted)] mb-2">This is to certify that</p>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {userName}
          </h2>

          {/* Achievement */}
          <p className="text-lg text-[var(--color-muted)] mb-2">has successfully completed</p>
          <h3 className="text-3xl font-semibold mb-2">{phase.title}</h3>
          <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
            {phase.description}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-400">{phase.lessons.length}</p>
              <p className="text-sm text-[var(--color-muted)]">Lessons Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{phaseId}</p>
              <p className="text-sm text-[var(--color-muted)]">Phase Level</p>
            </div>
          </div>

          {/* Date */}
          <p className="text-[var(--color-muted)]">{completionDate}</p>

          {/* Badge */}
          <div className="mt-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Certificate ID */}
          <p className="mt-6 text-xs text-[var(--color-muted)] font-mono">
            Certificate ID: LMNA-{phaseId}-{user?.id?.slice(0, 8).toUpperCase()}-{Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>

      {/* More certificates */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">More Certificates</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {curriculum.map((p) => {
            const isCompleted = p.lessons.every((lesson) => {
              const lp = lessonProgress[lesson.id];
              return lp?.status === 'completed' || lp?.status === 'mastered';
            });
            const completedCount = p.lessons.filter((lesson) => {
              const lp = lessonProgress[lesson.id];
              return lp?.status === 'completed' || lp?.status === 'mastered';
            }).length;

            if (p.id === phaseId) return null;

            return (
              <Link
                key={p.id}
                href={isCompleted ? `/certificate/${p.id}` : '#'}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-indigo-500/50'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <Award className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-[var(--color-muted)]" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {isCompleted
                        ? 'Certificate earned'
                        : `${completedCount}/${p.lessons.length} lessons`}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
