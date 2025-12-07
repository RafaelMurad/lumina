import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
}

export function calculateLevel(totalXP: number): number {
  // Level formula: level = floor(sqrt(totalXP / 50)) + 1
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

export function xpForLevel(level: number): number {
  // XP required to reach a level: 50 * (level - 1)^2
  return 50 * Math.pow(level - 1, 2);
}

export function xpProgressInLevel(totalXP: number): { current: number; required: number; percentage: number } {
  const level = calculateLevel(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = totalXP - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  const percentage = (current / required) * 100;

  return { current, required, percentage };
}
