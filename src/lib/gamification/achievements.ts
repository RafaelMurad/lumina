// Achievement System

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xpReward: number;
  secret?: boolean; // Hidden until unlocked
  trigger: AchievementTrigger;
}

export type AchievementTrigger =
  | { type: 'lesson_complete'; count: number }
  | { type: 'phase_complete'; phaseId: number }
  | { type: 'streak'; days: number }
  | { type: 'no_hints'; count: number }
  | { type: 'first_try'; count: number }
  | { type: 'speed_run'; lessonId: string; maxSeconds: number }
  | { type: 'total_xp'; amount: number }
  | { type: 'level_reached'; level: number }
  | { type: 'sandbox_creations'; count: number }
  | { type: 'special'; condition: string };

export const ACHIEVEMENTS: Achievement[] = [
  // Getting Started
  {
    id: 'first_render',
    name: 'Hello, World!',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50,
    trigger: { type: 'lesson_complete', count: 1 },
  },
  {
    id: 'five_lessons',
    name: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '📚',
    rarity: 'common',
    xpReward: 100,
    trigger: { type: 'lesson_complete', count: 5 },
  },
  {
    id: 'ten_lessons',
    name: 'Dedicated Student',
    description: 'Complete 10 lessons',
    icon: '🎓',
    rarity: 'common',
    xpReward: 150,
    trigger: { type: 'lesson_complete', count: 10 },
  },

  // Phase Completion
  {
    id: 'phase1_complete',
    name: 'Foundation Builder',
    description: 'Complete Phase 1: Foundations',
    icon: '🏗️',
    rarity: 'rare',
    xpReward: 300,
    trigger: { type: 'phase_complete', phaseId: 1 },
  },
  {
    id: 'phase2_complete',
    name: 'React Master',
    description: 'Complete Phase 2: React Three Fiber',
    icon: '⚛️',
    rarity: 'rare',
    xpReward: 400,
    trigger: { type: 'phase_complete', phaseId: 2 },
  },
  {
    id: 'phase3_complete',
    name: 'Ecosystem Explorer',
    description: 'Complete Phase 3: The Ecosystem',
    icon: '🌐',
    rarity: 'rare',
    xpReward: 400,
    trigger: { type: 'phase_complete', phaseId: 3 },
  },
  {
    id: 'phase4_complete',
    name: 'Shader Wizard',
    description: 'Complete Phase 4: Shaders & WebGPU',
    icon: '✨',
    rarity: 'epic',
    xpReward: 500,
    trigger: { type: 'phase_complete', phaseId: 4 },
  },
  {
    id: 'phase5_complete',
    name: 'Physics Master',
    description: 'Complete Phase 5: Physics & Games',
    icon: '🎮',
    rarity: 'epic',
    xpReward: 500,
    trigger: { type: 'phase_complete', phaseId: 5 },
  },
  {
    id: 'phase6_complete',
    name: 'Production Ready',
    description: 'Complete Phase 6: Production',
    icon: '🚀',
    rarity: 'epic',
    xpReward: 500,
    trigger: { type: 'phase_complete', phaseId: 6 },
  },

  // Streaks
  {
    id: 'streak_3',
    name: 'Consistent',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    xpReward: 75,
    trigger: { type: 'streak', days: 3 },
  },
  {
    id: 'streak_7',
    name: 'Dedicated Learner',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 200,
    trigger: { type: 'streak', days: 7 },
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    rarity: 'epic',
    xpReward: 1000,
    trigger: { type: 'streak', days: 30 },
  },

  // Skill Achievements
  {
    id: 'no_hints_5',
    name: 'Self-Reliant',
    description: 'Complete 5 lessons without using hints',
    icon: '🧠',
    rarity: 'rare',
    xpReward: 150,
    trigger: { type: 'no_hints', count: 5 },
  },
  {
    id: 'no_hints_20',
    name: 'Perfectionist',
    description: 'Complete 20 lessons without using hints',
    icon: '💎',
    rarity: 'epic',
    xpReward: 500,
    trigger: { type: 'no_hints', count: 20 },
  },
  {
    id: 'first_try_10',
    name: 'Quick Learner',
    description: 'Complete 10 exercises on your first try',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 200,
    trigger: { type: 'first_try', count: 10 },
  },

  // XP & Level
  {
    id: 'xp_1000',
    name: 'Rising Star',
    description: 'Earn 1,000 XP',
    icon: '⭐',
    rarity: 'common',
    xpReward: 50,
    trigger: { type: 'total_xp', amount: 1000 },
  },
  {
    id: 'xp_10000',
    name: 'Experienced',
    description: 'Earn 10,000 XP',
    icon: '🌟',
    rarity: 'rare',
    xpReward: 200,
    trigger: { type: 'total_xp', amount: 10000 },
  },
  {
    id: 'level_10',
    name: 'Double Digits',
    description: 'Reach level 10',
    icon: '🎖️',
    rarity: 'rare',
    xpReward: 250,
    trigger: { type: 'level_reached', level: 10 },
  },
  {
    id: 'level_25',
    name: 'Grandmaster',
    description: 'Reach level 25',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 1000,
    trigger: { type: 'level_reached', level: 25 },
  },

  // Sandbox
  {
    id: 'sandbox_first',
    name: 'Creator',
    description: 'Save your first sandbox creation',
    icon: '🎨',
    rarity: 'common',
    xpReward: 50,
    trigger: { type: 'sandbox_creations', count: 1 },
  },
  {
    id: 'sandbox_10',
    name: 'Prolific Creator',
    description: 'Save 10 sandbox creations',
    icon: '🎭',
    rarity: 'rare',
    xpReward: 200,
    trigger: { type: 'sandbox_creations', count: 10 },
  },

  // Special/Secret
  {
    id: 'all_phases',
    name: '3D Master',
    description: 'Complete all 6 phases',
    icon: '🏆',
    rarity: 'legendary',
    xpReward: 2000,
    trigger: { type: 'special', condition: 'all_phases_complete' },
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a lesson between midnight and 4am',
    icon: '🦉',
    rarity: 'rare',
    xpReward: 100,
    secret: true,
    trigger: { type: 'special', condition: 'night_completion' },
  },
];

