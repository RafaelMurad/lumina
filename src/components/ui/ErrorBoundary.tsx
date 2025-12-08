'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>

            <p className="text-[var(--color-muted)] mb-6">
              We encountered an unexpected error. Please try again or return to the dashboard.
            </p>

            {this.state.error && process.env.NODE_ENV === 'development' && (
              <pre className="text-left text-xs bg-[var(--color-surface)] p-4 rounded-lg mb-6 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] font-medium hover:bg-[var(--color-surface)] transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-friendly wrapper for specific errors
export function ErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>

        <p className="text-[var(--color-muted)] mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

// 3D-specific error fallback
export function ThreeErrorFallback() {
  return (
    <div className="h-full flex items-center justify-center bg-[var(--color-background)] rounded-lg">
      <div className="text-center p-8">
        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
        </div>
        <h3 className="font-semibold mb-2">3D rendering unavailable</h3>
        <p className="text-sm text-[var(--color-muted)]">
          Your browser may not support WebGL or hardware acceleration is disabled.
        </p>
      </div>
    </div>
  );
}
