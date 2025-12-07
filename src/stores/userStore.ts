import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, UserProgress } from '@/types/database';

interface UserState {
  profile: Profile | null;
  progress: UserProgress | null;
  isLoading: boolean;

  // Actions
  setProfile: (profile: Profile | null) => void;
  setProgress: (progress: UserProgress | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      progress: null,
      isLoading: false,

      setProfile: (profile) => set({ profile }),
      setProgress: (progress) => set({ progress }),
      setIsLoading: (isLoading) => set({ isLoading }),
      reset: () => set({ profile: null, progress: null, isLoading: false }),
    }),
    {
      name: 'lumina-user-store',
      partialize: (state) => ({
        // Only persist non-sensitive data
        progress: state.progress,
      }),
    }
  )
);
