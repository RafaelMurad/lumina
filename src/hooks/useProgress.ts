'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { calculateLevel, xpProgressInLevel, calculateLessonXP, getLevelTitle } from '@/lib/gamification/xp';
import {
  ACHIEVEMENTS,
  checkAchievementTrigger,
  type Achievement,
} from '@/lib/gamification/achievements';

interface UserStats {
  level: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  lessonsCompleted: number;
  noHintsCount: number;
  firstTryCount: number;
  phasesCompleted: number[];
  sandboxCreations: number;
}

interface ProgressState {
  stats: UserStats;
  achievements: string[];
  lessonProgress: Record<string, {
    status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
    attempts: number;
    hintsUsed: number;
  }>;
  isLoading: boolean;
}

// Supabase row types (for type safety)
interface LessonProgressRow {
  lesson_id: string;
  status: string;
  attempts: number;
  hints_used: number;
}

interface UserProgressRow {
  level: number;
  current_xp: number;
  total_xp: number;
  streak_days: number;
}

interface UserAchievementRow {
  achievement_id: string;
}

const DEFAULT_STATS: UserStats = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  streak: 0,
  lessonsCompleted: 0,
  noHintsCount: 0,
  firstTryCount: 0,
  phasesCompleted: [],
  sandboxCreations: 0,
};

// Local storage key for guest progress
const GUEST_PROGRESS_KEY = 'lumina_guest_progress';

