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
      quiz: {
        include: {
          attempts: {
            where: {
              userId: auth.userId,
            },
            orderBy: {
              completedAt: 'desc',
            },
            take: 1,
          },
        },
      },
    },
  });

  const lessonsWithProgress = lessons.map((lesson) => {
    const userProgress = lesson.progress[0];
    const hasQuiz = !!lesson.quiz;
    const quizCompleted = hasQuiz && lesson.quiz?.attempts && lesson.quiz.attempts.length > 0;
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      completed: userProgress?.completed || false,
      watchedDuration: userProgress?.watchedDuration || 0,
      progress: userProgress ? Math.round((userProgress.watchedDuration / lesson.duration) * 100) : 0,
      hasQuiz,
      quizCompleted,
    };
  });

  // Calculate stats
  const lessonsCompleted = lessonsWithProgress.filter(lesson => lesson.completed).length;

  const quizzesCompleted = await db.quizAttempt.count({
    where: {
      userId: auth.userId,
    },
  });

  // Get ALL quiz scores for total points calculation (to match leaderboard)
  const quizAttempts = await db.quizAttempt.findMany({
    where: {
      userId: auth.userId,
    },
    select: {
      score: true,
    },
  });

  // Get game scores
  const gameProgress = await db.gameProgress.findMany({
    where: {
      userId: auth.userId,
    },
    select: {
      score: true, // Score out of 10
    },
  });

  // Calculate total points
  // - Quiz scores (0-100 per quiz)
  // - Game scores (converted: score out of 10 → multiply by 10 to get 0-100 scale)
  const quizPoints = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const gamePoints = gameProgress.reduce((sum, progress) => sum + (progress.score * 10), 0);
  const totalPoints = quizPoints + gamePoints;

  return <DashboardClient
    user={user}
    lessons={lessonsWithProgress}
    lessonsCompleted={lessonsCompleted}
    quizzesCompleted={quizzesCompleted}
    totalPoints={totalPoints}
  />;
}
