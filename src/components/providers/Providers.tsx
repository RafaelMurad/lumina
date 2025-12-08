'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { CookieConsent } from '@/components/ui/CookieConsent';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          {children}
          <CookieConsent />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
