'use client';

import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PLANS } from '@/lib/stripe/config';

interface UpgradePromptProps {
  feature?: string;
  phaseId?: number;
  variant?: 'inline' | 'modal' | 'card';
}

export function UpgradePrompt({
  feature = 'this content',
  phaseId,
  variant = 'card'
}: UpgradePromptProps) {
  const phaseName = phaseId ? `Phase ${phaseId}` : null;

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <Lock className="w-4 h-4" />
        <span>Pro feature</span>
        <Link
          href="/pricing"
          className="text-[var(--color-primary)] hover:underline"
        >
          Upgrade
        </Link>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--color-card)] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[var(--color-primary)]" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Unlock {phaseName || feature}
          </h2>

          <p className="text-[var(--color-muted)] mb-6">
            Upgrade to Pro to access all lessons, advanced features, and certificates of completion.
          </p>

          <div className="space-y-3">
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              View Plans
            </Link>

            <Link
              href="/learn"
              className="block w-full py-3 px-4 rounded-lg border border-[var(--color-border)] text-center font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              Continue with Free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent border border-[var(--color-primary)]/30 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-6 h-6 text-[var(--color-primary)]" />
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {phaseName ? `${phaseName} is Pro-only` : `Unlock ${feature}`}
      </h3>

      <p className="text-[var(--color-muted)] mb-6 max-w-sm mx-auto">
        Get access to {PLANS.pro_monthly.features.length}+ premium features including all lessons,
        certificates, and priority support.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade to Pro
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <p className="text-xs text-[var(--color-muted)] mt-4">
        Starting at ${PLANS.pro_monthly.price}/month • Cancel anytime
      </p>
    </div>
  );
}

// Locked lesson card for the learn page
export function LockedLessonCard({
  title,
  description,
  phaseId,
}: {
  title: string;
  description: string;
  phaseId: number;
}) {
  return (
    <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 opacity-75">
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent rounded-xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-[var(--color-muted)]">{description}</p>
          </div>
          <div className="flex items-center gap-1 text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-1 rounded-full">
            <Lock className="w-3 h-3" />
            Pro
          </div>
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
        >
          Unlock Phase {phaseId}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
