'use client';

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import { useState } from 'react';
import { Code, Eye, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

// Custom Lumina theme for Sandpack
const luminaTheme = {
  colors: {
    surface1: '#0a0a0f',
    surface2: '#18181b',
    surface3: '#27272a',
    clickable: '#71717a',
    base: '#fafafa',
    disabled: '#3f3f46',
    hover: '#6366f1',
    accent: '#6366f1',
    error: '#ef4444',
    errorSurface: '#7f1d1d',
    warning: '#f59e0b',
    warningSurface: '#78350f',
  },
  syntax: {
    plain: '#fafafa',
    comment: { color: '#6b7280', fontStyle: 'italic' as const },
    keyword: '#c084fc',
    tag: '#22d3ee',
    punctuation: '#71717a',
    definition: '#6366f1',
    property: '#22c55e',
    static: '#f59e0b',
    string: '#a3e635',
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    size: '14px',
    lineHeight: '1.6',
  },
};

// R3F Starter Template
const r3fTemplate = {
  '/App.tsx': `import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Experience } from './Experience'

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a0a0f' }}>
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
        <Experience />
        <OrbitControls />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}`,
  '/Experience.tsx': `import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Experience() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      {/* Rotating Cube */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  )
}`,
  '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)`,
  '/styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0a0a0f;
  overflow: hidden;
}`,
};

// Vanilla Three.js Template
const vanillaTemplate = {
  '/index.ts': `import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a0f)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(3, 3, 3)

// Renderer
const canvas = document.querySelector('#canvas') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true
scene.add(directionalLight)

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 })
const cube = new THREE.Mesh(geometry, material)
cube.castShadow = true
scene.add(cube)

// Floor
const floorGeometry = new THREE.PlaneGeometry(10, 10)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.5
floor.receiveShadow = true
scene.add(floor)

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.y += 0.01
  controls.update()
  renderer.render(scene, camera)
}

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

animate()`,
  '/index.html': `<!DOCTYPE html>
<html>
  <head>
    <title>Three.js Sandbox</title>
    <style>
      * { margin: 0; padding: 0; }
      body { overflow: hidden; }
      #canvas { display: block; }
    </style>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script type="module" src="/index.ts"></script>
  </body>
</html>`,
};

interface SandpackEditorProps {
  template?: 'r3f' | 'vanilla';
  initialFiles?: Record<string, string>;
  readOnly?: boolean;
  showConsole?: boolean;
  showFileExplorer?: boolean;
}

function EditorControls() {
  const { sandpack } = useSandpack();
  const [consoleOpen, setConsoleOpen] = useState(false);

  return (
    <div className="border-t border-[var(--color-border)]">
      <button
        onClick={() => setConsoleOpen(!consoleOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors w-full"
      >
        <Terminal className="w-4 h-4" />
        Console
        {consoleOpen ? (
          <ChevronDown className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronUp className="w-4 h-4 ml-auto" />
        )}
      </button>
      {consoleOpen && (
        <div className="h-32 border-t border-[var(--color-border)]">
          <SandpackConsole />
        </div>
      )}
    </div>
  );
}

export function SandpackEditor({
  template = 'r3f',
  initialFiles,
  readOnly = false,
  showConsole = true,
  showFileExplorer = true,
}: SandpackEditorProps) {
  const files = initialFiles || (template === 'r3f' ? r3fTemplate : vanillaTemplate);

  const dependencies: Record<string, string> =
    template === 'r3f'
      ? {
          three: '^0.170.0',
          '@react-three/fiber': '^8.17.0',
          '@react-three/drei': '^9.114.0',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
        }
      : {
          three: '^0.170.0',
        };

  return (
    <SandpackProvider
      template={template === 'r3f' ? 'react-ts' : 'vanilla-ts'}
      theme={luminaTheme}
      files={files}
      customSetup={{
        dependencies,
      }}
      options={{
        externalResources: [],
        recompileMode: 'delayed',
        recompileDelay: 500,
      }}
    >
      <SandpackLayout className="!rounded-none !border-0">
        {showFileExplorer && (
          <div className="w-48 border-r border-[var(--color-border)] hidden lg:block">
            <SandpackFileExplorer />
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-card)]">
            <Code className="w-4 h-4 text-[var(--color-muted)]" />
            <span className="text-sm text-[var(--color-muted)]">Editor</span>
          </div>
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent
            readOnly={readOnly}
            style={{ height: '100%', minHeight: '400px' }}
          />
          {showConsole && <EditorControls />}
        </div>
        <div className="flex-1 flex flex-col min-w-0 border-l border-[var(--color-border)]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-card)]">
            <Eye className="w-4 h-4 text-[var(--color-muted)]" />
            <span className="text-sm text-[var(--color-muted)]">Preview</span>
          </div>
          <SandpackPreview
            showNavigator={false}
            showRefreshButton
            style={{ height: '100%', minHeight: '400px' }}
          />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
}
