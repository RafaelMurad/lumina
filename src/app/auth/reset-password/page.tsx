'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, Check, Lock } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if there's a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();
  }, [supabase.auth]);

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: 'Too short', color: 'bg-red-500', width: '25%' };
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { label: 'Weak', color: 'bg-orange-500', width: '33%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score <= 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-full max-w-md px-8">
          <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)] text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Invalid or expired link</h2>
            <p className="text-[var(--color-muted)] mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-full max-w-md px-8">
          <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)] text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Password updated!</h2>
            <p className="text-[var(--color-muted)] mb-6">
              Your password has been successfully reset. Redirecting you to the dashboard...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
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

        {/* Reset Password Card */}
        <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)]">
          <h2 className="text-xl font-semibold mb-2">
            Set new password
          </h2>
          <p className="text-[var(--color-muted)] mb-6 text-sm">
            Enter your new password below.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-indigo-500 focus:outline-none transition-colors pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
