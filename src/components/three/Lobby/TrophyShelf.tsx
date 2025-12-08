'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveObject } from './InteractiveObject';

interface TrophyShelfProps {
  position: [number, number, number];
  onInteract: () => void;
  achievements?: string[];
}

interface TrophyProps {
  position: [number, number, number];
  color: string;
  unlocked: boolean;
  type: 'cup' | 'star' | 'medal' | 'gem';
}

function Trophy({ position, color, unlocked, type }: TrophyProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && unlocked) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  const material = unlocked ? (
    <meshStandardMaterial
      color={color}
      metalness={0.8}
      roughness={0.2}
      emissive={color}
      emissiveIntensity={0.2}
    />
  ) : (
    <meshStandardMaterial color="#3f3f46" roughness={0.9} transparent opacity={0.3} />
  );

  return (
    <group ref={groupRef} position={position}>
      {type === 'cup' && (
        <>
          {/* Cup body */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.2, 16]} />
            {material}
          </mesh>
          {/* Cup base */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.07, 0.05, 16]} />
            {material}
          </mesh>
          {/* Handles */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.1, 0.15, 0]} rotation={[0, 0, side * 0.3]}>
              <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
              {material}
            </mesh>
          ))}
        </>
      )}

      {type === 'star' && (
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
          <octahedronGeometry args={[0.1, 0]} />
          {material}
        </mesh>
      )}

      {type === 'medal' && (
        <>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
            {material}
          </mesh>
          {/* Ribbon */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.01]} />
            <meshStandardMaterial color={unlocked ? '#ef4444' : '#3f3f46'} />
          </mesh>
        </>
      )}

      {type === 'gem' && (
        <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.08, 0]} />
          {material}
        </mesh>
      )}

      {/* Glow for unlocked trophies */}
      {unlocked && (
        <pointLight color={color} intensity={0.3} distance={0.5} position={[0, 0.15, 0]} />
      )}
    </group>
  );
}

export function TrophyShelf({ position, onInteract, achievements = [] }: TrophyShelfProps) {
  const trophies: TrophyProps[] = [
    { position: [-0.4, 0, 0], color: '#fbbf24', unlocked: achievements.includes('first_render'), type: 'cup' },
    { position: [-0.15, 0, 0], color: '#6366f1', unlocked: achievements.includes('phase1_complete'), type: 'star' },
    { position: [0.1, 0, 0], color: '#22c55e', unlocked: achievements.includes('no_hints'), type: 'medal' },
    { position: [0.35, 0, 0], color: '#a855f7', unlocked: achievements.includes('speed_demon'), type: 'gem' },
  ];

  return (
    <InteractiveObject
      position={position}
      label="ACHIEVEMENTS"
      description="View your trophies"
      onClick={onInteract}
      color="#fbbf24"
      hoverColor="#fcd34d"
    >
      {/* Shelf */}
      <RoundedBox args={[1.2, 0.08, 0.35]} position={[0, 0, 0]} radius={0.02}>
        <meshStandardMaterial color="#44403c" roughness={0.8} />
      </RoundedBox>

      {/* Back panel */}
      <mesh position={[0, 0.3, -0.15]}>
        <boxGeometry args={[1.2, 0.6, 0.02]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>

      {/* Trophies */}
      <group position={[0, 0.04, 0]}>
        {trophies.map((trophy, i) => (
          <Trophy key={i} {...trophy} />
        ))}
      </group>

      {/* Shelf brackets */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0.1]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
      ))}
    </InteractiveObject>
  );
}
