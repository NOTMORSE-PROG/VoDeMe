/**
 * Google OAuth Callback Handler
 * Processes OAuth callback from Google, creates/links accounts, manages sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyOAuthState,
  exchangeGoogleCode,
  getGoogleUserInfo,
} from '@/lib/oauth';
import { createSession, verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle user denial or errors from Google
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(
          `/auth/signin?error=${encodeURIComponent('Google sign-in was cancelled')}`,
          request.url
        )
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=missing_parameters', request.url)
      );
    }

    // Verify state token (CSRF protection)
    const stateData = await verifyOAuthState(state);
    if (!stateData) {
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=invalid_state',
          request.url
        )
      );
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeGoogleCode(code);

    // Fetch user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Handle based on mode (signin or link)
    if (stateData.mode === 'signin') {
      // SIGN IN MODE: Create new account or sign in existing user
      return await handleSignInMode(
        googleUser,
        tokens,
        expiresAt,
        stateData.redirectUri || '/dashboard',
        request
      );
    } else {
      // LINK MODE: Link Google to existing account
      return await handleLinkMode(
        googleUser,
        tokens,
        expiresAt,
        stateData.userId!,
        stateData.redirectUri || '/profile',
        request
      );
    }
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_failed', request.url)
    );
  }
}

/**
 * Handle sign in mode: create account or sign in
 */
async function handleSignInMode(
  googleUser: any,
  tokens: any,
  expiresAt: Date,
  redirectUri: string,
  request: NextRequest
) {
  // Check if user with this email exists
  const existingUser = await db.user.findUnique({
    where: { email: googleUser.email },
    include: {
      accounts: {
        where: { provider: 'google' },
      },
    },
  });

  if (existingUser) {
    // User exists - check if Google account is already linked
    if (existingUser.accounts.length > 0) {
      // Google account already linked - sign in
      await createSession(existingUser.id);

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: existingUser.id,
          action: 'login',
          entity: 'user',
          entityId: existingUser.id,
          newData: { method: 'google' },
        },
      });

      return NextResponse.redirect(new URL(redirectUri, request.url));
    } else {
      // User exists but Google not linked
      // Direct them to sign in with password and link from profile
      return NextResponse.redirect(
        new URL(
          `/auth/signin?error=${encodeURIComponent(
            'An account with this email already exists. Please sign in with your password and link Google from your profile settings.'
          )}`,
          request.url
        )
      );
    }
  } else {
    // User doesn't exist - create new account with Google
    const newUser = await db.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        passwordHash: null, // Google-only user
        profilePicture: googleUser.picture,
        emailVerified: new Date(), // Google verifies emails
        status: 'active',
        accounts: {
          create: {
            provider: 'google',
            providerAccountId: googleUser.id,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt,
            tokenType: tokens.token_type,
            scope: tokens.scope,
            providerData: {
              email: googleUser.email,
              name: googleUser.name,
              picture: googleUser.picture,
              verified_email: googleUser.verified_email,
            },
          },
        },
      },
    });

    // Create session
    await createSession(newUser.id);

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: newUser.id,
        action: 'signup',
        entity: 'user',
        entityId: newUser.id,
        newData: {
          email: newUser.email,
          name: newUser.name,
          method: 'google',
        },
      },
    });

    return NextResponse.redirect(new URL(redirectUri, request.url));
  }
}

/**
 * Handle link mode: link Google to existing authenticated user
 */
async function handleLinkMode(
  googleUser: any,
  tokens: any,
  expiresAt: Date,
  userId: string,
  redirectUri: string,
  request: NextRequest
) {
  // Verify user is still authenticated
  const auth = await verifyAuth();
  if (!auth || auth.userId !== userId) {
    return NextResponse.redirect(
      new URL('/auth/signin?error=session_expired', request.url)
    );
  }

  // Check if this Google account is already linked to ANY user
  const existingAccount = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: googleUser.id,
      },
    },
  });

  if (existingAccount) {
    return NextResponse.redirect(
      new URL(
        `/profile?error=${encodeURIComponent(
          'This Google account is already linked to another user.'
        )}`,
        request.url
      )
    );
  }

  // Check if user already has a Google account linked
  const userGoogleAccount = await db.account.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: 'google',
      },
    },
  });

  if (userGoogleAccount) {
    return NextResponse.redirect(
      new URL(
        `/profile?error=${encodeURIComponent(
          'You already have a Google account linked. Unlink it first to link a different one.'
        )}`,
        request.url
      )
    );
  }

  // Link Google account to user
  await db.account.create({
    data: {
      userId,
      provider: 'google',
      providerAccountId: googleUser.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      tokenType: tokens.token_type,
      scope: tokens.scope,
      providerData: {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        verified_email: googleUser.verified_email,
      },
    },
  });

  // Update profile picture if not set
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { profilePicture: true },
  });

  if (!user?.profilePicture && googleUser.picture) {
    await db.user.update({
      where: { id: userId },
      data: { profilePicture: googleUser.picture },
    });
  }

  // Create audit log
  await db.auditLog.create({
    data: {
      userId,
      action: 'account_link',
      entity: 'account',
      entityId: userId,
      newData: {
        provider: 'google',
        email: googleUser.email,
      },
    },
  });

  return NextResponse.redirect(
    new URL(
      `${redirectUri}?success=${encodeURIComponent('Google account linked successfully')}`,
      request.url
    )
  );
}
