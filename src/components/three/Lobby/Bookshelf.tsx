'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveObject } from './InteractiveObject';

interface BookshelfProps {
  position: [number, number, number];
  onInteract: () => void;
}

const BOOK_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
];

interface BookProps {
  position: [number, number, number];
  color: string;
  height: number;
  width: number;
  rotation?: number;
}

function Book({ position, color, height, width, rotation = 0 }: BookProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[width, height, 0.15]} radius={0.01}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </RoundedBox>
      {/* Book spine detail */}
      <mesh position={[0, 0, 0.076]}>
        <planeGeometry args={[width * 0.8, height * 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function Bookshelf({ position, onInteract }: BookshelfProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <InteractiveObject
      position={position}
      label="LEARNING PATH"
      description="Browse course modules"
      onClick={onInteract}
      color="#a855f7"
      hoverColor="#c084fc"
    >
      {/* Shelf frame */}
      <group ref={groupRef}>
        {/* Back panel */}
        <mesh position={[0, 1.2, -0.2]}>
          <boxGeometry args={[1.8, 2.4, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Shelves */}
        {[0, 0.8, 1.6, 2.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[1.8, 0.05, 0.4]} />
            <meshStandardMaterial color="#27272a" roughness={0.9} />
          </mesh>
        ))}

        {/* Side panels */}
        {[-0.9, 0.9].map((x, i) => (
          <mesh key={i} position={[x, 1.2, 0]}>
            <boxGeometry args={[0.05, 2.45, 0.4]} />
            <meshStandardMaterial color="#27272a" roughness={0.9} />
          </mesh>
        ))}

        {/* Books - Row 1 (bottom) */}
        <group position={[0, 0.3, 0]}>
          {[-0.6, -0.35, -0.1, 0.15, 0.4, 0.65].map((x, i) => (
            <Book
              key={i}
              position={[x, 0, 0]}
              color={BOOK_COLORS[i % BOOK_COLORS.length]}
              height={0.5 + Math.random() * 0.1}
              width={0.18 + Math.random() * 0.05}
            />
          ))}
        </group>

        {/* Books - Row 2 */}
        <group position={[0, 1.1, 0]}>
          {[-0.5, -0.2, 0.1, 0.4, 0.7].map((x, i) => (
            <Book
              key={i}
              position={[x, 0, 0]}
              color={BOOK_COLORS[(i + 3) % BOOK_COLORS.length]}
              height={0.45 + Math.random() * 0.15}
              width={0.2 + Math.random() * 0.08}
            />
          ))}
        </group>

        {/* Books - Row 3 (top) */}
        <group position={[0, 1.9, 0]}>
          {[-0.55, -0.25, 0.05, 0.35, 0.6].map((x, i) => (
            <Book
              key={i}
              position={[x, 0, 0]}
              color={BOOK_COLORS[(i + 5) % BOOK_COLORS.length]}
              height={0.4 + Math.random() * 0.12}
              width={0.15 + Math.random() * 0.1}
            />
          ))}
        </group>

        {/* Globe on top */}
        <mesh position={[0.5, 2.65, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#6366f1" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
    </InteractiveObject>
  );
}
