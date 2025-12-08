'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveObjectProps {
  position: [number, number, number];
  label: string;
  description?: string;
  onClick?: () => void;
  color?: string;
  hoverColor?: string;
  icon?: string;
  children?: React.ReactNode;
}

export function InteractiveObject({
  position,
  label,
  description,
  onClick,
  color = '#6366f1',
  hoverColor = '#818cf8',
  children,
}: InteractiveObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Hover animation
      const targetScale = hovered ? 1.05 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Subtle floating animation
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    onClick?.();
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={handleClick}
    >
      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight
          color={hoverColor}
          intensity={0.5}
          distance={3}
          position={[0, 0.5, 0]}
        />
      )}

      {/* Children (the actual 3D object) */}
      {children}

      {/* Label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.15}
        color={hovered ? hoverColor : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {label}
      </Text>

      {/* Tooltip on hover */}
      {hovered && description && (
        <Html
          position={[0, 2, 0]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg shadow-xl">
            <p className="text-sm text-gray-300">{description}</p>
            <p className="text-xs text-indigo-400 mt-1">Click to interact</p>
          </div>
        </Html>
      )}

      {/* Click ripple effect */}
      {clicked && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color={hoverColor} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
