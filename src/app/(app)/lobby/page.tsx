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
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
        <p className="text-gray-400">Loading the Lobby...</p>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#0a0a0f]">
      <Suspense fallback={<LobbyLoading />}>
        <LobbyScene />
      </Suspense>
    </div>
  );
}
