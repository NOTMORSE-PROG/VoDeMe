/**
 * Leaderboard API Route
 * GET - Get top players ranked by total points
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all users with their game progress and quiz attempts
    const usersWithProgress = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        gameProgress: {
          select: {
            score: true,
            completed: true,
          },
        },
        quizAttempts: {
          select: {
            score: true,
          },
        },
      },
    });

    // Calculate total points for each user
    const leaderboard = usersWithProgress.map(user => {
      // Sum up scores from ALL game levels (each score is out of 10, multiply by 10 for points)
      const gamePoints = user.gameProgress
        .reduce((sum, progress) => sum + (progress.score * 10), 0);

      // Sum up scores from ALL quiz attempts (score is already 0-100 percentage)
      const quizPoints = user.quizAttempts
        .reduce((sum, attempt) => sum + attempt.score, 0);

      const totalPoints = gamePoints + quizPoints;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        points: totalPoints,
      };
    });

    // Sort by points descending
    const sortedLeaderboard = leaderboard
      .filter(user => user.points > 0) // Only include users with points
      .sort((a, b) => b.points - a.points);

    // Add rank
    const rankedLeaderboard = sortedLeaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard: rankedLeaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
