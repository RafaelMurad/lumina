import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe/server';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';

// Service role client for admin operations
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  { auth: { persistSession: false } }
);

// GDPR Article 17: Right to erasure ("right to be forgotten")
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limit: prevent abuse
    const rateLimitResult = rateLimit(`delete:${user.id}`, RATE_LIMITS.auth);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Verify request body contains confirmation
    const body = await request.json().catch(() => ({}));
    if (body.confirm !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        { message: 'Please confirm deletion by sending { "confirm": "DELETE_MY_ACCOUNT" }' },
        { status: 400 }
      );
    }

    // 1. Cancel any active Stripe subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (subscription) {
      const sub = subscription as { stripe_subscription_id: string; stripe_customer_id: string };

      try {
        // Cancel subscription immediately (not at period end)
        if (sub.stripe_subscription_id) {
          await stripe.subscriptions.cancel(sub.stripe_subscription_id);
        }

        // Note: We keep Stripe customer for legal/accounting purposes
        // but can anonymize it if needed
      } catch (stripeError) {
        console.error('Stripe cancellation error:', stripeError);
        // Continue with deletion even if Stripe fails
      }
    }

    // 2. Delete all user data from database (CASCADE should handle related tables)
    // Order matters due to foreign key constraints
    const deletionOrder = [
      'user_achievements',
      'lesson_progress',
      'user_progress',
      'subscriptions',
      'saved_projects',
      'profiles',
    ];

    for (const table of deletionOrder) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('user_id', user.id);

      if (error && error.code !== 'PGRST116') { // Ignore "no rows" errors
        console.error(`Error deleting from ${table}:`, error);
      }
    }

    // 3. Delete the auth user (this requires admin/service role)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      return NextResponse.json(
        { message: 'Failed to delete account. Please contact support.' },
        { status: 500 }
      );
    }

    // 4. Log deletion for compliance audit trail (anonymized)
    console.log(`Account deleted: ${user.id.slice(0, 8)}*** at ${new Date().toISOString()}`);

    return NextResponse.json({
      message: 'Account successfully deleted',
      deletedAt: new Date().toISOString(),
      note: 'Your session has been invalidated. You will be signed out.',
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { message: 'Failed to delete account. Please contact support.' },
      { status: 500 }
    );
  }
}

// Provide info about deletion
export async function GET() {
  return NextResponse.json({
    message: 'Account Deletion Information',
    process: [
      '1. Active subscriptions will be cancelled immediately',
      '2. All learning progress and achievements will be permanently deleted',
      '3. Your profile and settings will be removed',
      '4. Your authentication account will be deleted',
    ],
    warning: 'This action is IRREVERSIBLE. All your data will be permanently deleted.',
    howToDelete: 'Send a DELETE request to this endpoint with body: { "confirm": "DELETE_MY_ACCOUNT" }',
    dataRetained: [
      'Stripe payment records (required for accounting/legal)',
      'Anonymized audit logs (required for security)',
    ],
    support: 'Contact support@lumina.dev if you need assistance',
  });
}
