'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveObject } from './InteractiveObject';

interface TerminalProps {
  position: [number, number, number];
  onInteract: () => void;
}

export function Terminal({ position, onInteract }: TerminalProps) {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      // Subtle screen flicker
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <InteractiveObject
      position={position}
      label="CODE TERMINAL"
      description="Open the sandbox editor"
      onClick={onInteract}
      color="#6366f1"
      hoverColor="#818cf8"
    >
      {/* Desk */}
      <RoundedBox args={[2.5, 0.1, 1]} position={[0, 0, 0]} radius={0.02}>
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </RoundedBox>

      {/* Monitor Stand */}
      <mesh position={[0, 0.3, -0.2]}>
        <cylinderGeometry args={[0.05, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Monitor */}
      <group position={[0, 0.8, -0.2]}>
        {/* Monitor Frame */}
        <RoundedBox args={[1.8, 1.1, 0.08]} radius={0.02}>
          <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.3} />
        </RoundedBox>

        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.05]}>
          <planeGeometry args={[1.65, 0.95]} />
          <meshStandardMaterial
            color="#0a0a0f"
            emissive="#6366f1"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Code lines on screen */}
        {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
          <mesh key={i} position={[-0.4 + i * 0.1, y, 0.06]}>
            <planeGeometry args={[0.6 + Math.random() * 0.4, 0.05]} />
            <meshBasicMaterial
              color={i === 1 ? '#22c55e' : '#6366f1'}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Keyboard */}
      <RoundedBox args={[1.2, 0.03, 0.4]} position={[0, 0.07, 0.3]} radius={0.01}>
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </RoundedBox>

      {/* Mouse */}
      <mesh position={[0.8, 0.06, 0.3]}>
        <capsuleGeometry args={[0.03, 0.06, 4, 8]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>
    </InteractiveObject>
  );
}
