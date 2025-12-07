import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-md px-8 text-center">
        <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-[var(--color-muted)] mb-6">
            Something went wrong during sign in. Please try again.
          </p>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
