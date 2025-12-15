/**
 * UploadThing API Route Handler
 * Handles file upload requests
 */

import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