export function useProgress() {
  const { user, isGuest } = useAuth();
  const [state, setState] = useState<ProgressState>({
    stats: DEFAULT_STATS,
    achievements: [],
    lessonProgress: {},
    isLoading: true,
  });

  const supabase = createClient();

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (isGuest) {
        // Load from localStorage for guests
        try {
          const saved = localStorage.getItem(GUEST_PROGRESS_KEY);
          if (saved) {
            const data = JSON.parse(saved);
            setState({
              stats: data.stats || DEFAULT_STATS,
              achievements: data.achievements || [],
              lessonProgress: data.lessonProgress || {},
              isLoading: false,
            });
            return;
          }
        } catch {
          // Ignore parse errors
        }
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      if (!user) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      // Load from Supabase for authenticated users
      try {
        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch lesson progress
        const { data: lessonData } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id);

        // Fetch achievements
        const { data: achievementData } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', user.id);

        const lessonProgress: Record<string, any> = {};
        (lessonData as LessonProgressRow[] | null)?.forEach((lp) => {
          lessonProgress[lp.lesson_id] = {
            status: lp.status,
            attempts: lp.attempts,
            hintsUsed: lp.hints_used,
          };
        });

        const completedLessons = Object.values(lessonProgress).filter(
          (lp: any) => lp.status === 'completed' || lp.status === 'mastered'
        ).length;

        const noHintsCount = Object.values(lessonProgress).filter(
          (lp: any) =>
            (lp.status === 'completed' || lp.status === 'mastered') &&
            lp.hintsUsed === 0
        ).length;

        const firstTryCount = Object.values(lessonProgress).filter(
          (lp: any) =>
            (lp.status === 'completed' || lp.status === 'mastered') &&
            lp.attempts === 1
        ).length;

        const typedProgressData = progressData as UserProgressRow | null;
        const typedAchievementData = achievementData as UserAchievementRow[] | null;

        setState({
          stats: {
            level: typedProgressData?.level || 1,
            currentXP: typedProgressData?.current_xp || 0,
            totalXP: typedProgressData?.total_xp || 0,
            streak: typedProgressData?.streak_days || 0,
            lessonsCompleted: completedLessons,
            noHintsCount,
            firstTryCount,
            phasesCompleted: [], // TODO: Calculate from lesson progress
            sandboxCreations: 0, // TODO: Fetch from saved_projects
          },
          achievements: typedAchievementData?.map((a) => a.achievement_id) || [],
          lessonProgress,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load progress:', error);
        setState((s) => ({ ...s, isLoading: false }));
      }
    };

    loadProgress();
  }, [user, isGuest, supabase]);

  // Save progress (for guests, saves to localStorage)
  const saveProgress = useCallback(async () => {
    if (isGuest) {
      localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify({
        stats: state.stats,
        achievements: state.achievements,
        lessonProgress: state.lessonProgress,
      }));
    }
    // For authenticated users, saving happens in individual methods
  }, [isGuest, state]);

  // Award XP
  const awardXP = useCallback(
    async (amount: number, reason: string) => {
      const newTotalXP = state.stats.totalXP + amount;
      const newLevel = calculateLevel(newTotalXP);
      const leveledUp = newLevel > state.stats.level;

      const newStats = {
        ...state.stats,
        totalXP: newTotalXP,
        currentXP: state.stats.currentXP + amount,
        level: newLevel,
      };

      setState((s) => ({ ...s, stats: newStats }));

      if (!isGuest && user) {
        await (supabase
          .from('user_progress') as any)
          .upsert({
            user_id: user.id,
            total_xp: newTotalXP,
            current_xp: state.stats.currentXP + amount,
            level: newLevel,
          });
      }

      // Check for XP/level achievements
      const newAchievements = await checkAndUnlockAchievements(newStats);

      return {
        amount,
        reason,
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined,
        newAchievements,
      };
    },
    [state.stats, user, isGuest, supabase]
  );

  // Complete a lesson
  const completeLesson = useCallback(
    async (lessonId: string, options: {
      hintsUsed: number;
      timeSpent: number;
      expectedTime: number;
    }) => {
      const existing = state.lessonProgress[lessonId];
      const isFirstAttempt = !existing || existing.attempts === 0;
      const isFirstLesson = state.stats.lessonsCompleted === 0;

      const { total, breakdown } = calculateLessonXP({
        isFirstAttempt,
        hintsUsed: options.hintsUsed,
        timeSpent: options.timeSpent,
        expectedTime: options.expectedTime,
        isFirstLesson,
      });

      // Update lesson progress
      const newLessonProgress = {
        ...state.lessonProgress,
        [lessonId]: {
          status: 'completed' as const,
          attempts: (existing?.attempts || 0) + 1,
          hintsUsed: options.hintsUsed,
        },
      };

      const newStats = {
        ...state.stats,
        lessonsCompleted: state.stats.lessonsCompleted + 1,
        noHintsCount:
          options.hintsUsed === 0
            ? state.stats.noHintsCount + 1
            : state.stats.noHintsCount,
        firstTryCount: isFirstAttempt
          ? state.stats.firstTryCount + 1
          : state.stats.firstTryCount,
      };

      setState((s) => ({
        ...s,
        stats: newStats,
        lessonProgress: newLessonProgress,
      }));

      // Award XP
      const xpResult = await awardXP(total, `Completed ${lessonId}`);

      // Save to Supabase if authenticated
      if (!isGuest && user) {
        await (supabase.from('lesson_progress') as any).upsert({
          user_id: user.id,
          lesson_id: lessonId,
          status: 'completed',
          attempts: (existing?.attempts || 0) + 1,
          hints_used: options.hintsUsed,
          time_spent_seconds: options.timeSpent,
          completed_at: new Date().toISOString(),
        });
      }

      return {
        xp: total,
        breakdown,
        ...xpResult,
      };
    },
    [state, user, isGuest, supabase, awardXP]
  );

  // Check and unlock achievements
  const checkAndUnlockAchievements = useCallback(
    async (currentStats: UserStats): Promise<Achievement[]> => {
      const newlyUnlocked: Achievement[] = [];

      for (const achievement of ACHIEVEMENTS) {
        // Skip if already unlocked
        if (state.achievements.includes(achievement.id)) continue;

        const shouldUnlock = checkAchievementTrigger(achievement, {
          lessonsCompleted: currentStats.lessonsCompleted,
          phasesCompleted: currentStats.phasesCompleted,
          streak: currentStats.streak,
          noHintsCount: currentStats.noHintsCount,
          firstTryCount: currentStats.firstTryCount,
          totalXP: currentStats.totalXP,
          level: currentStats.level,
          sandboxCreations: currentStats.sandboxCreations,
        });

        if (shouldUnlock) {
          newlyUnlocked.push(achievement);

          // Save to state
          setState((s) => ({
            ...s,
            achievements: [...s.achievements, achievement.id],
          }));

          // Save to Supabase if authenticated
          if (!isGuest && user) {
            await (supabase.from('user_achievements') as any).insert({
              user_id: user.id,
              achievement_id: achievement.id,
            });
          }
        }
      }

      return newlyUnlocked;
    },
    [state.achievements, user, isGuest, supabase]
  );

  // Get XP progress for display
  const xpProgress = xpProgressInLevel(state.stats.totalXP);
  const levelTitle = getLevelTitle(state.stats.level);

  return {
    stats: state.stats,
    achievements: state.achievements,
    lessonProgress: state.lessonProgress,
    isLoading: state.isLoading,
    xpProgress,
    levelTitle,
    awardXP,
    completeLesson,
    saveProgress,
  };
}
