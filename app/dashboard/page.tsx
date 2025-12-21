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

  // Fetch video lessons with progress
  const lessons = await db.videoLesson.findMany({
    orderBy: [
      { level: 'asc' },
      { order: 'asc' },
    ],
    include: {
      progress: {
        where: {
          userId: auth.userId,
        },
        select: {
          completed: true,
          watchedDuration: true,
        },
      },
    },
  });

  const lessonsWithProgress = lessons.map((lesson) => {
    const userProgress = lesson.progress[0];
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      completed: userProgress?.completed || false,
      watchedDuration: userProgress?.watchedDuration || 0,
      progress: userProgress ? Math.round((userProgress.watchedDuration / lesson.duration) * 100) : 0,
    };
  });

  return <DashboardClient user={user} lessons={lessonsWithProgress} />;
}
