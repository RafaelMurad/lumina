// Stripe configuration and pricing

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Get started with WebGL basics',
    price: 0,
    features: [
      'Phase 1: WebGL Foundations (8 lessons)',
      'Basic sandbox environment',
      'Guest mode progress tracking',
      'Community Discord access',
    ],
    limits: {
      phases: [1],
    },
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    description: 'Full access to all content',
    price: 19,
    interval: 'month' as const,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    features: [
      'All 4 phases (30+ lessons)',
      'Advanced sandbox with templates',
      'Downloadable project files',
      'Certificates of completion',
      'Priority support',
      'Early access to new content',
    ],
    limits: {
      phases: [1, 2, 3, 4],
    },
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    description: 'Best value - 2 months free',
    price: 149,
    interval: 'year' as const,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '',
    features: [
      'Everything in Pro Monthly',
      'Save $79/year (2 months free)',
      'Lifetime access to current content',
    ],
    limits: {
      phases: [1, 2, 3, 4],
    },
    popular: true,
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type Plan = (typeof PLANS)[PlanId];

// Check if a phase is accessible based on subscription
export function canAccessPhase(phaseId: number, planId: PlanId): boolean {
  const plan = PLANS[planId];
  return (plan.limits.phases as readonly number[]).includes(phaseId);
}

// Get the required plan for a phase
export function getRequiredPlan(phaseId: number): PlanId {
  if (phaseId === 1) return 'free';
  return 'pro_monthly'; // or pro_yearly
}
