/**
 * Dashboard Page - Protected Route
 */

import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const auth = await verifyAuth();

  if (!auth) {
    redirect('/auth/signin');
  }

  // Fetch user data
  const user = await db.user.findUnique({
    where: { id: auth.userId },
    select: {
      email: true,
      name: true,
      profilePicture: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return <DashboardClient user={user} />;
}
