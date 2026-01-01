/**
 * Game Progress API Route
 * GET - Get all game progress for authenticated user
 * POST - Save/update game progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for game progress
const gameProgressSchema = z.object({
  gameName: z.enum(['synohit', 'hopright', 'wordstudyjournal']),
  level: z.number().int().min(1).max(3),
  score: z.number().int().min(0).max(10),
});

// GET /api/games/progress - Get all game progress for user
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all game progress for the user
    const progress = await db.gameProgress.findMany({
      where: {
        userId: auth.userId,
      },
      orderBy: [
        { gameName: 'asc' },
        { level: 'asc' },
      ],
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

// POST /api/games/progress - Save/update game progress
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = gameProgressSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { gameName, level, score } = validation.data;

    // Check if user already has a record for this game/level
    const existingProgress = await db.gameProgress.findUnique({
      where: {
        userId_gameName_level: {
          userId: auth.userId,
          gameName,
          level,
        },
      },
    });

    // If record exists, don't update (first attempt only)
    if (existingProgress) {
      return NextResponse.json({
        progress: existingProgress,
        isFirstAttempt: false,
        message: 'Only first attempt is recorded. This score will not be saved.',
        currentScore: score,
        recordedScore: existingProgress.score,
      });
    }

    // If no record exists, create it (always mark as completed since there's no failing score)
    const progress = await db.gameProgress.create({
      data: {
        userId: auth.userId,
        gameName,
        level,
        score,
        completed: true,
      },
    });

    return NextResponse.json({
      progress,
      isFirstAttempt: true,
      message: 'First attempt recorded',
    });
  } catch (error) {
    console.error('Error saving game progress:', error);
    return NextResponse.json(
      { error: 'Failed to save game progress' },
      { status: 500 }
    );
  }
}
