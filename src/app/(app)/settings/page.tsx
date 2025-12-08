'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { useProgress } from '@/hooks/useProgress';
import { redirectToPortal } from '@/lib/stripe/client';
import { PLANS } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Loader2,
  Crown,
  Calendar,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isGuest, signOut } = useAuth();
  const { subscription, isPro, getDaysRemaining, isLoading } = useSubscription();
  const { stats, achievements, lessonProgress } = useProgress();
  const [isManaging, setIsManaging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const supabase = createClient();

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      await redirectToPortal();
    } catch (error) {
      console.error('Failed to open portal:', error);
      alert('Failed to open subscription management. Please try again.');
    } finally {
      setIsManaging(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleDataExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Gather all user data
      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          id: user?.id,
          email: user?.email,
          createdAt: user?.created_at,
        },
        progress: {
          level: stats.level,
          totalXP: stats.totalXP,
          streak: stats.streak,
          lessonsCompleted: stats.lessonsCompleted,
        },
        achievements: achievements,
        lessonProgress: lessonProgress,
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
        } : null,
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lumina-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [user, stats, achievements, lessonProgress, subscription]);

  const handleDeleteAccount = useCallback(async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Delete user data from all tables
      await Promise.all([
        supabase.from('lesson_progress').delete().eq('user_id', user.id),
        supabase.from('user_achievements').delete().eq('user_id', user.id),
        supabase.from('user_progress').delete().eq('user_id', user.id),
        supabase.from('saved_projects').delete().eq('user_id', user.id),
        supabase.from('code_submissions').delete().eq('user_id', user.id),
        supabase.from('subscriptions').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id),
      ]);

      // Sign out and redirect
      await signOut();
      alert('Your account has been deleted successfully.');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please contact support.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [user, supabase, signOut]);

  if (isGuest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Sign up to save your progress, unlock achievements, and manage your subscription.
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

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[var(--color-muted)]" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-muted)]">Email</label>
              <p className="font-medium">{user?.email || 'Not set'}</p>
            </div>

            <div>
              <label className="text-sm text-[var(--color-muted)]">User ID</label>
              <p className="font-mono text-sm text-[var(--color-muted)]">
                {user?.id?.slice(0, 8)}...
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-[var(--color-muted)]" />
            <h2 className="text-lg font-semibold">Subscription</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-muted)]" />
            </div>
          ) : isPro && subscription ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    Pro {subscription.plan === 'yearly' ? 'Yearly' : 'Monthly'}
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Full access to all content
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <Calendar className="w-4 h-4" />
                <span>
                  {getDaysRemaining()} days remaining in current period
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleManageSubscription}
                  disabled={isManaging}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] font-medium hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
                >
                  {isManaging ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Manage Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--color-muted)]" />
                </div>
                <div>
                  <p className="font-semibold">Free Plan</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Access to Phase 1 content
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Unlock all content with Pro</p>
                    <p className="text-sm text-[var(--color-muted)] mb-3">
                      Get access to all {PLANS.pro_monthly.features.length}+ features
                      including advanced lessons and certificates.
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors text-sm"
                    >
                      View Plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Notifications Section */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[var(--color-muted)]" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Weekly progress emails</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-surface)] checked:bg-[var(--color-primary)]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Achievement notifications</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-surface)] checked:bg-[var(--color-primary)]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>New content announcements</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-surface)] checked:bg-[var(--color-primary)]"
              />
            </label>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-[var(--color-muted)]" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Export</p>
                <p className="text-sm text-[var(--color-muted)]">
                  Download a copy of your data
                </p>
              </div>
              <button
                onClick={handleDataExport}
                disabled={isExporting}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isExporting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-400">Delete Account</p>
                <p className="text-sm text-[var(--color-muted)]">
                  Permanently delete your account and data
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-card)] rounded-2xl p-6 max-w-md w-full border border-[var(--color-border)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Delete Account</h3>
              </div>

              <p className="text-[var(--color-muted)] mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
                All your progress, achievements, and saved projects will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] font-medium hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <section className="pt-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
}
