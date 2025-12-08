'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, Check } from 'lucide-react';

function ForgotPasswordForm() {
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-full max-w-md px-8">
          <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)] text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-[var(--color-muted)] mb-6">
              We&apos;ve sent a password reset link to <strong className="text-[var(--color-foreground)]">{email}</strong>. Click the link to reset your password.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Lumina
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Learn 3D Web Development
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)]">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          <h2 className="text-xl font-semibold mb-2">
            Reset your password
          </h2>
          <p className="text-[var(--color-muted)] mb-6 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
              <span>Send Reset Link</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
