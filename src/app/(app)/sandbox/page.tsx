'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Play, RotateCcw, Download, Share2, Code, Eye } from 'lucide-react';

const defaultCode = `// Welcome to the Lumina Sandbox!
// Write Three.js code and see it render in real-time.

import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  roughness: 0.4,
  metalness: 0.6,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Animation loop
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

// Export for Lumina runtime
export { scene, camera, animate };
`;

export default function SandboxPage() {
  const [code, setCode] = useState(defaultCode);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </Link>
          <div className="h-6 w-px bg-[var(--color-border)]" />
          <h1 className="font-semibold">Sandbox</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <div className="h-6 w-px bg-[var(--color-border)]" />
          <Button variant="primary" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
            activeTab === 'code'
              ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500'
              : 'text-[var(--color-muted)]'
          }`}
        >
          <Code className="w-4 h-4" />
          Code
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
            activeTab === 'preview'
              ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500'
              : 'text-[var(--color-muted)]'
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div
          className={`flex-1 flex flex-col ${
            activeTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background)]">
            <Code className="w-4 h-4 text-[var(--color-muted)]" />
            <span className="text-sm text-[var(--color-muted)]">main.js</span>
          </div>
          <div className="flex-1 overflow-auto bg-[#1e1e2e]">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-transparent text-sm font-mono text-gray-300 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-[var(--color-border)]" />

        {/* Preview */}
        <div
          className={`flex-1 flex flex-col ${
            activeTab === 'code' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background)]">
            <Eye className="w-4 h-4 text-[var(--color-muted)]" />
            <span className="text-sm text-[var(--color-muted)]">Preview</span>
          </div>
          <div className="flex-1 bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-[var(--color-muted)] mb-2">
                Live 3D preview coming in Sprint 2
              </p>
              <p className="text-sm text-[var(--color-muted)]/60">
                Write code on the left, see it render here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-[var(--color-border)] bg-[var(--color-card)] text-xs text-[var(--color-muted)]">
        <div className="flex items-center gap-4">
          <span>Three.js 0.181</span>
          <span>|</span>
          <span>WebGL2</span>
        </div>
        <div className="flex items-center gap-4">
          <span>FPS: --</span>
          <span>|</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
