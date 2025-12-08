// XP and Leveling System

export const XP_REWARDS = {
  // Lesson completion
  lessonComplete: 100,
  exerciseFirstTry: 50,
  noHintsBonus: 25,
  perfectScore: 75,

  // Streaks
  dailyLogin: 10,
  streakBonus: (days: number) => Math.min(days * 10, 100),

  // Milestones
  phaseComplete: 500,
  moduleComplete: 200,

  // Special
  firstLesson: 50,
  comeback: 25, // After 7+ days away
} as const;

/**
 * Calculate level from total XP
 * Uses a square root curve: level = floor(sqrt(xp / 50)) + 1
 * Level 1: 0-49 XP
 * Level 2: 50-199 XP
 * Level 3: 200-449 XP
 * Level 4: 450-799 XP
 * ...
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 0) return 1;
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

/**
 * Get the XP required to reach a specific level
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * Math.pow(level - 1, 2);
}

/**
 * Get XP progress within current level
 */
export function xpProgressInLevel(totalXP: number): {
  current: number;
  required: number;
  percentage: number;
  level: number;
  nextLevel: number;
} {
  const level = calculateLevel(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = totalXP - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  const percentage = Math.min((current / required) * 100, 100);

  return {
    current,
    required,
    percentage,
    level,
    nextLevel: level + 1,
  };
}

/**
 * Calculate XP reward for completing a lesson
 */
export function calculateLessonXP(options: {
  isFirstAttempt: boolean;
  hintsUsed: number;
  timeSpent: number; // in seconds
  expectedTime: number; // in seconds
  isFirstLesson?: boolean;
}): {
  total: number;
  breakdown: { reason: string; amount: number }[];
} {
  const breakdown: { reason: string; amount: number }[] = [];

  // Base completion XP
  breakdown.push({ reason: 'Lesson Complete', amount: XP_REWARDS.lessonComplete });

  // First attempt bonus
  if (options.isFirstAttempt) {
    breakdown.push({ reason: 'First Try Bonus', amount: XP_REWARDS.exerciseFirstTry });
  }

  // No hints bonus
  if (options.hintsUsed === 0) {
    breakdown.push({ reason: 'No Hints Used', amount: XP_REWARDS.noHintsBonus });
  }

  // Speed bonus (completed in less than expected time)
  if (options.timeSpent < options.expectedTime * 0.75) {
    breakdown.push({ reason: 'Speed Bonus', amount: 25 });
  }

  // First lesson ever bonus
  if (options.isFirstLesson) {
    breakdown.push({ reason: 'First Steps', amount: XP_REWARDS.firstLesson });
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return { total, breakdown };
}

/**
 * Format XP for display
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
}

/**
 * Get level title based on level number
 */
export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Newcomer',
    2: 'Apprentice',
    3: 'Student',
    4: 'Practitioner',
    5: 'Developer',
    10: 'Engineer',
    15: 'Architect',
    20: 'Master',
    25: 'Grandmaster',
    30: 'Legend',
  };

  // Find the highest matching title
  const levels = Object.keys(titles)
    .map(Number)
    .sort((a, b) => b - a);

  for (const lvl of levels) {
    if (level >= lvl) {
      return titles[lvl];
    }
  }

  return 'Newcomer';
}
