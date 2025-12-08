'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
  Box,
  Loader2,
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

export default function SandboxPage() {
  const [template, setTemplate] = useState<Template>('r3f');
  const [key, setKey] = useState(0); // For forcing re-render on template change

  const handleTemplateChange = (newTemplate: Template) => {
    setTemplate(newTemplate);
    setKey((k) => k + 1);
  };

  const handleReset = () => {
    setKey((k) => k + 1);
  };

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
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

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
