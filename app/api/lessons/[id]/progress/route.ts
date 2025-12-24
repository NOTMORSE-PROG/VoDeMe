/**
 * Lesson Progress API Route
 * GET - Get user's progress for a lesson
 * POST - Update user's progress for a lesson
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { lessonProgressUpdateSchema } from '@/lib/validation';

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

    // Check if lesson exists
    const lesson = await db.videoLesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get or create progress record
    let progress = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId: id,
        },
      },
    });

    if (!progress) {
      progress = await db.lessonProgress.create({
        data: {
          userId: auth.userId,
          lessonId: id,
        },
      });
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

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

    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validation = lessonProgressUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { watchedDuration, completed } = validation.data;

    // Check if lesson exists
    const lesson = await db.videoLesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Update or create progress
    const progress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId: id,
        },
      },
      update: {
        watchedDuration,
        completed: completed ?? (watchedDuration >= lesson.duration * 0.95), // Auto-complete if 95% watched
        completedAt:
          completed ?? (watchedDuration >= lesson.duration * 0.95)
            ? new Date()
            : undefined,
      },
      create: {
        userId: auth.userId,
        lessonId: id,
        watchedDuration,
        completed: completed ?? (watchedDuration >= lesson.duration * 0.95),
        completedAt:
          completed ?? (watchedDuration >= lesson.duration * 0.95)
            ? new Date()
            : undefined,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
