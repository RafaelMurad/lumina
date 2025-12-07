import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: {
    default: 'Lumina - Learn 3D Web Development',
    template: '%s | Lumina',
  },
  description:
    'Master Three.js, React Three Fiber, and WebGL through immersive 3D learning experiences. Learn inside the medium.',
  keywords: [
    'Three.js',
    'React Three Fiber',
    'WebGL',
    'WebGPU',
    '3D',
    'Learn',
    'Tutorial',
    'Course',
  ],
  authors: [{ name: 'Lumina' }],
  creator: 'Lumina',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lumina.dev',
    title: 'Lumina - Learn 3D Web Development',
    description:
      'Master Three.js, React Three Fiber, and WebGL through immersive 3D learning experiences.',
    siteName: 'Lumina',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumina - Learn 3D Web Development',
    description:
      'Master Three.js, React Three Fiber, and WebGL through immersive 3D learning experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
