'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';
import { PLANS } from '@/lib/stripe/config';
import { checkout } from '@/lib/stripe/client';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function PricingPage() {
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = async (planId: string, priceId: string) => {
    if (!user || isGuest) {
      // Redirect to login
      window.location.href = '/auth/login?redirect=/pricing';
      return;
    }

    setLoading(planId);
    try {
      await checkout(priceId);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Start Your 3D Journey
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
            Learn WebGL, Three.js, and React Three Fiber through interactive lessons
            and hands-on projects.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-[var(--color-card)] rounded-full p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                Save 35%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{PLANS.free.name}</h3>
              <p className="text-[var(--color-muted)] text-sm">
                {PLANS.free.description}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-[var(--color-muted)]">/forever</span>
            </div>

            <Link
              href="/learn"
              className="block w-full py-3 px-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-center font-medium hover:bg-[var(--color-card-hover)] transition-colors mb-8"
            >
              Get Started Free
            </Link>

            <ul className="space-y-4">
              {PLANS.free.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent border-2 border-[var(--color-primary)] rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[var(--color-primary)] text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-[var(--color-muted)] text-sm">
                {billingCycle === 'yearly'
                  ? PLANS.pro_yearly.description
                  : PLANS.pro_monthly.description}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">
                ${billingCycle === 'yearly' ? '12' : '19'}
              </span>
              <span className="text-[var(--color-muted)]">/month</span>
              {billingCycle === 'yearly' && (
                <span className="block text-sm text-[var(--color-muted)] mt-1">
                  Billed annually ($149/year)
                </span>
              )}
            </div>

            <button
              onClick={() => handleSubscribe(
                billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly',
                billingCycle === 'yearly'
                  ? PLANS.pro_yearly.stripePriceId
                  : PLANS.pro_monthly.stripePriceId
              )}
              disabled={loading !== null}
              className="w-full py-3 px-4 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors mb-8 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Upgrade to Pro
                </>
              )}
            </button>

            <ul className="space-y-4">
              {PLANS.pro_monthly.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-[var(--color-muted)] text-sm">
                Yes! You can cancel your subscription at any time. You&apos;ll continue
                to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What if I&apos;m not satisfied?</h3>
              <p className="text-[var(--color-muted)] text-sm">
                We offer a 14-day money-back guarantee. If you&apos;re not happy with
                Pro, just contact us for a full refund.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Do I keep my progress if I cancel?</h3>
              <p className="text-[var(--color-muted)] text-sm">
                Your progress and achievements are saved permanently. If you
                resubscribe, you&apos;ll pick up right where you left off.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is there a team or enterprise plan?</h3>
              <p className="text-[var(--color-muted)] text-sm">
                Not yet, but we&apos;re working on it! Contact us at team@lumina.dev
                if you&apos;re interested in team pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
