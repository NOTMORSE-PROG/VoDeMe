/**
 * Single Video Lesson API Route
 * GET - Fetch a single lesson with user progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Fetch lesson with user progress
    const lesson = await db.videoLesson.findUnique({
      where: { id },
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
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const userProgress = lesson.progress[0];

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        level: lesson.level,
        order: lesson.order,
        hasQuiz: !!lesson.quiz,
        quizId: lesson.quiz?.id,
        progress: userProgress
          ? {
              completed: userProgress.completed,
              watchedDuration: userProgress.watchedDuration,
              completedAt: userProgress.completedAt,
            }
          : {
              completed: false,
              watchedDuration: 0,
              completedAt: null,
            },
      },
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
