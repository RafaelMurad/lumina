'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the 3D lobby to avoid SSR issues
const LobbyScene = dynamic(() => import('@/components/three/Lobby/LobbyScene'), {
  ssr: false,
  loading: () => <LobbyLoading />,
});

function LobbyLoading() {
  return (
    <div className="fixed inset-0 bg-[var(--color-background)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
        <p className="text-[var(--color-muted)]">Loading the Lobby...</p>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <div className="fixed inset-0 pt-16">
      <Suspense fallback={<LobbyLoading />}>
        <LobbyScene />
      </Suspense>
    </div>
  );
}
