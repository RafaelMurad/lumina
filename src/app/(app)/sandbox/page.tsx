'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
  Box,
  Loader2,
  Check,
  Save,
} from 'lucide-react';

// Dynamically import Sandpack to avoid SSR issues
const SandpackEditor = dynamic(
  () =>
    import('@/components/ui/Editor/SandpackEditor').then(
      (mod) => mod.SandpackEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

type Template = 'r3f' | 'vanilla';

// Default starter code for templates
const R3F_STARTER = `import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

function Scene() {
  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="#6366f1" />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}`;

const VANILLA_STARTER = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`;

export default function SandboxPage() {
  const { user, isGuest } = useAuth();
  const [template, setTemplate] = useState<Template>('r3f');
  const [key, setKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const supabase = createClient();

  const handleTemplateChange = (newTemplate: Template) => {
    setTemplate(newTemplate);
    setKey((k) => k + 1);
    setSaveSuccess(false);
  };

  const handleReset = () => {
    setKey((k) => k + 1);
    setSaveSuccess(false);
  };

  const handleExport = useCallback(() => {
    // Create a zip-like structure with the code
    const code = template === 'r3f' ? R3F_STARTER : VANILLA_STARTER;
    const packageJson = JSON.stringify({
      name: 'lumina-sandbox-export',
      version: '1.0.0',
      dependencies: template === 'r3f'
        ? {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            '@react-three/fiber': '^8.15.0',
            '@react-three/drei': '^9.88.0',
            'three': '^0.158.0'
          }
        : {
            'three': '^0.158.0'
          }
    }, null, 2);

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Lumina Export</title>
  <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
// Code exported from Lumina Sandbox
${code}
  </script>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumina-sandbox.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [template]);

  const handleSave = useCallback(async () => {
    if (isGuest) {
      alert('Please sign in to save your projects');
      return;
    }

    setIsSaving(true);
    try {
      const code = template === 'r3f' ? R3F_STARTER : VANILLA_STARTER;
      const { error } = await (supabase.from('saved_projects') as any).insert({
        user_id: user?.id,
        title: `${template === 'r3f' ? 'R3F' : 'Vanilla'} Project - ${new Date().toLocaleDateString()}`,
        code: { [template === 'r3f' ? '/App.tsx' : '/index.ts']: code },
        is_public: false,
      });

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [template, user, isGuest, supabase]);

  const handleShare = useCallback(async () => {
    if (isGuest) {
      alert('Please sign in to share your projects');
      return;
    }

    // For now, we'll copy a shareable CodeSandbox link
    const code = template === 'r3f' ? R3F_STARTER : VANILLA_STARTER;
    const encoded = encodeURIComponent(code);

    // Create a codesandbox URL
    const parameters = {
      files: {
        'App.tsx': { content: code },
        'package.json': {
          content: JSON.stringify({
            dependencies: template === 'r3f'
              ? { react: '^18', 'react-dom': '^18', '@react-three/fiber': '^8', '@react-three/drei': '^9', three: '^0.158' }
              : { three: '^0.158' }
          })
        }
      }
    };

    // Copy to clipboard
    const shareText = `Check out my 3D creation from Lumina!\n\nTemplate: ${template === 'r3f' ? 'React Three Fiber' : 'Vanilla Three.js'}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 2000);
    } catch {
      alert('Failed to copy share link');
    }
  }, [template, isGuest]);

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

        {/* Template Switcher */}
        <div className="flex items-center gap-2 bg-[var(--color-background)] rounded-lg p-1">
          <button
            onClick={() => handleTemplateChange('r3f')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              template === 'r3f'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            React Three Fiber
          </button>
          <button
            onClick={() => handleTemplateChange('vanilla')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              template === 'vanilla'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <Box className="w-4 h-4" />
            Vanilla Three.js
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 mr-2 text-emerald-400" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saveSuccess ? 'Saved!' : 'Save'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Share Success Modal */}
      {showShareModal && (
        <div className="fixed top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg px-4 py-2 text-emerald-400 z-50">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <SandpackEditor
          key={key}
          template={template}
          showConsole={true}
          showFileExplorer={true}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-[var(--color-border)] bg-[var(--color-card)] text-xs text-[var(--color-muted)]">
        <div className="flex items-center gap-4">
          <span>Three.js 0.170</span>
          <span>|</span>
          <span>{template === 'r3f' ? 'React Three Fiber' : 'Vanilla'}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>WebGL2</span>
          <span>|</span>
          <span className="text-emerald-400">Ready</span>
        </div>
      </div>
    </div>
  );
}
