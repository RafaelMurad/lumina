import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    const customerId = (subscription as { stripe_customer_id: string } | null)?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { message: 'No subscription found' },
        { status: 404 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await createPortalSession({
      customerId,
      returnUrl: `${origin}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
