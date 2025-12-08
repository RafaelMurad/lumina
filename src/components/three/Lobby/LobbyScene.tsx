'use client';

import { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
  Stars,
  Text,
} from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { useSceneStore } from '@/stores/sceneStore';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { Terminal } from './Terminal';
import { Bookshelf } from './Bookshelf';
import { TrophyShelf } from './TrophyShelf';
import { SkillTree } from './SkillTree';
import { CameraController } from './CameraController';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

function LobbyEnvironment({ tier }: { tier: 'ultra' | 'balanced' | 'minimal' }) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />

      {/* Main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow={tier !== 'minimal'}
        shadow-mapSize={tier === 'ultra' ? 2048 : 1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light */}
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />

      {/* Environment map */}
      <Environment preset="night" />

      {/* Stars background for ultra/balanced */}
      {tier !== 'minimal' && (
        <Stars
          radius={100}
          depth={50}
          count={tier === 'ultra' ? 5000 : 2000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}
    </>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[12, 64]} />
      <meshStandardMaterial color="#0f0f14" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

interface LobbyContentProps {
  onNavigate: (path: string) => void;
  tier: 'ultra' | 'balanced' | 'minimal';
}

function LobbyContent({ onNavigate, tier }: LobbyContentProps) {
  // Mock user progress - would come from store/API
  const userProgress = {
    phase1: 25,
    phase2: 0,
    phase3: 0,
    phase4: 0,
    phase5: 0,
    phase6: 0,
  };

  const userAchievements = ['first_render'];

  return (
    <>
      <LobbyEnvironment tier={tier} />
      <Floor />

      {/* Contact shadows for better grounding */}
      {tier !== 'minimal' && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={20}
          blur={2}
          far={4}
        />
      )}

      {/* Interactive Objects */}
      <Terminal
        position={[0, 0, -3]}
        onInteract={() => onNavigate('/sandbox')}
      />

      <Bookshelf
        position={[-4, 0, 0]}
        onInteract={() => onNavigate('/learn')}
      />

      <SkillTree
        position={[4, 0, 0]}
        onInteract={() => onNavigate('/dashboard')}
        progress={userProgress}
      />

      <TrophyShelf
        position={[0, 1.5, 3]}
        onInteract={() => onNavigate('/dashboard')}
        achievements={userAchievements}
      />

      {/* Welcome text */}
      <group position={[0, 4, -5]}>
        <Text
          fontSize={0.6}
          color="#6366f1"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          LUMINA
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="#71717a"
          anchorX="center"
          anchorY="middle"
        >
          Click on objects to explore
        </Text>
      </group>
    </>
  );
}

export default function LobbyScene() {
  const router = useRouter();
  const { performanceTier, isLoading: sceneLoading } = useSceneStore();
  const { config, isDetecting, tier } = usePerformanceTier();

  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  if (isDetecting) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Optimizing for your device...</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={config.dpr}
      shadows={config.shadows !== false}
      gl={{
        antialias: config.antialias,
        powerPreference: tier === 'minimal' ? 'low-power' : 'high-performance',
        alpha: false,
      }}
      frameloop={config.frameloop}
      className="w-full h-full"
    >
      <color attach="background" args={['#0a0a0f']} />

      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={50} />

      <Suspense fallback={<LoadingFallback />}>
        <LobbyContent onNavigate={handleNavigate} tier={tier} />
      </Suspense>

      <CameraController />
    </Canvas>
  );
}
