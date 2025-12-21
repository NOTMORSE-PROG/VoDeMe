/**
 * Video Lessons API Route
 * GET - List all video lessons with user progress
 */

import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all lessons ordered by level and order
    const lessons = await db.videoLesson.findMany({
      orderBy: [
        { level: 'asc' },
        { order: 'asc' },
      ],
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
        progress: {
          where: {
            userId: auth.userId,
          },
          select: {
            completed: true,
            watchedDuration: true,
            completedAt: true,
          },
        },
      },
    });

    // Transform data to include user-friendly progress
    const lessonsWithProgress = lessons.map((lesson) => {
      const userProgress = lesson.progress[0];
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        level: lesson.level,
        order: lesson.order,
        hasQuiz: !!lesson.quiz,
        progress: userProgress
          ? {
              completed: userProgress.completed,
              watchedDuration: userProgress.watchedDuration,
              completedAt: userProgress.completedAt,
              percentage: Math.round(
                (userProgress.watchedDuration / lesson.duration) * 100
              ),
            }
          : {
              completed: false,
              watchedDuration: 0,
              completedAt: null,
              percentage: 0,
            },
      };
    });

    return NextResponse.json({ lessons: lessonsWithProgress });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
