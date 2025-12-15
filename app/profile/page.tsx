/**
 * Profile Page - Server Component
 * Fetches user data from database and passes to client component
 */

import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import ProfileClient from './profile-client';

export default async function ProfilePage() {
  // Verify authentication
  const auth = await verifyAuth();

  if (!auth) {
    redirect('/');
  }

  // Fetch user data from database including OAuth accounts
  const user = await db.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true,
      createdAt: true,
      status: true,
      passwordHash: true,
      accounts: {
        select: {
          provider: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/');
  }

  // Determine if user has password set
  const hasPassword = !!user.passwordHash;

  // Map linked providers for UI
  const linkedProviders = user.accounts.map((acc) => ({
    provider: acc.provider,
    linkedAt: acc.createdAt,
  }));

  // Remove passwordHash from user object before passing to client
  const { passwordHash, accounts, ...userWithoutPassword } = user;

  return (
    <ProfileClient
      user={userWithoutPassword}
      hasPassword={hasPassword}
      linkedProviders={linkedProviders}
    />
  );
}
