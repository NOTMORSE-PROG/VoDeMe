/**
 * Authentication Server Actions
 * Server-side functions for signup, login, and logout
 */

'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSession, destroySession } from '@/lib/auth';
import { signUpSchema, signInSchema } from '@/lib/validation';
import type { SignUpInput, SignInInput } from '@/lib/validation';

/**
 * Result types for authentication actions
 */
export type AuthResult =
  | { success: true }
  | { success: false; errors: Record<string, string[]> };

/**
 * Sign Up Action
 * Creates a new user account and establishes a session
 */
export async function signUpAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    // Parse and validate form data
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const parsed = signUpSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
      include: {
        accounts: {
          select: { provider: true },
        },
      },
    });

    if (existingUser) {
      // Check if user signed up with Google
      const hasGoogleAccount = existingUser.accounts.some(
        (acc) => acc.provider === 'google'
      );

      if (hasGoogleAccount) {
        return {
          success: false,
          errors: {
            email: [
              'This email is already registered with Google. Please use "Sign in with Google" button to access your account.',
            ],
          },
        };
      }

      // User has email/password account
      return {
        success: false,
        errors: {
          email: ['An account with this email already exists'],
        },
      };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        status: 'active',
      },
    });

    // Create audit log for account creation
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'signup',
        entity: 'user',
        entityId: user.id,
        newData: {
          email: user.email,
          name: user.name,
        },
      },
    });

    // Create session
    await createSession(user.id);
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }

  // Redirect to dashboard on success
  redirect('/dashboard');
}

/**
 * Sign In Action
 * Authenticates a user and establishes a session
 */
export async function signInAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  try {
    // Parse and validate form data
    const raw = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const parsed = signInSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Use generic error message to prevent email enumeration
      return {
        success: false,
        errors: {
          email: ['Invalid email or password'],
        },
      };
    }

    // Check if user has a password (might be Google-only account)
    if (!user.passwordHash) {
      return {
        success: false,
        errors: {
          email: [
            'This account uses Google sign-in. Please use "Sign in with Google" button above.',
          ],
        },
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return {
        success: false,
        errors: {
          email: ['Invalid email or password'],
        },
      };
    }

    // Check account status
    if (user.status !== 'active') {
      return {
        success: false,
        errors: {
          email: ['Your account has been suspended. Please contact support.'],
        },
      };
    }

    // Create session
    await createSession(user.id);
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }

  // Redirect to dashboard on success
  redirect('/dashboard');
}

/**
 * Sign Out Action
 * Destroys the current session
 */
export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect('/');
}

/**
 * Get user by email (for checking if email exists)
 * Used for client-side email validation
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return !!user;
}
