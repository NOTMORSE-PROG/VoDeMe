/**
 * UploadThing Client Configuration
 * For profile picture uploads
 */

import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';

import type { OurFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

/**
 * Extract file key from UploadThing URL
 * UploadThing URLs format: https://utfs.io/f/{fileKey}
 */
export function extractFileKeyFromUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    // Check if it's an UploadThing URL
    if (url.includes('utfs.io/f/')) {
      const match = url.match(/utfs\.io\/f\/([^/?]+)/);
      return match ? match[1] : null;
    }

    // Also handle direct fileKey if passed
    if (!url.includes('http')) {
      return url;
    }

    return null;
  } catch (error) {
    console.error('Error extracting file key:', error);
    return null;
  }
}
