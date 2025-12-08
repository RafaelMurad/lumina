'use client';

import { useState, useEffect } from 'react';
import { useSceneStore } from '@/stores/sceneStore';

export type PerformanceTier = 'ultra' | 'balanced' | 'minimal';

interface GPUInfo {
  tier: number;
  type: 'FALLBACK' | 'INTEGRATED' | 'DISCRETE' | 'APPLE';
  isMobile: boolean;
  gpu?: string;
}

interface TierConfig {
  dpr: [number, number];
  shadows: boolean | 'basic' | 'soft';
  antialias: boolean;
  postProcessing: string[];
  frameloop: 'always' | 'demand';
  textureSize: number;
}

export const TIER_CONFIGS: Record<PerformanceTier, TierConfig> = {
  ultra: {
    dpr: [1.5, 2],
    shadows: 'soft',
    antialias: true,
    postProcessing: ['bloom', 'ssao', 'vignette'],
    frameloop: 'always',
    textureSize: 2048,
  },
  balanced: {
    dpr: [1, 1.5],
    shadows: 'basic',
    antialias: true,
    postProcessing: ['bloom'],
    frameloop: 'always',
    textureSize: 1024,
  },
  minimal: {
    dpr: [0.75, 1],
    shadows: false,
    antialias: false,
    postProcessing: [],
    frameloop: 'demand',
    textureSize: 512,
  },
};

// Simple GPU detection without external dependencies
function detectGPU(): GPUInfo {
  if (typeof window === 'undefined') {
    return { tier: 1, type: 'FALLBACK', isMobile: false };
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    return { tier: 0, type: 'FALLBACK', isMobile: false };
  }

  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : 'Unknown';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Detect GPU type and assign tier
  const gpuLower = renderer.toLowerCase();

  // Apple Silicon
  if (gpuLower.includes('apple')) {
    if (gpuLower.includes('m1 pro') || gpuLower.includes('m1 max') ||
        gpuLower.includes('m2') || gpuLower.includes('m3')) {
      return { tier: 3, type: 'APPLE', isMobile, gpu: renderer };
    }
    return { tier: 2, type: 'APPLE', isMobile, gpu: renderer };
  }

  // NVIDIA
  if (gpuLower.includes('nvidia') || gpuLower.includes('geforce')) {
    if (gpuLower.includes('rtx') || gpuLower.includes('gtx 10') ||
        gpuLower.includes('gtx 16') || gpuLower.includes('gtx 20')) {
      return { tier: 3, type: 'DISCRETE', isMobile, gpu: renderer };
    }
    return { tier: 2, type: 'DISCRETE', isMobile, gpu: renderer };
  }

  // AMD
  if (gpuLower.includes('amd') || gpuLower.includes('radeon')) {
    if (gpuLower.includes('rx 6') || gpuLower.includes('rx 7') ||
        gpuLower.includes('vega')) {
      return { tier: 3, type: 'DISCRETE', isMobile, gpu: renderer };
    }
    return { tier: 2, type: 'DISCRETE', isMobile, gpu: renderer };
  }

  // Intel
  if (gpuLower.includes('intel')) {
    if (gpuLower.includes('iris') || gpuLower.includes('xe')) {
      return { tier: 2, type: 'INTEGRATED', isMobile, gpu: renderer };
    }
    return { tier: 1, type: 'INTEGRATED', isMobile, gpu: renderer };
  }

  // Mobile GPUs
  if (gpuLower.includes('adreno') || gpuLower.includes('mali') ||
      gpuLower.includes('powervr')) {
    return { tier: 1, type: 'INTEGRATED', isMobile: true, gpu: renderer };
  }

  // Fallback
  return { tier: isMobile ? 1 : 2, type: 'FALLBACK', isMobile, gpu: renderer };
}

function getTierFromGPU(gpuInfo: GPUInfo): PerformanceTier {
  if (gpuInfo.isMobile) return 'minimal';
  if (gpuInfo.tier >= 3) return 'ultra';
  if (gpuInfo.tier >= 2) return 'balanced';
  return 'minimal';
}

export function usePerformanceTier() {
  const [gpuInfo, setGpuInfo] = useState<GPUInfo | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const { performanceTier, setPerformanceTier } = useSceneStore();

  useEffect(() => {
    const detect = () => {
      const info = detectGPU();
      setGpuInfo(info);

      // Only auto-set if not already configured
      const storedTier = localStorage.getItem('lumina_performance_tier');
      if (storedTier) {
        setPerformanceTier(storedTier as PerformanceTier);
      } else {
        const autoTier = getTierFromGPU(info);
        setPerformanceTier(autoTier);
        localStorage.setItem('lumina_performance_tier', autoTier);
      }

      setIsDetecting(false);
    };

    detect();
  }, [setPerformanceTier]);

  const setTier = (tier: PerformanceTier) => {
    setPerformanceTier(tier);
    localStorage.setItem('lumina_performance_tier', tier);
  };

  const config = TIER_CONFIGS[performanceTier];

  return {
    tier: performanceTier,
    setTier,
    config,
    gpuInfo,
    isDetecting,
  };
}
