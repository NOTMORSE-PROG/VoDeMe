/**
 * Environment Variable Validation
 * Validates and provides type-safe access to environment variables
 * Using Zod for runtime validation
 */

import { z } from 'zod';

// Allow build without env vars (they'll be validated at runtime)
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

const envSchema = z.object({
  // Database
  DATABASE_URL: isBuild
    ? z.string().optional()
    : z.string().min(1, 'DATABASE_URL is required'),

  // Authentication
  JWT_SECRET: isBuild
    ? z.string().optional()
    : z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  SESSION_SECRET: isBuild
    ? z.string().optional()
    : z
        .string()
        .min(32, 'SESSION_SECRET must be at least 32 characters'),

  // UploadThing
  UPLOADTHING_TOKEN: isBuild
    ? z.string().optional()
    : z.string().min(1, 'UPLOADTHING_TOKEN is required'),

  // Rate Limiting (Optional)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Public URLs
  NEXT_PUBLIC_APP_URL: isBuild
    ? z.string().optional()
    : z.string().url(),
  NEXT_PUBLIC_APP_NAME: isBuild ? z.string().optional() : z.string(),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Validate environment variables at startup
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;

// Type-safe access to environment variables
export type Env = z.infer<typeof envSchema>;
