'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveObject } from './InteractiveObject';

interface SkillTreeProps {
  position: [number, number, number];
  onInteract: () => void;
  progress?: {
    phase1: number;
    phase2: number;
    phase3: number;
    phase4: number;
    phase5: number;
    phase6: number;
  };
}

interface BranchProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  thickness: number;
  color: string;
  isActive: boolean;
}

function Branch({ startPos, endPos, thickness, color, isActive }: BranchProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate branch orientation
  const direction = endPos.clone().sub(startPos);
  const length = direction.length();
  const midPoint = startPos.clone().add(direction.multiplyScalar(0.5));

  // Calculate rotation to point from start to end
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      // Gentle sway animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + startPos.x) * 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[midPoint.x, midPoint.y, midPoint.z]}
      rotation={[euler.x, euler.y, euler.z]}
    >
      <cylinderGeometry args={[thickness * 0.8, thickness, length, 8]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        emissive={isActive ? color : '#000000'}
        emissiveIntensity={isActive ? 0.2 : 0}
      />
    </mesh>
  );
}

interface LeafClusterProps {
  position: [number, number, number];
  color: string;
  scale: number;
  isActive: boolean;
}

function LeafCluster({ position, color, scale, isActive }: LeafClusterProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Leaf cluster as a collection of small spheres */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 1.2) * 0.15,
            Math.cos(i * 0.8) * 0.1,
            Math.sin(i * 2) * 0.15,
          ]}
        >
          <sphereGeometry args={[0.08 + Math.random() * 0.04, 8, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SkillTree({ position, onInteract, progress }: SkillTreeProps) {
  const defaultProgress = progress || {
    phase1: 0,
    phase2: 0,
    phase3: 0,
    phase4: 0,
    phase5: 0,
    phase6: 0,
  };

  // Tree structure
  const trunk = useMemo(() => ({
    start: new THREE.Vector3(0, 0, 0),
    end: new THREE.Vector3(0, 2, 0),
  }), []);

  const branches = useMemo(() => [
    // Phase 1 - always partially visible
    {
      start: new THREE.Vector3(0, 0.5, 0),
      end: new THREE.Vector3(-0.6, 1.2, 0.3),
      phase: 'phase1',
      color: '#6366f1',
    },
    // Phase 2
    {
      start: new THREE.Vector3(0, 0.8, 0),
      end: new THREE.Vector3(0.7, 1.4, -0.2),
      phase: 'phase2',
      color: '#8b5cf6',
    },
    // Phase 3
    {
      start: new THREE.Vector3(0, 1.1, 0),
      end: new THREE.Vector3(-0.5, 1.8, -0.4),
      phase: 'phase3',
      color: '#06b6d4',
    },
    // Phase 4
    {
      start: new THREE.Vector3(0, 1.4, 0),
      end: new THREE.Vector3(0.6, 2.0, 0.3),
      phase: 'phase4',
      color: '#f59e0b',
    },
    // Phase 5
    {
      start: new THREE.Vector3(0, 1.7, 0),
      end: new THREE.Vector3(-0.4, 2.4, 0.2),
      phase: 'phase5',
      color: '#ef4444',
    },
    // Phase 6
    {
      start: new THREE.Vector3(0, 1.9, 0),
      end: new THREE.Vector3(0.3, 2.6, -0.1),
      phase: 'phase6',
      color: '#10b981',
    },
  ], []);

  return (
    <InteractiveObject
      position={position}
      label="SKILL TREE"
      description="View your progress"
      onClick={onInteract}
      color="#10b981"
      hoverColor="#34d399"
    >
      {/* Ground/pot */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.2, 16]} />
        <meshStandardMaterial color="#44403c" roughness={0.9} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#1c1917" roughness={1} />
      </mesh>

      {/* Main trunk */}
      <Branch
        startPos={trunk.start}
        endPos={trunk.end}
        thickness={0.1}
        color="#44403c"
        isActive={true}
      />

      {/* Branches based on progress */}
      {branches.map((branch, i) => {
        const phaseProgress = defaultProgress[branch.phase as keyof typeof defaultProgress] || 0;
        const isActive = phaseProgress > 0;
        const isComplete = phaseProgress >= 100;

        return (
          <group key={i}>
            <Branch
              startPos={branch.start}
              endPos={branch.end}
              thickness={0.04}
              color={isActive ? branch.color : '#3f3f46'}
              isActive={isActive}
            />
            <LeafCluster
              position={[branch.end.x, branch.end.y, branch.end.z]}
              color={branch.color}
              scale={isComplete ? 1.2 : 0.8}
              isActive={isActive}
            />
          </group>
        );
      })}

      {/* Top crown (only if significant progress) */}
      {(defaultProgress.phase1 > 50 || defaultProgress.phase2 > 0) && (
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.3}
            roughness={0.6}
          />
        </mesh>
      )}
    </InteractiveObject>
  );
}
