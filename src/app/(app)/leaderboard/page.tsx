'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { Trophy, Medal, Award, Crown, Flame, Target, Zap, Users, ChevronUp, ChevronDown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  totalXP: number;
  lessonsCompleted: number;
  streak: number;
  achievementCount: number;
  isCurrentUser: boolean;
}

type TimeFrame = 'all' | 'month' | 'week';
type Category = 'xp' | 'lessons' | 'streak' | 'achievements';

export default function LeaderboardPage() {
  const { user, isGuest } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');
  const [category, setCategory] = useState<Category>('xp');
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Fetch user progress with profiles
        const { data: progressData, error } = await supabase
          .from('user_progress')
          .select(`
            user_id,
            level,
            total_xp,
            current_xp,
            streak_days,
            profiles!inner (
              id,
              full_name,
              avatar_url
            )
          `)
          .order(category === 'xp' ? 'total_xp' : category === 'streak' ? 'streak_days' : 'total_xp', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Leaderboard fetch error:', error);
          // Use mock data for demo
          setEntries(getMockLeaderboard(user?.id));
          setIsLoading(false);
          return;
        }

        // Count lessons and achievements per user
        const { data: lessonCounts } = await supabase
          .from('lesson_progress')
          .select('user_id')
          .in('status', ['completed', 'mastered']);

        const { data: achievementCounts } = await supabase
          .from('user_achievements')
          .select('user_id');

        const lessonCountMap: Record<string, number> = {};
        lessonCounts?.forEach((lp: any) => {
          lessonCountMap[lp.user_id] = (lessonCountMap[lp.user_id] || 0) + 1;
        });

        const achievementCountMap: Record<string, number> = {};
        achievementCounts?.forEach((ua: any) => {
          achievementCountMap[ua.user_id] = (achievementCountMap[ua.user_id] || 0) + 1;
        });

        const formattedEntries: LeaderboardEntry[] = (progressData || []).map((entry: any, index: number) => ({
          rank: index + 1,
          userId: entry.user_id,
          displayName: entry.profiles?.full_name || `Player ${index + 1}`,
          avatarUrl: entry.profiles?.avatar_url,
          level: entry.level || 1,
          totalXP: entry.total_xp || 0,
          lessonsCompleted: lessonCountMap[entry.user_id] || 0,
          streak: entry.streak_days || 0,
          achievementCount: achievementCountMap[entry.user_id] || 0,
          isCurrentUser: entry.user_id === user?.id,
        }));

        // Sort by selected category
        formattedEntries.sort((a, b) => {
          switch (category) {
            case 'xp': return b.totalXP - a.totalXP;
            case 'lessons': return b.lessonsCompleted - a.lessonsCompleted;
            case 'streak': return b.streak - a.streak;
            case 'achievements': return b.achievementCount - a.achievementCount;
            default: return b.totalXP - a.totalXP;
          }
        });

        // Re-assign ranks after sorting
        formattedEntries.forEach((entry, index) => {
          entry.rank = index + 1;
        });

        setEntries(formattedEntries);

        // Find current user's rank
        const userEntry = formattedEntries.find((e) => e.isCurrentUser);
        setCurrentUserRank(userEntry || null);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setEntries(getMockLeaderboard(user?.id));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [supabase, user?.id, category, timeFrame]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-[var(--color-muted)]">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-500/10 border-amber-600/30';
      default:
        return 'bg-[var(--color-card)] border-[var(--color-border)]';
    }
  };

  const getCategoryValue = (entry: LeaderboardEntry) => {
    switch (category) {
      case 'xp': return `${entry.totalXP.toLocaleString()} XP`;
      case 'lessons': return `${entry.lessonsCompleted} lessons`;
      case 'streak': return `${entry.streak} days`;
      case 'achievements': return `${entry.achievementCount} badges`;
      default: return `${entry.totalXP.toLocaleString()} XP`;
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'xp': return <Zap className="w-4 h-4" />;
      case 'lessons': return <Target className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'achievements': return <Award className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  if (isGuest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Join the Competition</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Sign up to track your progress and compete on the global leaderboard!
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Sign Up to Compete
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-[var(--color-muted)] mt-1">
            See how you stack up against other learners
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Users className="w-4 h-4" />
          <span>{entries.length} players</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex gap-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-1">
          {[
            { id: 'xp', label: 'XP', icon: <Zap className="w-4 h-4" /> },
            { id: 'lessons', label: 'Lessons', icon: <Target className="w-4 h-4" /> },
            { id: 'streak', label: 'Streak', icon: <Flame className="w-4 h-4" /> },
            { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as Category)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                category === cat.id
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Time Frame Filter */}
        <div className="flex gap-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-1">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'month', label: 'This Month' },
            { id: 'week', label: 'This Week' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeFrame(tf.id as TimeFrame)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                timeFrame === tf.id
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Rank Banner */}
      {currentUserRank && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center font-bold text-xl">
                #{currentUserRank.rank}
              </div>
              <div>
                <p className="font-semibold">Your Rank</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {getCategoryValue(currentUserRank)}
                </p>
              </div>
            </div>
            {currentUserRank.rank > 1 && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <ChevronUp className="w-4 h-4 text-green-400" />
                <span>Keep learning to climb!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--color-card)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 50).map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                entry.isCurrentUser
                  ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/30'
                  : getRankBg(entry.rank)
              }`}
            >
              {/* Rank */}
              <div className="w-10 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                {entry.avatarUrl ? (
                  <img src={entry.avatarUrl} alt={entry.displayName} className="w-full h-full object-cover" />
                ) : (
                  entry.displayName.charAt(0).toUpperCase()
                )}
              </div>

              {/* Name & Level */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate flex items-center gap-2">
                  {entry.displayName}
                  {entry.isCurrentUser && (
                    <span className="text-xs bg-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  Level {entry.level}
                </p>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{entry.totalXP.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{entry.streak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>{entry.achievementCount}</span>
                </div>
              </div>

              {/* Primary Value */}
              <div className="flex items-center gap-2 font-semibold text-right min-w-[100px]">
                {getCategoryIcon()}
                {getCategoryValue(entry)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && entries.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-[var(--color-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
          <p className="text-[var(--color-muted)]">
            Be the first to complete a lesson and claim the top spot!
          </p>
        </div>
      )}
    </div>
  );
}

// Mock leaderboard data for demo/fallback
function getMockLeaderboard(currentUserId?: string): LeaderboardEntry[] {
  const names = [
    'WebGL Wizard', 'Shader Master', '3D Pioneer', 'Graphics Guru', 'Pixel Perfect',
    'Render King', 'Matrix Mage', 'Buffer Boss', 'Texture Titan', 'Polygon Pro',
    'Mesh Master', 'Scene Sculptor', 'Light Lord', 'Camera Captain', 'Code Crafter',
  ];

  return names.map((name, index) => ({
    rank: index + 1,
    userId: `mock_${index}`,
    displayName: name,
    level: Math.max(1, 15 - index),
    totalXP: Math.max(100, 15000 - index * 900),
    lessonsCompleted: Math.max(1, 30 - index * 2),
    streak: Math.max(0, 45 - index * 3),
    achievementCount: Math.max(1, 12 - index),
    isCurrentUser: false,
  }));
}
