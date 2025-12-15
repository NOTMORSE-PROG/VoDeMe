/**
 * UploadThing Core Configuration
 * Defines file upload routes and security middleware
 */

import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

const f = createUploadthing();

/**
 * File Router Configuration
 * Defines upload endpoints and their security rules
 */
export const ourFileRouter = {
  /**
   * Profile Picture Upload Route
   * - Authenticated users only
   * - Max 4MB
   * - Images only (PNG, JPG, JPEG, WebP)
   */
  profilePicture: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Verify user authentication
      const auth = await verifyAuth();

      if (!auth) {
        throw new UploadThingError('Unauthorized - You must be logged in to upload');
      }

      // Return metadata to be available in onUploadComplete
      return {
        userId: auth.userId,
        email: auth.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user profile with new picture URL
      await db.user.update({
        where: { id: metadata.userId },
        data: { profilePicture: file.url },
      });

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: metadata.userId,
          action: 'profile_update',
          entity: 'user',
          entityId: metadata.userId,
          newData: {
            profilePicture: file.url,
          },
        },
      });

      console.log('Profile picture uploaded:', {
        userId: metadata.userId,
        url: file.url,
      });

      // Return data to client
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
