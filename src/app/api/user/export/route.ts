import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/lib/security/rate-limit';

// GDPR Article 20: Right to data portability
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limit: 3 exports per hour
    const rateLimitResult = rateLimit(`export:${user.id}`, RATE_LIMITS.export);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: 'Too many export requests. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Fetch all user data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type DbRecord = Record<string, any>;

    const [
      profileResult,
      progressResult,
      lessonsResult,
      achievementsResult,
      subscriptionResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_progress').select('*').eq('user_id', user.id).single(),
      supabase.from('lesson_progress').select('*').eq('user_id', user.id),
      supabase.from('user_achievements').select('*').eq('user_id', user.id),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    ]);

    const profile = profileResult.data as DbRecord | null;
    const progress = progressResult.data as DbRecord | null;
    const lessons = lessonsResult.data as DbRecord[] | null;
    const achievements = achievementsResult.data as DbRecord[] | null;
    const subscription = subscriptionResult.data as DbRecord | null;

    // Compile export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      dataRetentionPolicy: 'Data is retained while your account is active',

      account: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        provider: user.app_metadata?.provider,
      },

      profile: profile ? {
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
        subscriptionTier: profile.subscription_tier,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      } : null,

      progress: progress ? {
        level: progress.level,
        currentXP: progress.current_xp,
        totalXP: progress.total_xp,
        streakDays: progress.streak_days,
        lastActiveAt: progress.last_active_at,
      } : null,

      lessonProgress: lessons?.map(l => ({
        lessonId: l.lesson_id,
        status: l.status,
        attempts: l.attempts,
        hintsUsed: l.hints_used,
        timeSpentSeconds: l.time_spent_seconds,
        completedAt: l.completed_at,
      })) || [],

      achievements: achievements?.map(a => ({
        achievementId: a.achievement_id,
        unlockedAt: a.created_at,
      })) || [],

      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        // Note: Stripe customer ID excluded for security
      } : null,

      dataCategories: {
        accountData: 'Email, authentication provider, account creation date',
        progressData: 'XP, level, streak, lesson completion status',
        subscriptionData: 'Plan type, subscription status',
        usageData: 'Time spent on lessons, hints used',
      },
    };

    // Return as downloadable JSON
    const headers = new Headers(getRateLimitHeaders(rateLimitResult));
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="lumina-data-export-${new Date().toISOString().split('T')[0]}.json"`);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { message: 'Failed to export data' },
      { status: 500 }
    );
  }
}
