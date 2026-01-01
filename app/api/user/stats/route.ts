/**
 * User Stats API Route
 * GET - Get user's stats (points, lessons completed, quizzes completed)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get lessons completed count
    const lessonsCompleted = await db.lessonProgress.count({
      where: {
        userId: auth.userId,
        completed: true,
      },
    });

    // Get quizzes completed count (all quiz attempts)
    const quizzesCompleted = await db.quizAttempt.count({
      where: {
        userId: auth.userId,
      },
    });

    // Get ALL quiz scores for total points (to match leaderboard calculation)
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
        score: true,
      },
    });

    // Calculate total points
    // - Quiz scores (0-100 per quiz)
    // - Game scores (converted: score out of 10 -> multiply by 10 to get 0-100 scale)
    const quizPoints = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const gamePoints = gameProgress.reduce((sum, progress) => sum + (progress.score * 10), 0);
    const totalPoints = quizPoints + gamePoints;

    return NextResponse.json({
      totalPoints,
      lessonsCompleted,
      quizzesCompleted,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
