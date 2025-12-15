/**
 * OAuth Utilities
 * Handles OAuth flows for Google and other providers
 */

'use server';

import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { env } from '@/lib/env';

/**
 * Google User Info from OAuth
 */
export interface GoogleUserInfo {
  id: string; // Google's user ID (sub)
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name?: string;
  picture: string;
  locale?: string;
}

/**
 * Google OAuth Token Response
 */
interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

/**
 * OAuth State Data
 */
export interface OAuthStateData {
  state: string;
  provider: string;
  mode: string;
  userId?: string;
  redirectUri?: string;
  expiresAt: Date;
}

/**
 * Generate OAuth state token and store in database
 * State tokens are used for CSRF protection in OAuth flow
 *
 * @param provider - OAuth provider (e.g., 'google')
 * @param mode - 'signin' (create/login account) or 'link' (link to existing account)
 * @param userId - User ID (required for link mode)
 * @param redirectUri - Post-auth redirect destination
 * @returns State token string
 */
export async function generateOAuthState(
  provider: string,
  mode: 'signin' | 'link',
  userId?: string,
  redirectUri?: string
): Promise<string> {
  // Generate cryptographically secure random state token
  const state = randomBytes(32).toString('hex');

  // State tokens expire in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Store state in database for verification
  await db.oAuthState.create({
    data: {
      state,
      provider,
      mode,
      userId: userId || null,
      redirectUri: redirectUri || null,
      expiresAt,
    },
  });

  return state;
}

/**
 * Verify OAuth state token
 * Validates state token and returns associated data
 * Deletes state token after verification (single-use)
 *
 * @param state - State token to verify
 * @returns State data if valid, null if invalid/expired
 */
export async function verifyOAuthState(
  state: string | null
): Promise<OAuthStateData | null> {
  if (!state) return null;

  // Find and delete state token (single-use)
  const stateRecord = await db.oAuthState.findUnique({
    where: { state },
  });

  if (!stateRecord) return null;

  // Delete state token immediately (single-use)
  await db.oAuthState.delete({
    where: { state },
  });

  // Check if expired
  if (stateRecord.expiresAt < new Date()) {
    return null;
  }

  return {
    state: stateRecord.state,
    provider: stateRecord.provider,
    mode: stateRecord.mode,
    userId: stateRecord.userId || undefined,
    redirectUri: stateRecord.redirectUri || undefined,
    expiresAt: stateRecord.expiresAt,
  };
}

/**
 * Build Google OAuth authorization URL
 * Constructs the URL to redirect user to Google consent screen
 *
 * @param state - State token for CSRF protection
 * @returns Google authorization URL
 */
export async function getGoogleAuthUrl(state: string): Promise<string> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID.');
  }

  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Determine redirect URI based on environment
  const redirectUri =
    env.NODE_ENV === 'production'
      ? 'https://vodeme.vercel.app/api/auth/callback/google'
      : `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline', // Request refresh token
    prompt: 'consent', // Force consent screen to get refresh token
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access tokens
 * Trades the OAuth authorization code for access and refresh tokens
 *
 * @param code - Authorization code from Google
 * @returns Token response with access_token, refresh_token, etc.
 */
export async function exchangeGoogleCode(
  code: string
): Promise<GoogleTokenResponse> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
  }

  // Determine redirect URI (must match the one used in authorization)
  const redirectUri =
    env.NODE_ENV === 'production'
      ? 'https://vodeme.vercel.app/api/auth/callback/google'
      : `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

  const tokenUrl = 'https://oauth2.googleapis.com/token';

  const params = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Google token exchange error:', error);
    throw new Error('Failed to exchange code for tokens');
  }

  const tokens: GoogleTokenResponse = await response.json();
  return tokens;
}

/**
 * Fetch user info from Google
 * Retrieves user profile information using access token
 *
 * @param accessToken - Google OAuth access token
 * @returns Google user profile information
 */
export async function getGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  const response = await fetch(userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Google user info error:', error);
    throw new Error('Failed to fetch user info from Google');
  }

  const userInfo: GoogleUserInfo = await response.json();
  return userInfo;
}

/**
 * Clean up expired OAuth state tokens
 * Should be called periodically (e.g., via cron job)
 */
export async function cleanupExpiredOAuthStates(): Promise<number> {
  const result = await db.oAuthState.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
