/**
 * Google OAuth Initiation Route
 * Redirects user to Google consent screen
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateOAuthState, getGoogleAuthUrl } from '@/lib/oauth';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'signin') as 'signin' | 'link';
    const redirect = searchParams.get('redirect') || '/dashboard';

    let userId: string | undefined;

    // For link mode, verify user is authenticated
    if (mode === 'link') {
      const auth = await verifyAuth();
      if (!auth) {
        // User not authenticated, redirect to sign in
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      userId = auth.userId;
    }

    // Generate and store OAuth state token (CSRF protection)
    const state = await generateOAuthState('google', mode, userId, redirect);

    // Build Google authorization URL
    const authUrl = await getGoogleAuthUrl(state);

    // Redirect user to Google consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_init_failed', request.url)
    );
  }
}
