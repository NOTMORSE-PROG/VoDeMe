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

  // Fetch user data from database
  const user = await db.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true,
      createdAt: true,
      status: true,
    },
  });

  if (!user) {
    redirect('/');
  }

  return <ProfileClient user={user} />;
}
