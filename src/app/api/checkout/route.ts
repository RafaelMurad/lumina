import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/lib/security/rate-limit';
import { checkoutSchema, validateRequest } from '@/lib/security/validation';

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

    // Rate limit: 5 checkout attempts per minute
    const rateLimitResult = rateLimit(`checkout:${user.id}`, RATE_LIMITS.checkout);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: 'Too many checkout attempts. Please wait a moment.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = validateRequest(checkoutSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    const { priceId } = validation.data;
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await createCheckoutSession({
      priceId,
      userId: user.id,
      userEmail: user.email || '',
      successUrl: `${origin}/dashboard?success=true`,
      cancelUrl: `${origin}/pricing?canceled=true`,
    });

    return NextResponse.json(
      { sessionId: session.id },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
