'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useProgress } from '@/hooks/useProgress';
import { useSubscription } from '@/hooks/useSubscription';
import { ACHIEVEMENTS } from '@/lib/gamification/achievements';
import { curriculum } from '@/content/curriculum';
import Link from 'next/link';
import {
  User,
  Trophy,
  Flame,
  Target,
  Zap,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Crown,
  Share2,
  Edit,
  Check,
  X,
  Loader2,
  Star,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isGuest } = useAuth();
  const { stats, achievements, lessonProgress, xpProgress, levelTitle, isLoading } = useProgress();
  const { isPro, subscription } = useSubscription();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setDisplayName(user.user_metadata.full_name);
    }
  }, [user]);

  // Calculate detailed stats
  const totalLessons = curriculum.reduce((acc, phase) => acc + phase.lessons.length, 0);
  const completedLessons = Object.values(lessonProgress).filter(
    (lp) => lp.status === 'completed' || lp.status === 'mastered'
  ).length;
  const masteredLessons = Object.values(lessonProgress).filter(
    (lp) => lp.status === 'mastered'
  ).length;
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  // Get unlocked achievements with details
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => achievements.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !achievements.includes(a.id));

  // Calculate phase completion
  const phaseStats = curriculum.map((phase) => {
    const completed = phase.lessons.filter((lesson) => {
      const lp = lessonProgress[lesson.id];
      return lp?.status === 'completed' || lp?.status === 'mastered';
    }).length;
    return {
      id: phase.id,
      title: phase.title,
      completed,
      total: phase.lessons.length,
      percentage: phase.lessons.length > 0 ? Math.round((completed / phase.lessons.length) * 100) : 0,
    };
  });

  if (isGuest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create Your Profile</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Sign up to create your profile, track your progress, and earn achievements!
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
    <div className="max-w-5xl mx-auto p-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl p-8 border border-[var(--color-border)] mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {isPro && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 rounded hover:bg-[var(--color-surface)]"
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </button>
                  <button
                    onClick={() => {
                      setDisplayName(user?.user_metadata?.full_name || '');
                      setIsEditing(false);
                    }}
                    className="p-1 rounded hover:bg-[var(--color-surface)]"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{displayName || 'Anonymous'}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded hover:bg-[var(--color-surface)]"
                  >
                    <Edit className="w-4 h-4 text-[var(--color-muted)]" />
                  </button>
                </>
              )}
            </div>
            <p className="text-[var(--color-muted)] mb-3">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Level</p>
                  <p className="font-semibold">{stats.level} - {levelTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Total XP</p>
                  <p className="font-semibold">{stats.totalXP.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Streak</p>
                  <p className="font-semibold">{stats.streak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-muted)]">Level {stats.level} Progress</span>
            <span className="text-[var(--color-muted)]">{xpProgress.current} / {xpProgress.required} XP</span>
          </div>
          <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-[var(--color-muted)]">Lessons</span>
              </div>
              <p className="text-2xl font-bold">{completedLessons}/{totalLessons}</p>
              <p className="text-xs text-[var(--color-muted)]">{completionPercentage}% complete</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-sm text-[var(--color-muted)]">Mastered</span>
              </div>
              <p className="text-2xl font-bold">{masteredLessons}</p>
              <p className="text-xs text-[var(--color-muted)]">Perfect completions</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-[var(--color-muted)]">Achievements</span>
              </div>
              <p className="text-2xl font-bold">{achievements.length}/{ACHIEVEMENTS.length}</p>
              <p className="text-xs text-[var(--color-muted)]">Badges earned</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-[var(--color-muted)]">First Tries</span>
              </div>
              <p className="text-2xl font-bold">{stats.firstTryCount}</p>
              <p className="text-xs text-[var(--color-muted)]">No hints needed</p>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--color-muted)]" />
              Course Progress
            </h2>
            <div className="space-y-4">
              {phaseStats.map((phase) => (
                <div key={phase.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{phase.title}</span>
                    <span className="text-[var(--color-muted)]">{phase.completed}/{phase.total}</span>
                  </div>
                  <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        phase.percentage === 100
                          ? 'bg-green-500'
                          : phase.percentage > 0
                          ? 'bg-indigo-500'
                          : 'bg-[var(--color-surface)]'
                      }`}
                      style={{ width: `${phase.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-purple-500/10 border border-[var(--color-primary)]/30"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">{achievement.description}</p>
                </div>
              ))}
              {lockedAchievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] opacity-50"
                >
                  <div className="text-3xl mb-2 grayscale">🔒</div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">???</p>
                </div>
              ))}
            </div>
            {lockedAchievements.length > 3 && (
              <p className="text-center text-sm text-[var(--color-muted)] mt-4">
                +{lockedAchievements.length - 3} more achievements to unlock
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Activity & Subscription */}
        <div className="space-y-8">
          {/* Subscription Status */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Crown className={`w-5 h-5 ${isPro ? 'text-yellow-400' : 'text-[var(--color-muted)]'}`} />
              Subscription
            </h2>
            {isPro ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-purple-500/20 text-[var(--color-primary)] text-sm font-medium">
                    Pro {subscription?.plan === 'yearly' ? 'Yearly' : 'Monthly'}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-muted)]">
                  Full access to all content and features
                </p>
                <Link
                  href="/settings"
                  className="block text-sm text-indigo-400 hover:underline"
                >
                  Manage subscription →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[var(--color-muted)]">
                  Upgrade to Pro to unlock all lessons and features
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--color-muted)]" />
              Account
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Member since</span>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Email verified</span>
                <span className="text-green-400">
                  {user?.email_confirmed_at ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Auth provider</span>
                <span className="capitalize">{user?.app_metadata?.provider || 'Email'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Link
                href="/settings"
                className="text-sm text-indigo-400 hover:underline"
              >
                Account settings →
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link
                href="/learn"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              >
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>Continue Learning</span>
              </Link>
              <Link
                href="/sandbox"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              >
                <Target className="w-5 h-5 text-green-400" />
                <span>Open Sandbox</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              >
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>View Leaderboard</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              >
                <Award className="w-5 h-5 text-purple-400" />
                <span>My Certificates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
