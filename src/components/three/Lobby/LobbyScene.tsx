'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { Suspense } from 'react';
import { useSceneStore } from '@/stores/sceneStore';

function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

function LobbyEnvironment() {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Environment map for reflections */}
      <Environment preset="apartment" />
    </>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

function PlaceholderRoom() {
  return (
    <group>
      {/* Floor */}
      <Floor />

      {/* Placeholder for computer terminal */}
      <group position={[0, 0, -3]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 1, 0.5]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 1.2, -0.1]}>
          <planeGeometry args={[1.6, 1]} />
          <meshStandardMaterial color="#0a0a0f" emissive="#6366f1" emissiveIntensity={0.2} />
        </mesh>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.15}
          color="#6366f1"
          anchorX="center"
          anchorY="middle"
        >
          CODE TERMINAL
        </Text>
      </group>

      {/* Placeholder for bookshelf */}
      <group position={[-4, 0, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.5, 3, 2]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
        <Text
          position={[0.3, 1.5, 0]}
          fontSize={0.15}
          color="#a855f7"
          rotation={[0, Math.PI / 2, 0]}
          anchorX="center"
          anchorY="middle"
        >
          MODULES
        </Text>
      </group>

      {/* Placeholder for skill tree */}
      <group position={[4, 0, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.2, 3, 8]} />
          <meshStandardMaterial color="#065f46" />
        </mesh>
        {/* Branches */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 2) * 0.5, 1 + i * 0.5, Math.cos(i * 2) * 0.5]}
            rotation={[0, 0, Math.PI / 4]}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.05, 0.8, 6]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        ))}
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.15}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          SKILL TREE
        </Text>
      </group>

      {/* Placeholder for trophy shelf */}
      <group position={[0, 0, 3]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[3, 0.1, 0.5]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[3, 0.1, 0.5]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.15}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          TROPHIES
        </Text>
      </group>

      {/* Welcome text */}
      <Text
        position={[0, 3, -3]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Welcome to Lumina
      </Text>
      <Text
        position={[0, 2.5, -3]}
        fontSize={0.12}
        color="#71717a"
        anchorX="center"
        anchorY="middle"
      >
        Click on objects to interact
      </Text>
    </group>
  );
}

export default function LobbyScene() {
  const performanceTier = useSceneStore((state) => state.performanceTier);

  // Performance settings based on tier
  const dpr: [number, number] =
    performanceTier === 'ultra'
      ? [1.5, 2]
      : performanceTier === 'balanced'
        ? [1, 1.5]
        : [0.75, 1];

  return (
    <Canvas
      dpr={dpr}
      shadows={performanceTier !== 'minimal'}
      gl={{
        antialias: performanceTier !== 'minimal',
        powerPreference: performanceTier === 'minimal' ? 'low-power' : 'high-performance',
      }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={50} />

      <Suspense fallback={<LoadingPlaceholder />}>
        <LobbyEnvironment />
        <PlaceholderRoom />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
