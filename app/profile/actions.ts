/**
 * Profile Management Server Actions
 * Server-side functions for updating user profile
 */

'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { profileUpdateSchema, passwordChangeSchema } from '@/lib/validation';
import { hashPassword, verifyPassword } from '@/lib/password';
import { UTApi } from 'uploadthing/server';
import { extractFileKeyFromUrl } from '@/lib/uploadthing';

export type ProfileResult =
  | { success: true; message?: string }
  | { success: false; errors: Record<string, string[]> };

/**
 * Update Profile Action
 * Updates user's name, bio, or profile picture
 */
export async function updateProfileAction(
  prevState: ProfileResult | null,
  formData: FormData
): Promise<ProfileResult> {
  try {
    // Verify authentication
    const auth = await requireAuth();

    // Parse and validate form data
    const raw = {
      name: formData.get('name') || undefined,
    };

    const parsed = profileUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const updateData = parsed.data;

    // Get old data for audit log
    const oldUser = await db.user.findUnique({
      where: { id: auth.userId },
      select: {
        name: true,
        profilePicture: true,
      },
    });

    // Update user profile
    await db.user.update({
      where: { id: auth.userId },
      data: updateData,
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: 'profile_update',
        entity: 'user',
        entityId: auth.userId,
        oldData: oldUser ?? undefined,
        newData: updateData,
      },
    });

    // Revalidate the profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}

/**
 * Change Password Action
 * Updates user's password after verifying current password
 */
export async function changePasswordAction(
  prevState: ProfileResult | null,
  formData: FormData
): Promise<ProfileResult> {
  try {
    // Verify authentication
    const auth = await requireAuth();

    // Parse and validate form data
    const raw = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    };

    const parsed = passwordChangeSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { currentPassword, newPassword } = parsed.data;

    // Get user's current password hash
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has a password (might be Google-only account)
    if (!user.passwordHash) {
      return {
        success: false,
        errors: {
          _form: [
            'You signed up with Google and have no password set. Use the "Set Password" option below if you want to enable email/password login.',
          ],
        },
      };
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      return {
        success: false,
        errors: {
          currentPassword: ['Current password is incorrect'],
        },
      };
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db.user.update({
      where: { id: auth.userId },
      data: { passwordHash: newPasswordHash },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: 'password_change',
        entity: 'user',
        entityId: auth.userId,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}

/**
 * Delete Profile Picture Action
 * Deletes the profile picture from UploadThing storage and removes the database reference
 */
export async function deleteProfilePictureAction(): Promise<ProfileResult> {
  try {
    const auth = await requireAuth();

    // Get current profile picture URL
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: { profilePicture: true },
    });

    const oldProfilePicture = user?.profilePicture;

    // Delete from UploadThing storage if it's an UploadThing URL
    if (oldProfilePicture) {
      const fileKey = extractFileKeyFromUrl(oldProfilePicture);
      if (fileKey) {
        try {
          const utapi = new UTApi();
          await utapi.deleteFiles(fileKey);
          console.log('Deleted profile picture from storage:', fileKey);
        } catch (error) {
          console.error('Failed to delete from UploadThing:', error);
          // Continue with database update even if storage deletion fails
        }
      }
    }

    // Update database to remove profile picture reference
    await db.user.update({
      where: { id: auth.userId },
      data: { profilePicture: null },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: 'profile_update',
        entity: 'user',
        entityId: auth.userId,
        oldData: { profilePicture: oldProfilePicture },
        newData: { profilePicture: null },
      },
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile picture deleted',
    };
  } catch (error) {
    console.error('Delete profile picture error:', error);
    return {
      success: false,
      errors: {
        _form: ['Failed to delete profile picture'],
      },
    };
  }
}

/**
 * Set Password Action
 * Allows Google-only users to set a password for email/password login
 */
export async function setPasswordAction(
  prevState: ProfileResult | null,
  formData: FormData
): Promise<ProfileResult> {
  try {
    // Verify authentication
    const auth = await requireAuth();

    // Parse form data
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        errors: {
          confirmPassword: ["Passwords don't match"],
        },
      };
    }

    // Validate password strength using existing schema
    const { passwordSchema } = await import('@/lib/validation');
    const parsed = passwordSchema.safeParse(newPassword);

    if (!parsed.success) {
      return {
        success: false,
        errors: {
          newPassword: parsed.error.errors.map((e) => e.message),
        },
      };
    }

    // Check user doesn't already have password
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.passwordHash) {
      return {
        success: false,
        errors: {
          _form: [
            'Password already set. Use "Change Password" instead.',
          ],
        },
      };
    }

    // Hash and set password
    const passwordHash = await hashPassword(parsed.data);
    await db.user.update({
      where: { id: auth.userId },
      data: { passwordHash },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: auth.userId,
        action: 'password_set',
        entity: 'user',
        entityId: auth.userId,
        newData: { hasPassword: true },
      },
    });

    return {
      success: true,
      message:
        'Password set successfully! You can now sign in with email and password.',
    };
  } catch (error) {
    console.error('Set password error:', error);
    return {
      success: false,
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}