/**
 * Get achievement by ID
 */
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Get achievements by rarity
 */
export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.rarity === rarity);
}

/**
 * Get visible achievements (non-secret or already unlocked)
 */
export function getVisibleAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter(
    (a) => !a.secret || unlockedIds.includes(a.id)
  );
}

/**
 * Check if an achievement should be unlocked based on stats
 */
export function checkAchievementTrigger(
  achievement: Achievement,
  stats: {
    lessonsCompleted: number;
    phasesCompleted: number[];
    streak: number;
    noHintsCount: number;
    firstTryCount: number;
    totalXP: number;
    level: number;
    sandboxCreations: number;
    currentHour?: number;
  }
): boolean {
  const { trigger } = achievement;

  switch (trigger.type) {
    case 'lesson_complete':
      return stats.lessonsCompleted >= trigger.count;

    case 'phase_complete':
      return stats.phasesCompleted.includes(trigger.phaseId);

    case 'streak':
      return stats.streak >= trigger.days;

    case 'no_hints':
      return stats.noHintsCount >= trigger.count;

    case 'first_try':
      return stats.firstTryCount >= trigger.count;

    case 'total_xp':
      return stats.totalXP >= trigger.amount;

    case 'level_reached':
      return stats.level >= trigger.level;

    case 'sandbox_creations':
      return stats.sandboxCreations >= trigger.count;

    case 'special':
      if (trigger.condition === 'all_phases_complete') {
        return stats.phasesCompleted.length >= 6;
      }
      if (trigger.condition === 'night_completion') {
        const hour = stats.currentHour ?? new Date().getHours();
        return hour >= 0 && hour < 4;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common':
      return '#9ca3af';
    case 'rare':
      return '#3b82f6';
    case 'epic':
      return '#8b5cf6';
    case 'legendary':
      return '#f59e0b';
  }
}

/**
 * Get rarity gradient
 */
export function getRarityGradient(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common':
      return 'from-gray-400 to-gray-600';
    case 'rare':
      return 'from-blue-400 to-blue-600';
    case 'epic':
      return 'from-purple-400 to-purple-600';
    case 'legendary':
      return 'from-amber-400 to-orange-600';
  }
}
