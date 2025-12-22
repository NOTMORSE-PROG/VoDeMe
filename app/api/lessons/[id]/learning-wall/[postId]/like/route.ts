/**
 * Learning Wall Like API Route
 * POST - Toggle like on a post (like if not liked, unlike if already liked)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
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

    const { postId } = await params;

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

    // Check if user already liked this post
    const existingLike = await db.learningWallLike.findUnique({
      where: {
        userId_postId: {
          userId: auth.userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Delete the like
      await db.learningWallLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Get updated like count
      const likeCount = await db.learningWallLike.count({
        where: { postId },
      });

      return NextResponse.json({
        liked: false,
        likeCount,
        message: 'Post unliked'
      });
    } else {
      // Like: Create new like
      await db.learningWallLike.create({
        data: {
          userId: auth.userId,
          postId,
        },
      });

      // Get updated like count
      const likeCount = await db.learningWallLike.count({
        where: { postId },
      });

      return NextResponse.json({
        liked: true,
        likeCount,
        message: 'Post liked'
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
