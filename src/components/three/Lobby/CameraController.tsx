'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/stores/sceneStore';

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const { cameraTarget, cameraPosition } = useSceneStore();

  // Smooth camera transition to target
  useFrame(() => {
    if (controlsRef.current) {
      if (cameraTarget) {
        // Lerp the controls target
        controlsRef.current.target.lerp(
          new THREE.Vector3(...cameraTarget),
          0.05
        );
      }

      if (cameraPosition) {
        // Lerp camera position
        camera.position.lerp(
          new THREE.Vector3(...cameraPosition),
          0.05
        );
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3}
      maxDistance={15}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
      dampingFactor={0.05}
      enableDamping
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
}
