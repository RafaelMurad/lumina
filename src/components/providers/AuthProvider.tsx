'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const GUEST_STORAGE_KEY = 'lumina_guest_session';

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // If real auth happens, clear guest session
      if (session) {
        localStorage.removeItem(GUEST_STORAGE_KEY);
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
