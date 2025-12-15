/**
 * OAuth Profile Actions
 * Server actions for managing OAuth account linkage
 */

'use server';

import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Result type for OAuth actions
 */
export type OAuthActionResult =
  | { success: true; message?: string }
  | { success: false; errors: Record<string, string[]> };

/**
 * Unlink Google Account
 * Removes Google OAuth linkage from user account
 * Requires user to have a password set (can't unlink only auth method)
 */
export async function unlinkGoogleAction(): Promise<OAuthActionResult> {
  try {
    const auth = await requireAuth();

    // Check if user has a password set
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return {
        success: false,
        errors: { _form: ['User not found'] },
      };
    }

    if (!user.passwordHash) {
      return {
        success: false,
        errors: {
          _form: [
            'You must set a password before unlinking Google. It is your only way to sign in.',
          ],
        },
      };
    }

    // Delete Google account linkage
    await db.account.deleteMany({
      where: {
        userId: auth.userId,
        provider: 'google',
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: 'account_unlink',
        entity: 'account',
        entityId: auth.userId,
        oldData: { provider: 'google' },
      },
    });

    return {
      success: true,
      message: 'Google account unlinked successfully',
    };
  } catch (error) {
    console.error('Unlink Google error:', error);
    return {
      success: false,
      errors: { _form: ['An unexpected error occurred'] },
    };
  }
}
