import { create } from 'zustand';

type Scene = 'lobby' | 'lesson' | 'sandbox';
type PerformanceTier = 'ultra' | 'balanced' | 'minimal';

interface SceneState {
  currentScene: Scene;
  previousScene: Scene | null;
  performanceTier: PerformanceTier;
  isTransitioning: boolean;
  isLoading: boolean;

  // Camera state (for lobby navigation)
  cameraTarget: [number, number, number] | null;
  cameraPosition: [number, number, number] | null;

  // Actions
  setScene: (scene: Scene) => void;
  setPerformanceTier: (tier: PerformanceTier) => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
  setCameraPosition: (position: [number, number, number] | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: 'lobby',
  previousScene: null,
  performanceTier: 'balanced',
  isTransitioning: false,
  isLoading: true,
  cameraTarget: null,
  cameraPosition: null,

  setScene: (scene) =>
    set((state) => ({
      previousScene: state.currentScene,
      currentScene: scene,
    })),

  setPerformanceTier: (tier) => set({ performanceTier: tier }),
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
}));
