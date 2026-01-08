/**
 * Learning Wall Post API Route
 * PATCH - Edit a learning wall post (only by post author)
 * DELETE - Delete a learning wall post (only by post author)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { learningWallPostSchema } from '@/lib/validation';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, postId } = await params;
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

    // Check if post exists
    const post = await db.learningWallPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Verify the post belongs to the lesson
    if (post.lessonId !== id) {
      return NextResponse.json(
        { error: 'Post does not belong to this lesson' },
        { status: 400 }
      );
    }

    // Verify the user owns the post
    if (post.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own posts' },
        { status: 403 }
      );
    }

    // Update the post
    const updatedPost = await db.learningWallPost.update({
      where: { id: postId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Transform to match frontend format
    const postWithLikes = {
      id: updatedPost.id,
      content: updatedPost.content,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
      user: updatedPost.user,
      likeCount: updatedPost._count.likes,
      isLikedByUser: updatedPost.likes.some((like) => like.userId === auth.userId),
    };

    return NextResponse.json({ post: postWithLikes });
  } catch (error) {
    console.error('Error updating learning wall post:', error);
    return NextResponse.json(
      { error: 'Failed to update learning wall post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, postId } = await params;

    // Check if post exists
    const post = await db.learningWallPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Verify the post belongs to the lesson
    if (post.lessonId !== id) {
      return NextResponse.json(
        { error: 'Post does not belong to this lesson' },
        { status: 400 }
      );
    }

    // Verify the user owns the post
    if (post.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      );
    }

    // Delete the post (likes will be cascade deleted)
    await db.learningWallPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting learning wall post:', error);
    return NextResponse.json(
      { error: 'Failed to delete learning wall post' },
      { status: 500 }
    );
  }
}
