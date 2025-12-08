'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Github, Mail, Loader2, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';

function SignupForm() {
  const { signInWithGithub, signInWithGoogle, signUpWithEmail, isLoading } = useAuth();
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState<'github' | 'google' | 'email' | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGithubSignUp = async () => {
    setIsSigningUp('github');
    setError(null);
    try {
      await signInWithGithub();
    } catch (error) {
      console.error('GitHub sign up failed:', error);
      setIsSigningUp(null);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSigningUp('google');
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign up failed:', error);
      setIsSigningUp(null);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields');
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
    setIsSigningUp('email');
    setError(null);
    const result = await signUpWithEmail(email, password, fullName);
    if (result.error) {
      setError(result.error);
      setIsSigningUp(null);
    } else {
      setSuccess(true);
    }
  };

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
              We&apos;ve sent a confirmation link to <strong className="text-[var(--color-foreground)]">{email}</strong>. Click the link to activate your account.
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

  if (showEmailForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12">
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

          {/* Email Signup Card */}
          <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)]">
            <button
              onClick={() => {
                setShowEmailForm(false);
                setError(null);
              }}
              className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all options
            </button>

            <h2 className="text-xl font-semibold mb-6">
              Create your account
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name (optional)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password *</label>
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
                <label className="block text-sm font-medium mb-2">Confirm Password *</label>
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
                disabled={isLoading || isSigningUp !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningUp === 'email' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                <span>Create Account</span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-indigo-400 hover:underline">
                Sign in
              </Link>
            </p>
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

        {/* Signup Card */}
        <div className="bg-[var(--color-card)] rounded-2xl p-8 border border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-center mb-6">
            Create your account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* GitHub */}
            <button
              onClick={handleGithubSignUp}
              disabled={isLoading || isSigningUp !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#24292e] hover:bg-[#2f363d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningUp === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span>Sign up with GitHub</span>
            </button>

            {/* Google */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading || isSigningUp !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningUp === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Sign up with Google</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-card)] text-[var(--color-muted)]">
                or
              </span>
            </div>
          </div>

          {/* Email */}
          <button
            onClick={() => setShowEmailForm(true)}
            disabled={isLoading || isSigningUp !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            <span>Sign up with Email</span>
          </button>
        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-indigo-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-indigo-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
