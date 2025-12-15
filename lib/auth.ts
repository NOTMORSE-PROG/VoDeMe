/**
 * Authentication Utilities
 * Server-only functions for session management and user authentication
 * IMPORTANT: This file should never be imported in client components
 */

import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { env } from '@/lib/env';

const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);
const SESSION_COOKIE_NAME = 'vodeme_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
}

/**
 * Creates a JWT token for a user
 * Short-lived token (1 hour) for API requests
 */
export async function createJWT(userId: string): Promise<string> {
  return new SignJWT({ userId, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .setIssuer(env.NEXT_PUBLIC_APP_NAME)
    .setAudience(env.NEXT_PUBLIC_APP_NAME)
    .sign(jwtSecret);
}

/**
 * Verifies a JWT token
 */
export async function verifyJWT(token: string): Promise<AuthUser | null> {
  try {
    const verified = await jwtVerify(token, jwtSecret, {
      issuer: env.NEXT_PUBLIC_APP_NAME,
      audience: env.NEXT_PUBLIC_APP_NAME,
    });

    const payload = verified.payload as { userId: string };

    // Fetch user from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Creates a new session for a user
 * Stores session token in database and sets httpOnly cookie
 */
export async function createSession(
  userId: string,
  request?: Request
): Promise<void> {
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Extract request metadata
  const ipAddress = request?.headers.get('x-forwarded-for') ?? undefined;
  const userAgent = request?.headers.get('user-agent') ?? undefined;

  // Store session in database
  await db.session.create({
    data: {
      token: sessionToken,
      userId,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  // Set httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });

  // Create audit log
  await db.auditLog.create({
    data: {
      userId,
      action: 'login',
      entity: 'session',
      entityId: sessionToken,
      ipAddress,
      userAgent,
    },
  });
}

/**
 * Verifies the current session
 * Returns user data if session is valid, null otherwise
 */
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    // Find session in database
    const session = await db.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
          },
        },
      },
    });

    // Validate session
    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      // Session expired, delete it
      await db.session.delete({ where: { id: session.id } });
      return null;
    }

    if (session.user.status !== 'active') {
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Destroys the current session (logout)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    // Get session to log userId
    const session = await db.session.findUnique({
      where: { token: sessionToken },
      select: { id: true, userId: true },
    });

    // Delete session from database
    await db.session.delete({
      where: { token: sessionToken },
    });

    // Create audit log
    if (session) {
      await db.auditLog.create({
        data: {
          userId: session.userId,
          action: 'logout',
          entity: 'session',
          entityId: sessionToken,
        },
      });
    }
  }

  // Clear cookie
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Gets the current authenticated user
 * Throws an error if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await verifyAuth();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Cleans up expired sessions (should be run periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
