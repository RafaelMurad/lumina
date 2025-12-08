'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { canAccessPhase, PlanId } from '@/lib/stripe/config';

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: 'monthly' | 'yearly';
  currentPeriodEnd: Date;
  stripeCustomerId: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  isPro: boolean;
  planId: PlanId;
}

// Supabase row type
interface SubscriptionRow {
  id: string;
  status: string;
  plan: string;
  current_period_end: string;
  stripe_customer_id: string;
}

export function useSubscription() {
  const { user, isGuest } = useAuth();
  const supabase = createClient();

  const [state, setState] = useState<SubscriptionState>({
    subscription: null,
    isLoading: true,
    isPro: false,
    planId: 'free',
  });

  useEffect(() => {
    if (isGuest || !user) {
      setState({
        subscription: null,
        isLoading: false,
        isPro: false,
        planId: 'free',
      });
      return;
    }

    const loadSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned
          console.error('Error loading subscription:', error);
        }

        if (data) {
          const row = data as SubscriptionRow;
          const subscription: Subscription = {
            id: row.id,
            status: row.status as Subscription['status'],
            plan: row.plan as Subscription['plan'],
            currentPeriodEnd: new Date(row.current_period_end),
            stripeCustomerId: row.stripe_customer_id,
          };

          const isActive = row.status === 'active' || row.status === 'trialing';

          setState({
            subscription,
            isLoading: false,
            isPro: isActive,
            planId: isActive ? `pro_${row.plan}` as PlanId : 'free',
          });
        } else {
          setState({
            subscription: null,
            isLoading: false,
            isPro: false,
            planId: 'free',
          });
        }
      } catch (error) {
        console.error('Failed to load subscription:', error);
        setState((s) => ({ ...s, isLoading: false }));
      }
    };

    loadSubscription();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isGuest, supabase]);

  // Check if user can access a specific phase
  const checkPhaseAccess = useCallback(
    (phaseId: number): boolean => {
      return canAccessPhase(phaseId, state.planId);
    },
    [state.planId]
  );

  // Check if subscription is expiring soon (within 7 days)
  const isExpiringSoon = useCallback((): boolean => {
    if (!state.subscription) return false;
    const daysUntilExpiry = Math.ceil(
      (state.subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }, [state.subscription]);

  // Get days remaining in subscription
  const getDaysRemaining = useCallback((): number | null => {
    if (!state.subscription) return null;
    return Math.max(
      0,
      Math.ceil(
        (state.subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    );
  }, [state.subscription]);

  return {
    ...state,
    checkPhaseAccess,
    isExpiringSoon,
    getDaysRemaining,
  };
}
