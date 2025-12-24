/**
 * Learning Wall API Route
 * GET - Get all learning wall posts for a lesson
 * POST - Create a new learning wall post (requires lesson completion)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { learningWallPostSchema } from '@/lib/validation';

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
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'recent'; // recent, popular, oldest

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

    // Get all learning wall posts for this lesson
    const posts = await db.learningWallPost.findMany({
      where: { lessonId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: sortBy === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' },
    });

    // Transform posts to include like count and if current user liked
    let postsWithLikes = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      user: post.user,
      likeCount: post._count.likes,
      isLikedByUser: post.likes.some((like) => like.userId === auth.userId),
    }));

    // Sort by popularity if requested (client-side sorting after fetching)
    if (sortBy === 'popular') {
      postsWithLikes = postsWithLikes.sort((a, b) => b.likeCount - a.likeCount);
    }

    // Check if current user has already posted to this lesson
    const hasUserPosted = posts.some((post: any) => post.userId === auth.userId);

    return NextResponse.json({ posts: postsWithLikes, hasUserPosted });
  } catch (error) {
    console.error('Error fetching learning wall posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning wall posts' },
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
    const validation = learningWallPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { content } = validation.data;

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

    // Check if user has completed the lesson
    const progress = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId: id,
        },
      },
    });

    if (!progress || !progress.completed) {
      return NextResponse.json(
        { error: 'You must complete the lesson before posting to the learning wall' },
        { status: 403 }
      );
    }

    // Create the learning wall post
    const post = await db.learningWallPost.create({
      data: {
        userId: auth.userId,
        lessonId: id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error creating learning wall post:', error);
    return NextResponse.json(
      { error: 'Failed to create learning wall post' },
      { status: 500 }
    );
  }
}
