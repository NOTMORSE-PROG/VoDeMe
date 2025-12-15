/**
 * Password Hashing Utilities
 * Uses Argon2id (OWASP recommended as of 2025)
 *
 * Security Configuration:
 * - Algorithm: Argon2id (resistant to side-channel and GPU attacks)
 * - Memory Cost: 128 MiB (OWASP recommended)
 * - Time Cost: 3 iterations (balanced security/performance)
 * - Parallelism: 1 (sequential processing)
 */

import argon2 from 'argon2';

/**
 * Hashes a password using Argon2id
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 128 * 1024, // 128 MiB
    timeCost: 3, // 3 iterations
    parallelism: 1,
  });
}

/**
 * Verifies a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    // Log error but don't expose details
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Password strength validator
 * Checks if password meets security requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (password.length > 100) {
    errors.push('Password must be less than 100 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
