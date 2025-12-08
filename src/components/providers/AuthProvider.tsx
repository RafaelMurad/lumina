'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const GUEST_STORAGE_KEY = 'lumina_guest_session';
const GUEST_PROGRESS_KEY = 'lumina_guest_progress';

// Migrate guest progress to authenticated user
async function migrateGuestProgress(
  userId: string,
  guestProgress: {
    stats?: { totalXP?: number; level?: number; streak?: number };
    achievements?: string[];
    lessonProgress?: Record<string, { status: string; attempts: number; hintsUsed: number }>;
  },
  supabase: ReturnType<typeof createClient>
) {
  // Migrate user progress (XP, level, streak)
  if (guestProgress.stats) {
    await (supabase.from('user_progress') as any).upsert({
      user_id: userId,
      total_xp: guestProgress.stats.totalXP || 0,
      current_xp: guestProgress.stats.totalXP || 0,
      level: guestProgress.stats.level || 1,
      streak_days: guestProgress.stats.streak || 0,
      last_activity_date: new Date().toISOString().split('T')[0],
    });
  }

  // Migrate lesson progress
  if (guestProgress.lessonProgress) {
    const lessonProgressEntries = Object.entries(guestProgress.lessonProgress).map(
      ([lessonId, progress]) => ({
        user_id: userId,
        lesson_id: lessonId,
        status: progress.status,
        attempts: progress.attempts,
        hints_used: progress.hintsUsed,
        completed_at: progress.status === 'completed' ? new Date().toISOString() : null,
      })
    );

    if (lessonProgressEntries.length > 0) {
      await (supabase.from('lesson_progress') as any).upsert(lessonProgressEntries);
    }
  }

  // Migrate achievements
  if (guestProgress.achievements && guestProgress.achievements.length > 0) {
    const achievementEntries = guestProgress.achievements.map((achievementId) => ({
      user_id: userId,
      achievement_id: achievementId,
    }));

    await (supabase.from('user_achievements') as any).upsert(achievementEntries);
  }
}

// Create a mock guest user
function createGuestUser(): User {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  return {
    id: guestId,
    aud: 'authenticated',
    role: 'authenticated',
    email: undefined,
    email_confirmed_at: undefined,
    phone: undefined,
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'guest' },
    user_metadata: { 
      full_name: 'Guest Explorer',
      avatar_url: undefined,
      is_guest: true,
    },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isGuest: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check for guest session first
    const checkGuestSession = () => {
      try {
        const guestData = localStorage.getItem(GUEST_STORAGE_KEY);
        if (guestData) {
          const guest = JSON.parse(guestData) as User;
          setUser(guest);
          setIsGuest(true);
          setIsLoading(false);
          return true;
        }
      } catch {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
      return false;
    };

    // Get initial session
    const getInitialSession = async () => {
      // Check guest first
      if (checkGuestSession()) {
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If real auth happens, migrate guest progress and clear guest session
      if (session) {
        // Check for guest progress to migrate
        const guestProgressStr = localStorage.getItem(GUEST_PROGRESS_KEY);
        if (guestProgressStr) {
          try {
            const guestProgress = JSON.parse(guestProgressStr);
            await migrateGuestProgress(session.user.id, guestProgress, supabase);
          } catch (err) {
            console.error('Failed to migrate guest progress:', err);
          }
        }

        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem(GUEST_PROGRESS_KEY);
        // Clear the cookie
        document.cookie = `${GUEST_STORAGE_KEY}=; path=/; max-age=0`;
        setIsGuest(false);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('GitHub sign in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Email sign in error:', error);
      return { error: error.message };
    }
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName || '',
        },
      },
    });
    if (error) {
      console.error('Email sign up error:', error);
      return { error: error.message };
    }
    return {};
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      console.error('Password reset error:', error);
      return { error: error.message };
    }
    return {};
  };

  const signInAsGuest = () => {
    const guestUser = createGuestUser();
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    // Also set a cookie for middleware to detect guest session
    document.cookie = `${GUEST_STORAGE_KEY}=true; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
    setUser(guestUser);
    setIsGuest(true);
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const signOut = async () => {
    // Clear guest session if exists
    if (isGuest) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      // Clear the cookie
      document.cookie = `${GUEST_STORAGE_KEY}=; path=/; max-age=0`;
      setUser(null);
      setIsGuest(false);
      window.location.href = '/';
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isGuest,
        signInWithGithub,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signInAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
