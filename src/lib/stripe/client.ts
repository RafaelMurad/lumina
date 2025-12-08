'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Client-side Stripe instance (singleton)
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Stripe publishable key not set');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

// Redirect to Stripe Checkout
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    throw error;
  }
}

// Create checkout session and redirect
export async function checkout(priceId: string) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const { sessionId } = await response.json();
  await redirectToCheckout(sessionId);
}

// Redirect to customer portal
export async function redirectToPortal() {
  const response = await fetch('/api/checkout/portal', {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create portal session');
  }

  const { url } = await response.json();
  window.location.href = url;
}
