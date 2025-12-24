/**
 * Specific Game Progress API Route
 * GET - Get progress for a specific game
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameName: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { gameName } = await params;

    // Validate game name
    const validGames = ['synohit', 'hopright', 'wordstudyjournal'];
    if (!validGames.includes(gameName)) {
      return NextResponse.json(
        { error: 'Invalid game name' },
        { status: 400 }
      );
    }

    // Get progress for the specific game
    const progress = await db.gameProgress.findMany({
      where: {
        userId: auth.userId,
        gameName,
      },
      orderBy: {
        level: 'asc',
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching game progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game progress' },
      { status: 500 }
    );
  }
}
