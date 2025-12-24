/**
 * Quiz Submission API Route
 * POST - Submit quiz answers and get score
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { quizSubmissionSchema } from '@/lib/validation';

export async function POST(
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

    const { id: lessonId } = await params;
    const body = await request.json();

    // Validate request body
    const validation = quizSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { quizId, answers } = validation.data;

    // Fetch quiz with correct answers
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            progress: {
              where: {
                userId: auth.userId,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Verify this quiz belongs to the requested lesson
    if (quiz.lessonId !== lessonId) {
      return NextResponse.json(
        { error: 'Quiz does not belong to this lesson' },
        { status: 400 }
      );
    }

    // Check if lesson is completed
    const userProgress = quiz.lesson.progress[0];
    if (!userProgress || !userProgress.completed) {
      return NextResponse.json(
        { error: 'You must complete the lesson before taking the quiz' },
        { status: 403 }
      );
    }

    // Calculate score
    const quizQuestions = quiz.questions as any[];
    let correctAnswers = 0;

    const detailedResults = quizQuestions.map((question: any) => {
      const userAnswer = answers.find((a) => a.questionId === question.id);
      const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer?.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    // Calculate score: 20 points per correct answer
    const POINTS_PER_QUESTION = 20;
    const score = correctAnswers * POINTS_PER_QUESTION;
    const maxScore = quizQuestions.length * POINTS_PER_QUESTION;
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= quiz.passingScore;

    // Check if user already has attempts for this quiz
    const existingAttempts = await db.quizAttempt.findMany({
      where: {
        userId: auth.userId,
        quizId: quiz.id,
      },
      orderBy: {
        completedAt: 'asc',
      },
    });

    const isFirstAttempt = existingAttempts.length === 0;
    let attempt;

    // Only save if this is the first attempt
    if (isFirstAttempt) {
      attempt = await db.quizAttempt.create({
        data: {
          userId: auth.userId,
          quizId: quiz.id,
          score,
          answers: answers,
          passed,
        },
      });
    } else {
      // Use the first attempt for the recorded score
      attempt = existingAttempts[0];
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score: isFirstAttempt ? score : attempt.score,
        passed: isFirstAttempt ? passed : attempt.passed,
        passingScore: quiz.passingScore,
        correctAnswers: isFirstAttempt ? correctAnswers : undefined,
        totalQuestions: quizQuestions.length,
        maxScore: maxScore,
        percentage: isFirstAttempt ? percentage : Math.round((attempt.score / maxScore) * 100),
        results: isFirstAttempt ? detailedResults : undefined,
        completedAt: attempt.completedAt,
        isFirstAttempt,
        recordedScore: attempt.score,
        currentScore: score,
        currentPercentage: percentage,
        currentCorrectAnswers: correctAnswers,
        currentResults: detailedResults,
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
