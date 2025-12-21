/**
 * Quiz API Route
 * GET - Fetch quiz for a lesson (only if lesson is completed)
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

    // Check if lesson exists and get progress
    const lesson = await db.videoLesson.findUnique({
      where: { id },
      include: {
        quiz: true,
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

    if (!lesson.quiz) {
      return NextResponse.json(
        { error: 'No quiz available for this lesson' },
        { status: 404 }
      );
    }

    // Check if user has completed the lesson
    const userProgress = lesson.progress[0];
    if (!userProgress || !userProgress.completed) {
      return NextResponse.json(
        { error: 'You must complete the lesson before accessing the quiz', locked: true },
        { status: 403 }
      );
    }

    // Get user's quiz attempts
    const attempts = await db.quizAttempt.findMany({
      where: {
        userId: auth.userId,
        quizId: lesson.quiz.id,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Return quiz without correct answers (they'll be validated on submission)
    const quizData = lesson.quiz.questions as any[];
    const questionsWithoutAnswers = quizData.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      quiz: {
        id: lesson.quiz.id,
        title: lesson.quiz.title,
        passingScore: lesson.quiz.passingScore,
        questions: questionsWithoutAnswers,
      },
      attempts: attempts.map((a) => ({
        id: a.id,
        score: a.score,
        passed: a.passed,
        completedAt: a.completedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
